const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, region, sentiment, emotion, count = 10 } = await req.json()
    
    // Get Twitter API Bearer Token from environment variables
    const TWITTER_BEARER_TOKEN = Deno.env.get('TWITTER_BEARER_TOKEN')
    
    if (!TWITTER_BEARER_TOKEN) {
      console.error('Twitter Bearer Token not configured')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Twitter API credentials not configured. Please set TWITTER_BEARER_TOKEN environment variable.',
          fallback: true
        }),
        { 
          status: 200,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }
    
    // Build search query based on filters
    let searchQuery = query || 'sentiment OR emotion OR feeling'
    
    // Add region-specific keywords
    if (region && region !== 'global') {
      const regionKeywords = {
        'asia': 'lang:ja OR lang:ko OR lang:zh OR place:japan OR place:korea OR place:china OR place:india',
        'europe': 'lang:en OR lang:fr OR lang:de OR lang:es OR place:uk OR place:france OR place:germany',
        'north-america': 'lang:en OR place:usa OR place:canada OR place:mexico',
        'south-america': 'lang:es OR lang:pt OR place:brazil OR place:argentina',
        'africa': 'place:nigeria OR place:south_africa OR place:egypt',
        'oceania': 'place:australia OR place:new_zealand'
      }
      
      if (regionKeywords[region]) {
        searchQuery += ` (${regionKeywords[region]})`
      }
    }
    
    // Add emotion-specific keywords
    if (emotion && emotion !== 'all') {
      const emotionKeywords = {
        'joy': 'happy OR excited OR celebration OR amazing OR wonderful',
        'sadness': 'sad OR disappointed OR heartbroken OR crying OR grief',
        'anger': 'angry OR frustrated OR outraged OR furious OR mad',
        'fear': 'scared OR worried OR anxious OR terrified OR afraid',
        'surprise': 'surprised OR shocked OR unexpected OR incredible OR wow'
      }
      
      if (emotionKeywords[emotion]) {
        searchQuery += ` (${emotionKeywords[emotion]})`
      }
    }
    
    // Twitter API v2 endpoint
    const twitterUrl = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(searchQuery)}&max_results=${count}&tweet.fields=created_at,author_id,public_metrics,geo&expansions=geo.place_id&place.fields=country,name,geo`
    
    console.log('Fetching from Twitter API with query:', searchQuery)
    
    const response = await fetch(twitterUrl, {
      headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Twitter API Error:', response.status, errorText)
      
      // Handle specific error cases
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Twitter API authentication failed. Please check your Bearer Token.',
            fallback: true
          }),
          { 
            status: 200,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }
      
      // Handle rate limiting (429) gracefully
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Twitter API rate limit exceeded. Using fallback data.',
            fallback: true
          }),
          { 
            status: 200,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }
      
      // For other errors, also return 200 with fallback flag
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Twitter API error: ${response.status} - ${errorText}`,
          fallback: true
        }),
        { 
          status: 200,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }
    
    const twitterData = await response.json()
    console.log('Twitter API Response:', JSON.stringify(twitterData, null, 2))
    
    // Process Twitter data into our format
    const processedTweets = []
    
    if (twitterData.data && twitterData.data.length > 0) {
      // Create a map of places if available
      const placesMap = new Map()
      if (twitterData.includes?.places) {
        twitterData.includes.places.forEach(place => {
          placesMap.set(place.id, place)
        })
      }
      
      for (const tweet of twitterData.data) {
        // Get location data
        let location = {
          lat: 0,
          lng: 0,
          city: 'Unknown',
          country: 'Unknown'
        }
        
        // Try to get location from geo data
        if (tweet.geo?.place_id && placesMap.has(tweet.geo.place_id)) {
          const place = placesMap.get(tweet.geo.place_id)
          if (place.geo?.bbox) {
            // Use center of bounding box
            const bbox = place.geo.bbox
            location.lat = (bbox[1] + bbox[3]) / 2
            location.lng = (bbox[0] + bbox[2]) / 2
          }
          location.city = place.name || 'Unknown'
          location.country = place.country || 'Unknown'
        } else {
          // Fallback to region-based coordinates
          const regionCoords = {
            'asia': { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' },
            'europe': { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
            'north-america': { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
            'south-america': { lat: -23.5505, lng: -46.6333, city: 'São Paulo', country: 'Brazil' },
            'africa': { lat: 30.0444, lng: 31.2357, city: 'Cairo', country: 'Egypt' },
            'oceania': { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia' }
          }
          
          if (region && regionCoords[region]) {
            location = regionCoords[region]
          }
        }
        
        // Basic sentiment analysis (simplified)
        const text = tweet.text.toLowerCase()
        let sentimentLabel = 'neutral'
        let sentimentScore = 0.5
        let confidence = 0.6
        
        const positiveWords = ['good', 'great', 'amazing', 'love', 'happy', 'excellent', 'wonderful', 'fantastic']
        const negativeWords = ['bad', 'terrible', 'hate', 'sad', 'awful', 'horrible', 'disappointed', 'angry']
        
        const positiveCount = positiveWords.filter(word => text.includes(word)).length
        const negativeCount = negativeWords.filter(word => text.includes(word)).length
        
        if (positiveCount > negativeCount) {
          sentimentLabel = 'positive'
          sentimentScore = 0.6 + (positiveCount * 0.1)
          confidence = Math.min(0.9, 0.6 + (positiveCount * 0.1))
        } else if (negativeCount > positiveCount) {
          sentimentLabel = 'negative'
          sentimentScore = 0.4 - (negativeCount * 0.1)
          confidence = Math.min(0.9, 0.6 + (negativeCount * 0.1))
        }
        
        // Basic emotion analysis
        const emotions = {
          joy: text.includes('happy') || text.includes('excited') || text.includes('love') ? 0.7 : 0.1,
          sadness: text.includes('sad') || text.includes('cry') || text.includes('disappointed') ? 0.7 : 0.1,
          anger: text.includes('angry') || text.includes('mad') || text.includes('frustrated') ? 0.7 : 0.1,
          fear: text.includes('scared') || text.includes('worried') || text.includes('afraid') ? 0.7 : 0.1,
          surprise: text.includes('wow') || text.includes('surprised') || text.includes('incredible') ? 0.7 : 0.1
        }
        
        // Extract keywords
        const keywords = tweet.text
          .split(/\s+/)
          .filter(word => word.length > 3)
          .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'were'].includes(word.toLowerCase()))
          .slice(0, 5)
        
        const processedTweet = {
          id: `twitter-${tweet.id}`,
          text: tweet.text,
          timestamp: tweet.created_at || new Date().toISOString(),
          location,
          source: 'twitter',
          sentiment: {
            label: sentimentLabel,
            score: sentimentScore,
            confidence
          },
          emotions,
          keywords,
          eventType: 'general'
        }
        
        processedTweets.push(processedTweet)
      }
    }
    
    console.log(`Processed ${processedTweets.length} tweets`)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: processedTweets,
        count: processedTweets.length,
        query: searchQuery
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
    
  } catch (error) {
    console.error('Error in twitter-feed function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        fallback: true
      }),
      { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})