import React, { useState, useMemo } from 'react';
import { Hash, TrendingUp, Search, Filter } from 'lucide-react';
import { SentimentData } from '../types';

interface KeywordExplorerProps {
  data: SentimentData[];
  onKeywordFilter: (keyword: string) => void;
}

export function KeywordExplorer({ data, onKeywordFilter }: KeywordExplorerProps) {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'frequency' | 'sentiment'>('frequency');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');

  const keywordAnalysis = useMemo(() => {
    const keywordMap = new Map<string, {
      count: number;
      sentiment: { positive: number; negative: number; neutral: number };
      posts: SentimentData[];
    }>();

    data.forEach(item => {
      item.keywords.forEach(keyword => {
        if (!keywordMap.has(keyword)) {
          keywordMap.set(keyword, {
            count: 0,
            sentiment: { positive: 0, negative: 0, neutral: 0 },
            posts: []
          });
        }
        
        const keywordData = keywordMap.get(keyword)!;
        keywordData.count++;
        keywordData.sentiment[item.sentiment.label]++;
        keywordData.posts.push(item);
      });
    });

    let keywords = Array.from(keywordMap.entries()).map(([keyword, data]) => ({
      keyword,
      ...data,
      avgSentiment: (data.sentiment.positive - data.sentiment.negative) / data.count,
      dominantSentiment: Object.entries(data.sentiment)
        .reduce((a, b) => data.sentiment[a[0] as keyof typeof data.sentiment] > data.sentiment[b[0] as keyof typeof data.sentiment] ? a : b)[0] as 'positive' | 'negative' | 'neutral'
    }));

    // Filter by sentiment if specified
    if (filterSentiment !== 'all') {
      keywords = keywords.filter(k => k.dominantSentiment === filterSentiment);
    }

    // Sort keywords
    keywords.sort((a, b) => {
      if (sortBy === 'frequency') {
        return b.count - a.count;
      } else {
        return b.avgSentiment - a.avgSentiment;
      }
    });

    return keywords.slice(0, 50); // Top 50 keywords
  }, [data, sortBy, filterSentiment]);

  const handleKeywordClick = (keyword: string) => {
    setSelectedKeyword(keyword);
    onKeywordFilter(keyword);
  };

  const getKeywordSize = (count: number, maxCount: number) => {
    const minSize = 12;
    const maxSize = 32;
    const size = minSize + ((count / maxCount) * (maxSize - minSize));
    return Math.round(size);
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const maxCount = Math.max(...keywordAnalysis.map(k => k.count));
  const selectedKeywordData = keywordAnalysis.find(k => k.keyword === selectedKeyword);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Hash className="h-6 w-6 text-blue-600" />
          Keyword & Hashtag Explorer
        </h2>
        
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'frequency' | 'sentiment')}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="frequency">By Frequency</option>
            <option value="sentiment">By Sentiment</option>
          </select>
          
          <select
            value={filterSentiment}
            onChange={(e) => setFilterSentiment(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>

      {/* Word Cloud */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 min-h-64 flex flex-wrap items-center justify-center gap-2">
        {keywordAnalysis.map((item, index) => (
          <button
            key={item.keyword}
            onClick={() => handleKeywordClick(item.keyword)}
            className={`font-bold hover:opacity-75 transition-all duration-200 hover:scale-110 ${getSentimentColor(item.dominantSentiment)} ${
              selectedKeyword === item.keyword ? 'bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded' : ''
            }`}
            style={{
              fontSize: `${getKeywordSize(item.count, maxCount)}px`,
              lineHeight: '1.2'
            }}
            title={`${item.keyword}: ${item.count} mentions, ${item.dominantSentiment} sentiment`}
          >
            {item.keyword}
          </button>
        ))}
      </div>

      {/* Trending Keywords List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Top Keywords
          </h3>
          <div className="space-y-3">
            {keywordAnalysis.slice(0, 10).map((item, index) => (
              <div
                key={item.keyword}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedKeyword === item.keyword
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleKeywordClick(item.keyword)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                    #{index + 1}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.keyword}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.count}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    item.dominantSentiment === 'positive' ? 'bg-green-500' :
                    item.dominantSentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Keyword Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Keyword Analysis
          </h3>
          
          {selectedKeywordData ? (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  "{selectedKeywordData.keyword}"
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Total mentions:</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedKeywordData.count}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Dominant sentiment:</span>
                    <div className={`font-medium capitalize ${getSentimentColor(selectedKeywordData.dominantSentiment)}`}>
                      {selectedKeywordData.dominantSentiment}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sentiment Distribution */}
              <div className="space-y-2">
                <h5 className="font-medium text-gray-900 dark:text-white">Sentiment Distribution</h5>
                {Object.entries(selectedKeywordData.sentiment).map(([sentiment, count]) => {
                  const percentage = (count / selectedKeywordData.count) * 100;
                  const color = sentiment === 'positive' ? 'bg-green-500' : 
                               sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500';
                  
                  return (
                    <div key={sentiment} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{sentiment}</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {count} ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Posts */}
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Recent Posts</h5>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedKeywordData.posts.slice(0, 3).map((post, index) => (
                    <div key={index} className="text-sm p-2 bg-gray-100 dark:bg-gray-600 rounded text-gray-700 dark:text-gray-300">
                      "{post.text.slice(0, 100)}..."
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Click on a keyword to see detailed analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}