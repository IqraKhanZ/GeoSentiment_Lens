import { SentimentData, RegionData, TimelinePoint } from '../types';
import { analyzeSentiment, analyzeEmotions, extractKeywords, classifyEvent, generateRandomLocation } from './sentimentAnalysis';

export function processCsvData(csvText: string): SentimentData[] {
  try {
    console.log('Processing CSV data, length:', csvText.length);
    
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    console.log('CSV Headers detected:', headers);
    
    const processedData: SentimentData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        // Handle CSV parsing with quoted values
        const values = parseCSVLine(line);
        
        if (values.length < headers.length) {
          console.warn(`Row ${i} has fewer columns than headers, skipping`);
          continue;
        }

        // Extract text (required field) - try multiple possible column names
        const textIndex = headers.findIndex(h => 
          h.includes('text') || h.includes('content') || h.includes('message') || 
          h.includes('tweet') || h.includes('post') || h.includes('comment') ||
          h.includes('description') || h.includes('body')
        );
        const text = values[textIndex] || values[0] || '';
        
        if (!text || text.length < 3) {
          console.warn(`Row ${i} has no valid text content: "${text}", skipping`);
          continue;
        }

        // Extract timestamp
        const timestampIndex = headers.findIndex(h => 
          h.includes('timestamp') || h.includes('date') || h.includes('time') || 
          h.includes('created') || h.includes('published')
        );
        let timestamp = values[timestampIndex] || '';
        
        // Validate and fix timestamp
        if (timestamp) {
          const dateObj = new Date(timestamp);
          if (isNaN(dateObj.getTime())) {
            console.warn(`Invalid timestamp "${timestamp}" in row ${i}, using current time`);
            timestamp = new Date().toISOString();
          } else {
            timestamp = dateObj.toISOString();
          }
        } else {
          // Generate random timestamp within last 30 days if not provided
          const daysAgo = Math.floor(Math.random() * 30);
          timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
        }

        // Extract location
        let location = generateRandomLocation();
        const latIndex = headers.findIndex(h => h.includes('lat') || h === 'latitude');
        const lngIndex = headers.findIndex(h => h.includes('lng') || h.includes('lon') || h === 'longitude');
        const cityIndex = headers.findIndex(h => h.includes('city'));
        const countryIndex = headers.findIndex(h => h.includes('country'));
        
        if (latIndex !== -1 && lngIndex !== -1) {
          const lat = parseFloat(values[latIndex]);
          const lng = parseFloat(values[lngIndex]);
          
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            location = {
              lat,
              lng,
              city: cityIndex !== -1 ? values[cityIndex] : location.city,
              country: countryIndex !== -1 ? values[countryIndex] : location.country
            };
          } else {
            console.warn(`Invalid coordinates lat:${lat}, lng:${lng} in row ${i}, using random location`);
          }
        }

        // Extract source
        const sourceIndex = headers.findIndex(h => h.includes('source') || h.includes('platform'));
        let source: 'twitter' | 'news' | 'upload' = 'upload';
        if (sourceIndex !== -1) {
          const sourceValue = values[sourceIndex].toLowerCase();
          if (sourceValue.includes('twitter') || sourceValue.includes('tweet')) {
            source = 'twitter';
          } else if (sourceValue.includes('news')) {
            source = 'news';
          }
        }

        const processedItem = processSingleDataPoint({
          text: text.substring(0, 500), // Limit text length
          timestamp,
          location,
          source
        });

        processedData.push(processedItem);
        
      } catch (rowError) {
        console.error(`Error processing row ${i}:`, rowError);
        continue;
      }
    }

    console.log(`Successfully processed ${processedData.length} rows from ${lines.length - 1} total rows`);
    
    if (processedData.length === 0) {
      throw new Error('No valid data rows could be processed. Please check your CSV format.');
    }
    
    return processedData;
  } catch (error) {
    console.error('Error processing CSV:', error);
    throw new Error(`Failed to process CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function processSingleDataPoint(data: {
  text: string;
  timestamp: string;
  location: { lat: number; lng: number; city?: string; country?: string };
  source: string;
}): SentimentData {
  const sentiment = analyzeSentiment(data.text);
  const emotions = analyzeEmotions(data.text);
  const keywords = extractKeywords(data.text);
  const eventType = classifyEvent(data.text, keywords);

  return {
    id: `processed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text: data.text,
    timestamp: data.timestamp,
    location: data.location,
    source: data.source as 'twitter' | 'news' | 'upload',
    sentiment,
    emotions,
    keywords,
    eventType
  };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result.map(val => val.replace(/^"|"$/g, ''));
}

export function generateMockData(count: number = 100): SentimentData[] {
  const sampleTexts = [
    "Just watched an amazing movie! Absolutely loved every minute of it. The acting was incredible and the story was so touching.",
    "Terrible traffic today. So frustrated with the constant delays. This city needs better infrastructure immediately.",
    "The weather is nice today. Going for a walk in the park. Nothing special happening, just enjoying the moment.",
    "Earthquake in the region has caused significant damage. Many people are worried about their safety and homes.",
    "Our team won the championship! This is the best day ever. So proud of everyone's hard work and dedication.",
    "Political situation is getting worse. People are angry about the new policies. Protests are happening everywhere.",
    "Concert was absolutely phenomenal tonight! The energy was incredible and the music was life-changing.",
    "Stock market crashed again. Investors are panicking and everyone is scared about the economic future.",
    "Beautiful sunset at the beach today. Feeling peaceful and grateful for these simple moments in life.",
    "Hospital staff are overwhelmed. The healthcare crisis continues to worsen and people are losing hope.",
    "New restaurant in town is absolutely fantastic! The food quality and service exceeded all expectations.",
    "Flight delayed for 6 hours. Airport is chaos and nobody knows what's happening. So frustrated right now.",
    "Kids graduation ceremony was perfect. So proud of their achievements and excited for their future.",
    "Local park cleanup was a huge success. Community came together and made a real difference today.",
    "Internet has been down all day. Can't work from home and losing productivity. This is so annoying.",
    "Breaking news: Major breakthrough in renewable energy technology announced by scientists today.",
    "Disappointed with the election results. Democracy seems to be failing us when we need it most.",
    "Incredible performance by the athletes at the Olympics. National pride is at an all-time high!",
    "Forest fires are spreading rapidly. Environmental destruction is heartbreaking to witness firsthand.",
    "New album release from my favorite artist! The music is absolutely divine and emotionally powerful."
  ];

  return Array.from({ length: count }, (_, index) => {
    const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    const location = generateRandomLocation();

    // Generate timestamps over the last 30 days with more realistic distribution
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000 - minutesAgo * 60 * 1000).toISOString();

    return processSingleDataPoint({
      text,
      timestamp,
      location,
      source: Math.random() > 0.6 ? 'twitter' : Math.random() > 0.5 ? 'news' : 'upload'
    });
  });
}

export function processRegionData(data: SentimentData[]): RegionData[] {
  if (!data || data.length === 0) return [];
  
  const regionMap = new Map<string, SentimentData[]>();
  
  data.forEach(item => {
    if (!item.location || !item.location.city || !item.location.country) return;
    
    const regionKey = `${item.location.city}, ${item.location.country}`;
    if (!regionMap.has(regionKey)) {
      regionMap.set(regionKey, []);
    }
    regionMap.get(regionKey)!.push(item);
  });

  return Array.from(regionMap.entries()).map(([region, items]) => {
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    const emotionTotals = { joy: 0, sadness: 0, anger: 0, fear: 0, surprise: 0 };
    const keywordCounts = new Map<string, number>();

    items.forEach(item => {
      sentimentCounts[item.sentiment.label]++;
      
      Object.entries(item.emotions).forEach(([emotion, score]) => {
        emotionTotals[emotion as keyof typeof emotionTotals] += score;
      });

      item.keywords.forEach(keyword => {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
      });
    });

    const dominantEmotion = Object.entries(emotionTotals)
      .reduce((a, b) => emotionTotals[a[0] as keyof typeof emotionTotals] > emotionTotals[b[0] as keyof typeof emotionTotals] ? a : b)[0];

    const trendingKeywords = Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keyword]) => keyword);

    return {
      region,
      sentimentDistribution: {
        positive: sentimentCounts.positive / items.length,
        negative: sentimentCounts.negative / items.length,
        neutral: sentimentCounts.neutral / items.length
      },
      dominantEmotion,
      totalPosts: items.length,
      trendingKeywords
    };
  }).sort((a, b) => b.totalPosts - a.totalPosts); // Sort by activity level
}

export function generateTimelineData(data: SentimentData[]): TimelinePoint[] {
  if (!data || data.length === 0) return [];
  
  const timeMap = new Map<string, SentimentData[]>();
  
  data.forEach(item => {
    // Validate timestamp
    if (!item.timestamp) return;
    
    const dateObj = new Date(item.timestamp);
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid timestamp found:', item.timestamp);
      return;
    }
    
    const date = dateObj.toISOString().split('T')[0];
    if (!timeMap.has(date)) {
      timeMap.set(date, []);
    }
    timeMap.get(date)!.push(item);
  });

  return Array.from(timeMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => {
      // Calculate weighted sentiment score
      const sentimentScore = items.reduce((sum, item) => {
        const weight = item.sentiment.confidence;
        const value = item.sentiment.label === 'positive' ? 1 : 
                     item.sentiment.label === 'negative' ? -1 : 0;
        return sum + (value * weight);
      }, 0) / items.length;

      const emotionScores = {
        joy: items.reduce((sum, item) => sum + item.emotions.joy, 0) / items.length,
        sadness: items.reduce((sum, item) => sum + item.emotions.sadness, 0) / items.length,
        anger: items.reduce((sum, item) => sum + item.emotions.anger, 0) / items.length,
        fear: items.reduce((sum, item) => sum + item.emotions.fear, 0) / items.length,
        surprise: items.reduce((sum, item) => sum + item.emotions.surprise, 0) / items.length
      };

      return {
        timestamp: date,
        sentimentScore,
        emotionScores,
        postCount: items.length
      };
    });
}