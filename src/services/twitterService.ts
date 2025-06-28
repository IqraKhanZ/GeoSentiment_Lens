import { SentimentData } from '../types';

interface TwitterFilters {
  region: string;
  sentiment: string;
  emotion: string;
  query?: string;
  count?: number;
}

export const twitterService = {
  async fetchLiveTweets(filters: TwitterFilters): Promise<SentimentData[]> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      
      if (!supabaseUrl) {
        console.warn('Supabase URL not configured, using fallback data');
        return this.getFallbackData(filters);
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/twitter-feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          query: this.buildSearchQuery(filters),
          region: filters.region,
          sentiment: filters.sentiment,
          emotion: filters.emotion,
          count: filters.count || 10
        })
      });

      // Handle server errors (5xx) gracefully
      if (response.status >= 500) {
        console.warn(`Twitter API server error (${response.status}). This usually indicates missing environment variables or deployment issues. Using fallback data.`);
        return this.getFallbackData(filters);
      }

      if (!response.ok) {
        console.warn(`Twitter API request failed with status ${response.status}, using fallback data`);
        return this.getFallbackData(filters);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        console.log(`Fetched ${result.data.length} live tweets from Twitter API`);
        return result.data;
      } else {
        console.warn('Twitter API returned no data or indicated fallback needed, using fallback');
        return this.getFallbackData(filters);
      }
      
    } catch (error) {
      console.error('Twitter service error:', error);
      console.warn('Falling back to simulated data due to service error');
      return this.getFallbackData(filters);
    }
  },

  buildSearchQuery(filters: TwitterFilters): string {
    let query = '';
    
    // Base sentiment/emotion terms
    if (filters.emotion !== 'all') {
      const emotionQueries = {
        joy: 'happy OR excited OR celebration OR amazing OR wonderful OR love',
        sadness: 'sad OR disappointed OR heartbroken OR crying OR grief OR miss',
        anger: 'angry OR frustrated OR outraged OR furious OR mad OR hate',
        fear: 'scared OR worried OR anxious OR terrified OR afraid OR panic',
        surprise: 'surprised OR shocked OR unexpected OR incredible OR wow OR unbelievable'
      };
      query = emotionQueries[filters.emotion as keyof typeof emotionQueries] || '';
    } else if (filters.sentiment !== 'all') {
      const sentimentQueries = {
        positive: 'good OR great OR amazing OR love OR happy OR excellent OR wonderful',
        negative: 'bad OR terrible OR hate OR sad OR awful OR horrible OR disappointed',
        neutral: 'okay OR fine OR normal OR average OR standard'
      };
      query = sentimentQueries[filters.sentiment as keyof typeof sentimentQueries] || '';
    } else {
      query = 'feeling OR emotion OR mood OR sentiment';
    }
    
    // Add trending topics
    query += ' OR breaking OR news OR update OR trending';
    
    // Exclude retweets and replies for cleaner data
    query += ' -is:retweet -is:reply';
    
    return query;
  },

  getFallbackData(filters: TwitterFilters): SentimentData[] {
    // Return enhanced fallback data when Twitter API is unavailable
    const fallbackTexts = {
      joy: [
        "Just got the promotion I've been working towards! Dreams really do come true! 🎉",
        "Wedding planning is going perfectly! Can't wait to marry my best friend! 💕",
        "Baby said 'mama' for the first time today! Pure joy and happiness! 👶",
        "Concert was absolutely incredible! Music has the power to heal souls! 🎵"
      ],
      sadness: [
        "Lost my beloved grandmother today. She was the heart of our family. 💔",
        "Moving away from childhood home. So many memories in these walls. 😢",
        "Pet passed away peacefully. 15 years of unconditional love and loyalty. 🐕💔",
        "Best friend is moving across the country. Distance is so hard. 😔"
      ],
      anger: [
        "Traffic has been terrible for weeks! This city needs better infrastructure! 😡",
        "Customer service was incredibly rude today! Completely unacceptable behavior! 🤬",
        "Politicians breaking promises again! Fed up with lies and corruption! 😠",
        "Environmental destruction continues! Future generations will suffer! 🌍💢"
      ],
      fear: [
        "Earthquake warning issued for our area tonight. Worried about family safety. 😰",
        "Job layoffs announced at company. Scared about financial future ahead. 😨",
        "Medical test results pending. Anxiety about what doctors might find. 😟",
        "Climate change effects accelerating rapidly. Fear for planet's survival. 🌍😰"
      ],
      surprise: [
        "Won the lottery! Still can't believe this incredible luck! 🎰😲",
        "Surprise visit from college roommate! Completely unexpected and wonderful! 😮",
        "Boss offered promotion out of nowhere! Totally caught off guard! 📈😮",
        "Found hidden talent for painting! Never knew I had this ability! 🎨😲"
      ]
    };

    const regionCities = {
      'asia': [
        { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' },
        { lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China' },
        { lat: 19.0760, lng: 72.8777, city: 'Mumbai', country: 'India' },
        { lat: 37.5665, lng: 126.9780, city: 'Seoul', country: 'South Korea' }
      ],
      'europe': [
        { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
        { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
        { lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany' },
        { lat: 41.9028, lng: 12.4964, city: 'Rome', country: 'Italy' }
      ],
      'north-america': [
        { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
        { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA' },
        { lat: 41.8781, lng: -87.6298, city: 'Chicago', country: 'USA' },
        { lat: 43.6532, lng: -79.3832, city: 'Toronto', country: 'Canada' }
      ]
    };

    const cities = filters.region === 'global' 
      ? Object.values(regionCities).flat()
      : regionCities[filters.region as keyof typeof regionCities] || Object.values(regionCities).flat();

    const texts = filters.emotion !== 'all' 
      ? fallbackTexts[filters.emotion as keyof typeof fallbackTexts] || Object.values(fallbackTexts).flat()
      : Object.values(fallbackTexts).flat();

    const count = Math.floor(Math.random() * 5) + 3; // 3-7 fallback tweets
    const fallbackData: SentimentData[] = [];

    for (let i = 0; i < count; i++) {
      const text = texts[Math.floor(Math.random() * texts.length)];
      const location = cities[Math.floor(Math.random() * cities.length)];
      
      fallbackData.push({
        id: `fallback-twitter-${Date.now()}-${i}`,
        text,
        timestamp: new Date().toISOString(),
        location,
        source: 'twitter',
        sentiment: this.analyzeFallbackSentiment(text),
        emotions: this.analyzeFallbackEmotions(text),
        keywords: this.extractFallbackKeywords(text),
        eventType: 'general'
      });
    }

    console.log(`Generated ${fallbackData.length} fallback Twitter-style posts`);
    return fallbackData;
  },

  analyzeFallbackSentiment(text: string) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('love') || lowerText.includes('amazing') || lowerText.includes('wonderful') || lowerText.includes('incredible')) {
      return { label: 'positive' as const, score: 0.8, confidence: 0.9 };
    } else if (lowerText.includes('terrible') || lowerText.includes('awful') || lowerText.includes('hate') || lowerText.includes('angry')) {
      return { label: 'negative' as const, score: 0.2, confidence: 0.9 };
    } else {
      return { label: 'neutral' as const, score: 0.5, confidence: 0.7 };
    }
  },

  analyzeFallbackEmotions(text: string) {
    const lowerText = text.toLowerCase();
    
    return {
      joy: lowerText.includes('happy') || lowerText.includes('love') || lowerText.includes('amazing') ? 0.8 : 0.1,
      sadness: lowerText.includes('sad') || lowerText.includes('lost') || lowerText.includes('miss') ? 0.8 : 0.1,
      anger: lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('terrible') ? 0.8 : 0.1,
      fear: lowerText.includes('scared') || lowerText.includes('worried') || lowerText.includes('afraid') ? 0.8 : 0.1,
      surprise: lowerText.includes('surprised') || lowerText.includes('unexpected') || lowerText.includes('wow') ? 0.8 : 0.1
    };
  },

  extractFallbackKeywords(text: string): string[] {
    return text
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'were', 'will', 'just'].includes(word.toLowerCase()))
      .map(word => word.replace(/[^\w]/g, '').toLowerCase())
      .filter(word => word.length > 2)
      .slice(0, 5);
  }
};