import { SentimentData } from '../types';
import { processSingleDataPoint } from '../utils/dataProcessor';
import { twitterService } from './twitterService';
import { globalCities, getCitiesByRegion, getRandomCity } from '../utils/globalCities';

interface LiveDataFilters {
  day: string;
  sentiment: string;
  emotion: string;
  region: string;
}

// Enhanced live data sources with emotion-specific content
const emotionBasedTexts = {
  joy: [
    "Just got promoted at work! Dreams do come true with hard work and dedication! 🎉",
    "Wedding day was absolutely perfect! Surrounded by love and happiness everywhere! 💕",
    "Baby took first steps today! Pure joy watching this milestone moment! 👶",
    "Graduation ceremony was incredible! So proud of this achievement! 🎓",
    "Surprise birthday party was amazing! Friends are the best gift in life! 🎂",
    "Concert was life-changing! Music has the power to heal and inspire! 🎵",
    "Vacation in paradise! Beach, sun, and relaxation - pure bliss! 🏖️",
    "Team won the championship! Victory tastes so sweet after hard work! 🏆",
    "New job offer came through! Excited for this amazing opportunity! 💼",
    "Family reunion was heartwarming! Love spending time with everyone! 👨‍👩‍👧‍👦"
  ],
  sadness: [
    "Lost my beloved pet today. Heartbroken and will miss them forever. 💔",
    "Grandmother passed away peacefully. Grieving but grateful for memories. 😢",
    "Relationship ended after five years. Feeling lost and empty inside. 💔",
    "Childhood home being demolished. End of an era and so many memories. 😭",
    "Best friend moved across the country. Distance makes heart grow heavy. 😔",
    "Failed the important exam despite studying hard. Dreams feel shattered. 😞",
    "Favorite restaurant closed permanently. Another piece of childhood gone. 😢",
    "Rainy day matches my mood perfectly. Sometimes sadness just overwhelms. 🌧️",
    "Lost job today due to company downsizing. Uncertain about the future. 😰",
    "Movie ending made me cry. Some stories touch the soul deeply. 😭"
  ],
  anger: [
    "Traffic jam for three hours! This city's infrastructure is absolutely terrible! 😡",
    "Customer service was incredibly rude and unhelpful! Completely unacceptable! 🤬",
    "Politicians breaking promises again! Fed up with lies and corruption! 😠",
    "Neighbor's loud music all night! No respect for others whatsoever! 😤",
    "Internet down during important meeting! Technology fails when needed most! 💢",
    "Overcharged for terrible service! This business practices are outrageous! 😡",
    "Environmental destruction continues unchecked! Future generations will suffer! 🌍💢",
    "Discrimination witnessed today! Injustice makes my blood boil with rage! ✊😠",
    "Package delivery delayed again! Incompetent logistics company! 📦😡",
    "Phone battery died at crucial moment! Modern technology is so unreliable! 🔋😤"
  ],
  fear: [
    "Earthquake warning issued for our area. Scared about family's safety tonight. 😰",
    "Job layoffs announced at company. Worried about financial security ahead. 😨",
    "Strange noise in the house at night. Fear keeps me awake. 👻",
    "Medical test results pending. Anxiety about what doctors might find. 😟",
    "Walking alone in dark alley. Heart racing with every shadow. 🌙😰",
    "Economic recession looming ahead. Terrified about uncertain future prospects. 📉😨",
    "Climate change effects accelerating. Fear for planet's survival. 🌍😰",
    "Crime rates increasing in neighborhood. Safety concerns growing daily. 🚨😟",
    "Flight turbulence was terrifying. Gripping armrests in pure panic. ✈️😰",
    "Stock market volatility is scary. Retirement savings at risk. 📈😨"
  ],
  surprise: [
    "Won the lottery! Cannot believe this incredible stroke of luck! 🎰😲",
    "Surprise visit from college friend! Completely unexpected and wonderful! 😮",
    "Found out I'm pregnant! Shocked but thrilled about this news! 👶😲",
    "Boss offered promotion out of nowhere! Totally caught off guard! 📈😮",
    "Discovered hidden talent for painting! Never knew I had this ability! 🎨😲",
    "Childhood crush messaged after twenty years! What are the odds! 💌😮",
    "Package delivered to wrong address contained treasure! Unbelievable coincidence! 📦😲",
    "Meteor shower visible tonight! Nature's surprises never cease to amaze! ☄️😮",
    "Secret family recipe found in attic! Grandmother's cooking legacy lives on! 📜😲",
    "Unexpected inheritance from distant relative! Life-changing surprise! 💰😮"
  ]
};

export const liveDataService = {
  async fetchData(filters: LiveDataFilters): Promise<SentimentData[]> {
    console.log('🔄 Fetching live data with filters:', filters);
    
    // Try to fetch real Twitter data first
    try {
      const twitterData = await twitterService.fetchLiveTweets({
        region: filters.region,
        sentiment: filters.sentiment,
        emotion: filters.emotion,
        count: Math.floor(Math.random() * 5) + 3 // 3-7 tweets
      });
      
      if (twitterData && twitterData.length > 0) {
        console.log('✅ Successfully fetched Twitter data:', twitterData.length, 'tweets');
        return twitterData;
      }
    } catch (error) {
      console.warn('⚠️ Twitter API unavailable, using enhanced fallback data');
    }
    
    // Fallback to enhanced simulated data with global cities
    return this.generateEnhancedFallbackData(filters);
  },

  async generateEnhancedFallbackData(filters: LiveDataFilters): Promise<SentimentData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const dataCount = Math.floor(Math.random() * 8) + 3; // 3-10 new data points
    const newData: SentimentData[] = [];

    console.log('🎭 Generating enhanced fallback data with filters:', filters);
    console.log('🌍 Using global cities database with', globalCities.length, 'cities');

    for (let i = 0; i < dataCount; i++) {
      // Select text based on emotion filter first
      let text: string;
      if (filters.emotion !== 'all' && emotionBasedTexts[filters.emotion as keyof typeof emotionBasedTexts]) {
        const emotionTexts = emotionBasedTexts[filters.emotion as keyof typeof emotionBasedTexts];
        text = emotionTexts[Math.floor(Math.random() * emotionTexts.length)];
      } else {
        // Mix of all emotion types
        const allEmotionTexts = Object.values(emotionBasedTexts).flat();
        text = allEmotionTexts[Math.floor(Math.random() * allEmotionTexts.length)];
      }

      // Generate location using global cities database - ENHANCED
      let location;
      if (filters.region === 'global') {
        // Select from all global cities with weighted probability (favor major cities)
        const majorCities = globalCities.filter(city => (city.population || 0) > 1000000);
        const allCities = globalCities;
        
        // 70% chance for major cities, 30% for all cities
        const cityPool = Math.random() < 0.7 ? majorCities : allCities;
        location = cityPool[Math.floor(Math.random() * cityPool.length)];
      } else {
        // Use region-specific cities from global database
        const regionCities = getCitiesByRegion(filters.region);
        if (regionCities.length > 0) {
          location = regionCities[Math.floor(Math.random() * regionCities.length)];
        } else {
          // Fallback to random global city
          location = getRandomCity();
        }
      }

      // Generate timestamp based on day filter
      let timestamp;
      const now = new Date();
      switch (filters.day) {
        case 'today':
          timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
          break;
        case 'yesterday':
          timestamp = new Date(now.getTime() - (24 + Math.random() * 24) * 60 * 60 * 1000);
          break;
        case 'week':
          timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          timestamp = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
      }

      const processedData = processSingleDataPoint({
        text,
        timestamp: timestamp.toISOString(),
        location: {
          lat: location.lat,
          lng: location.lng,
          city: location.city,
          country: location.country
        },
        source: Math.random() > 0.5 ? 'news' : 'twitter'
      });

      // Apply sentiment filter if specified
      if (filters.sentiment !== 'all') {
        if (filters.sentiment === 'positive' && processedData.sentiment.label !== 'positive') continue;
        if (filters.sentiment === 'negative' && processedData.sentiment.label !== 'negative') continue;
        if (filters.sentiment === 'neutral' && processedData.sentiment.label !== 'neutral') continue;
        if (filters.sentiment === 'trending' && processedData.sentiment.confidence < 0.7) continue;
      }

      // Apply emotion filter if specified - ENHANCED
      if (filters.emotion !== 'all') {
        const emotions = processedData.emotions;
        const dominantEmotion = Object.entries(emotions)
          .reduce((a, b) => emotions[a[0] as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b)[0];
        
        // More lenient emotion filtering - check if the target emotion is significant
        const targetEmotionScore = emotions[filters.emotion as keyof typeof emotions];
        if (targetEmotionScore < 0.3 && dominantEmotion !== filters.emotion) {
          continue;
        }
      }

      newData.push(processedData);
    }

    console.log(`🎯 Generated ${newData.length} enhanced fallback data points for region: ${filters.region}, emotion: ${filters.emotion}`);
    
    // Log sample locations to verify region filtering and global coverage
    if (newData.length > 0) {
      console.log('📍 Sample locations:', newData.slice(0, 3).map(d => `${d.location.city}, ${d.location.country}`));
      
      // Log region distribution
      const regionDistribution = newData.reduce((acc, item) => {
        const region = globalCities.find(city => 
          city.city === item.location.city && city.country === item.location.country
        )?.region || 'unknown';
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('🌍 Region distribution:', regionDistribution);
    }

    return newData;
  }
};