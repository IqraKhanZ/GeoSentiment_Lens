import { SentimentData } from '../types';

// Enhanced sentiment analysis lexicons
const positiveWords = [
  'good', 'great', 'awesome', 'amazing', 'excellent', 'fantastic', 'wonderful',
  'love', 'happy', 'joy', 'celebrate', 'success', 'win', 'victory', 'beautiful',
  'perfect', 'brilliant', 'outstanding', 'superb', 'delighted', 'thrilled',
  'excited', 'pleased', 'satisfied', 'grateful', 'blessed', 'fortunate',
  'incredible', 'spectacular', 'magnificent', 'marvelous', 'phenomenal',
  'impressive', 'remarkable', 'extraordinary', 'fabulous', 'terrific',
  'splendid', 'divine', 'glorious', 'heavenly', 'blissful', 'ecstatic',
  'elated', 'euphoric', 'overjoyed', 'cheerful', 'optimistic', 'hopeful',
  'promoted', 'wedding', 'graduation', 'birthday', 'vacation', 'paradise',
  'championship', 'milestone', 'achievement', 'dreams', 'treasure'
];

const negativeWords = [
  'bad', 'terrible', 'awful', 'horrible', 'hate', 'angry', 'sad', 'disappointed',
  'frustrated', 'disaster', 'crisis', 'problem', 'fail', 'loss', 'defeat',
  'worried', 'concerned', 'upset', 'disgusted', 'furious', 'devastated',
  'miserable', 'depressed', 'anxious', 'stressed', 'annoyed', 'irritated',
  'outraged', 'appalled', 'shocked', 'horrified', 'disgusting', 'revolting',
  'pathetic', 'useless', 'worthless', 'hopeless', 'tragic', 'catastrophic',
  'dreadful', 'atrocious', 'abysmal', 'deplorable', 'despicable', 'vile',
  'wretched', 'grim', 'bleak', 'dire', 'ominous', 'sinister',
  'heartbroken', 'grieving', 'demolished', 'shattered', 'corruption',
  'discrimination', 'injustice', 'layoffs', 'recession', 'crime'
];

// Intensifiers and modifiers
const intensifiers = ['very', 'extremely', 'incredibly', 'absolutely', 'totally', 'completely', 'utterly', 'quite', 'really', 'truly', 'deeply', 'highly', 'tremendously', 'enormously', 'exceptionally'];
const diminishers = ['slightly', 'somewhat', 'rather', 'fairly', 'pretty', 'kind of', 'sort of', 'a little', 'a bit', 'moderately'];
const negationWords = ['not', 'no', 'never', 'nothing', 'nobody', 'nowhere', 'neither', 'nor', 'none', "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't", "shouldn't", "mustn't"];

// Enhanced emotion keywords with more comprehensive coverage
const emotionKeywords = {
  joy: [
    'happy', 'joy', 'celebrate', 'excited', 'delighted', 'thrilled', 'ecstatic', 
    'cheerful', 'elated', 'euphoric', 'blissful', 'overjoyed', 'gleeful', 'jubilant', 
    'exuberant', 'promoted', 'wedding', 'graduation', 'birthday', 'vacation', 
    'paradise', 'championship', 'milestone', 'achievement', 'dreams', 'treasure',
    'amazing', 'wonderful', 'fantastic', 'incredible', 'perfect', 'brilliant'
  ],
  sadness: [
    'sad', 'cry', 'depressed', 'disappointed', 'grief', 'sorrow', 'heartbroken', 
    'melancholy', 'gloomy', 'despondent', 'dejected', 'downcast', 'mournful', 
    'sorrowful', 'lost', 'beloved', 'passed', 'away', 'grieving', 'memories',
    'ended', 'empty', 'demolished', 'distance', 'failed', 'shattered', 'closed',
    'rainy', 'overwhelms', 'heavy', 'miss', 'forever'
  ],
  anger: [
    'angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'irritated', 'outraged', 
    'livid', 'irate', 'incensed', 'enraged', 'infuriated', 'aggravated', 'resentful',
    'traffic', 'terrible', 'rude', 'unacceptable', 'lies', 'corruption', 'loud',
    'respect', 'overcharged', 'destruction', 'discrimination', 'injustice',
    'boil', 'fed up', 'outrageous', 'unbelievable'
  ],
  fear: [
    'scared', 'afraid', 'terrified', 'worried', 'anxious', 'panic', 'frightened', 
    'nervous', 'apprehensive', 'alarmed', 'concerned', 'uneasy', 'distressed', 
    'petrified', 'earthquake', 'warning', 'safety', 'layoffs', 'financial',
    'security', 'strange', 'noise', 'medical', 'test', 'dark', 'alley',
    'recession', 'climate', 'crime', 'rates', 'terrified', 'racing'
  ],
  surprise: [
    'surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'incredible', 
    'unbelievable', 'unexpected', 'startled', 'bewildered', 'flabbergasted', 
    'dumbfounded', 'lottery', 'cannot', 'believe', 'visit', 'pregnant',
    'promotion', 'nowhere', 'discovered', 'hidden', 'talent', 'messaged',
    'twenty', 'years', 'odds', 'package', 'treasure', 'meteor', 'shower'
  ]
};

export function analyzeSentiment(text: string): SentimentData['sentiment'] {
  const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
  let positiveScore = 0;
  let negativeScore = 0;
  let totalWords = words.length;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let multiplier = 1;
    let isNegated = false;

    // Check for negation in the previous 1-3 words
    for (let j = Math.max(0, i - 3); j < i; j++) {
      if (negationWords.includes(words[j])) {
        isNegated = true;
        break;
      }
    }

    // Check for intensifiers/diminishers in the previous 1-2 words
    for (let j = Math.max(0, i - 2); j < i; j++) {
      if (intensifiers.includes(words[j])) {
        multiplier = 1.5;
        break;
      } else if (diminishers.includes(words[j])) {
        multiplier = 0.7;
        break;
      }
    }

    // Check for punctuation emphasis
    const punctuationEmphasis = (text.match(/[!]{2,}/g) || []).length * 0.2 + 
                               (text.match(/[?]{2,}/g) || []).length * 0.1;
    multiplier += punctuationEmphasis;

    // Calculate sentiment scores
    if (positiveWords.includes(word)) {
      const score = multiplier;
      if (isNegated) {
        negativeScore += score;
      } else {
        positiveScore += score;
      }
    } else if (negativeWords.includes(word)) {
      const score = multiplier;
      if (isNegated) {
        positiveScore += score;
      } else {
        negativeScore += score;
      }
    }
  }

  // Normalize scores
  const totalScore = positiveScore + negativeScore;
  const confidence = Math.min(totalScore / Math.max(totalWords * 0.3, 1), 1);
  
  // Determine sentiment
  if (positiveScore > negativeScore) {
    const strength = (positiveScore - negativeScore) / Math.max(totalScore, 1);
    return {
      label: 'positive',
      score: 0.5 + (strength * 0.5),
      confidence: Math.max(0.4, confidence)
    };
  } else if (negativeScore > positiveScore) {
    const strength = (negativeScore - positiveScore) / Math.max(totalScore, 1);
    return {
      label: 'negative',
      score: 0.5 - (strength * 0.5),
      confidence: Math.max(0.4, confidence)
    };
  } else {
    return {
      label: 'neutral',
      score: 0.5,
      confidence: Math.max(0.3, confidence * 0.8)
    };
  }
}

export function analyzeEmotions(text: string): SentimentData['emotions'] {
  const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
  const emotions = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0
  };

  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    let score = 0;
    let wordCount = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (keywords.includes(word)) {
        let multiplier = 1;
        let isNegated = false;

        // Check for negation
        for (let j = Math.max(0, i - 3); j < i; j++) {
          if (negationWords.includes(words[j])) {
            isNegated = true;
            break;
          }
        }

        // Check for intensifiers
        for (let j = Math.max(0, i - 2); j < i; j++) {
          if (intensifiers.includes(words[j])) {
            multiplier = 1.5;
            break;
          } else if (diminishers.includes(words[j])) {
            multiplier = 0.7;
            break;
          }
        }

        if (!isNegated) {
          score += multiplier;
          wordCount++;
        }
      }
    }

    // Enhanced emotion scoring with better normalization
    const baseScore = score / Math.max(words.length * 0.1, 1);
    emotions[emotion as keyof typeof emotions] = Math.min(baseScore * 1.5, 1);
  });

  // Ensure at least one emotion has some value if sentiment words are present
  const maxEmotion = Math.max(...Object.values(emotions));
  if (maxEmotion === 0 && (positiveWords.some(word => text.toLowerCase().includes(word)) || 
                           negativeWords.some(word => text.toLowerCase().includes(word)))) {
    // Assign default emotion based on sentiment
    if (positiveWords.some(word => text.toLowerCase().includes(word))) {
      emotions.joy = 0.4;
    } else {
      emotions.sadness = 0.4;
    }
  }

  return emotions;
}

export function extractKeywords(text: string): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'does', 'let', 'put', 'say', 'she', 'too', 'use', 'this', 'that', 'with', 'have', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'
  ]);

  const words = text.toLowerCase()
    .replace(/[^\w\s#@]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !stopWords.has(word))
    .filter(word => !/^\d+$/.test(word)); // Remove pure numbers

  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Extract hashtags and mentions separately
  const hashtags = text.match(/#\w+/g) || [];
  const mentions = text.match(/@\w+/g) || [];

  // Combine and sort by frequency, prioritizing hashtags and longer words
  const allKeywords = [
    ...hashtags.map(tag => tag.toLowerCase()),
    ...mentions.map(mention => mention.toLowerCase()),
    ...Array.from(wordCount.entries())
      .sort((a, b) => {
        // Prioritize by frequency, then by length
        if (b[1] !== a[1]) return b[1] - a[1];
        return b[0].length - a[0].length;
      })
      .slice(0, 10)
      .map(([word]) => word)
  ];

  return [...new Set(allKeywords)].slice(0, 8);
}

export function classifyEvent(text: string, keywords: string[]): SentimentData['eventType'] {
  const allText = (text + ' ' + keywords.join(' ')).toLowerCase();
  
  // Political keywords
  if (/\b(election|vote|politic|government|president|minister|parliament|congress|senate|democracy|campaign|ballot|candidate|policy|legislation|reform|debate|summit|treaty|diplomatic|sanctions|referendum)\b/.test(allText)) {
    return 'politics';
  }
  
  // Sports keywords
  if (/\b(game|match|sport|football|cricket|basketball|olympics|championship|tournament|league|team|player|coach|stadium|score|goal|victory|defeat|athlete|competition|world cup|super bowl)\b/.test(allText)) {
    return 'sports';
  }
  
  // Disaster keywords
  if (/\b(earthquake|flood|fire|disaster|emergency|hurricane|tsunami|tornado|cyclone|storm|evacuation|rescue|damage|destruction|casualties|relief|aid|crisis|catastrophe|natural disaster)\b/.test(allText)) {
    return 'disaster';
  }
  
  // Entertainment keywords
  if (/\b(movie|music|concert|celebrity|actor|singer|entertainment|film|album|show|performance|theater|cinema|festival|award|oscar|grammy|premiere|release|streaming|netflix)\b/.test(allText)) {
    return 'entertainment';
  }
  
  return 'general';
}

export function generateRandomLocation() {
  // Enhanced list of major cities worldwide with better geographic distribution
  const cities = [
    { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
    { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA' },
    { lat: 41.8781, lng: -87.6298, city: 'Chicago', country: 'USA' },
    { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
    { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
    { lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany' },
    { lat: 41.9028, lng: 12.4964, city: 'Rome', country: 'Italy' },
    { lat: 40.4168, lng: -3.7038, city: 'Madrid', country: 'Spain' },
    { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' },
    { lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China' },
    { lat: 31.2304, lng: 121.4737, city: 'Shanghai', country: 'China' },
    { lat: 19.0760, lng: 72.8777, city: 'Mumbai', country: 'India' },
    { lat: 28.6139, lng: 77.2090, city: 'New Delhi', country: 'India' },
    { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore' },
    { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia' },
    { lat: -37.8136, lng: 144.9631, city: 'Melbourne', country: 'Australia' },
    { lat: 55.7558, lng: 37.6176, city: 'Moscow', country: 'Russia' },
    { lat: 59.9311, lng: 30.3609, city: 'St. Petersburg', country: 'Russia' },
    { lat: -23.5505, lng: -46.6333, city: 'São Paulo', country: 'Brazil' },
    { lat: -22.9068, lng: -43.1729, city: 'Rio de Janeiro', country: 'Brazil' },
    { lat: 19.4326, lng: -99.1332, city: 'Mexico City', country: 'Mexico' },
    { lat: -34.6037, lng: -58.3816, city: 'Buenos Aires', country: 'Argentina' },
    { lat: 30.0444, lng: 31.2357, city: 'Cairo', country: 'Egypt' },
    { lat: -26.2041, lng: 28.0473, city: 'Johannesburg', country: 'South Africa' },
    { lat: 6.5244, lng: 3.3792, city: 'Lagos', country: 'Nigeria' },
    { lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE' },
    { lat: 39.9334, lng: 32.8597, city: 'Ankara', country: 'Turkey' },
    { lat: 37.5665, lng: 126.9780, city: 'Seoul', country: 'South Korea' },
    { lat: 14.5995, lng: 120.9842, city: 'Manila', country: 'Philippines' },
    { lat: -6.2088, lng: 106.8456, city: 'Jakarta', country: 'Indonesia' }
  ];
  
  return cities[Math.floor(Math.random() * cities.length)];
}