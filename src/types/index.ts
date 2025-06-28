export interface SentimentData {
  id: string;
  text: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    city?: string;
    country?: string;
  };
  source: 'twitter' | 'news' | 'upload';
  sentiment: {
    label: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
  };
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  keywords: string[];
  eventType?: 'politics' | 'sports' | 'disaster' | 'entertainment' | 'general';
}

export interface RegionData {
  region: string;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  dominantEmotion: string;
  totalPosts: number;
  trendingKeywords: string[];
}

export interface TimelinePoint {
  timestamp: string;
  sentimentScore: number;
  emotionScores: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  postCount: number;
}

export interface GameQuestion {
  id: string;
  text: string;
  correctSentiment: 'positive' | 'negative' | 'neutral';
  options: string[];
}

export interface UserScore {
  correct: number;
  total: number;
  streak: number;
}