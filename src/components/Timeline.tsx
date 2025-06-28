import React, { useState } from 'react';
import { Calendar, TrendingUp, BarChart3, Info } from 'lucide-react';
import { TimelinePoint } from '../types';

interface TimelineProps {
  data: TimelinePoint[];
  onDateRangeChange: (start: string, end: string) => void;
  hasUploadedData: boolean;
}

export function Timeline({ data, onDateRangeChange, hasUploadedData }: TimelineProps) {
  const [selectedPoint, setSelectedPoint] = useState<TimelinePoint | null>(null);
  const [viewMode, setViewMode] = useState<'sentiment' | 'emotions'>('sentiment');

  const maxSentimentScore = Math.max(...data.map(d => Math.abs(d.sentimentScore)), 1);
  const maxPostCount = Math.max(...data.map(d => d.postCount), 1);

  const getEmotionColor = (emotion: string) => {
    const colors = {
      joy: '#f59e0b',
      sadness: '#3b82f6',
      anger: '#ef4444',
      fear: '#8b5cf6',
      surprise: '#10b981'
    };
    return colors[emotion as keyof typeof colors] || '#6b7280';
  };

  const handlePointClick = (point: TimelinePoint) => {
    setSelectedPoint(point);
    const date = new Date(point.timestamp);
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    onDateRangeChange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  };

  // Generate timeline insights
  const generateTimelineInsights = () => {
    if (data.length === 0) return [];
    
    const insights = [];
    
    // Find peaks and valleys
    const sentimentScores = data.map(d => d.sentimentScore);
    const maxSentiment = Math.max(...sentimentScores);
    const minSentiment = Math.min(...sentimentScores);
    
    if (maxSentiment > 0.5) {
      const peakIndex = sentimentScores.indexOf(maxSentiment);
      const peakDate = new Date(data[peakIndex].timestamp).toLocaleDateString();
      insights.push(`Highest positive sentiment peak on ${peakDate} with ${data[peakIndex].postCount} posts`);
    }
    
    if (minSentiment < -0.5) {
      const valleyIndex = sentimentScores.indexOf(minSentiment);
      const valleyDate = new Date(data[valleyIndex].timestamp).toLocaleDateString();
      insights.push(`Lowest sentiment valley on ${valleyDate} with ${data[valleyIndex].postCount} posts`);
    }
    
    // Trend analysis
    if (data.length > 2) {
      const recentTrend = sentimentScores.slice(-3);
      const isIncreasing = recentTrend.every((val, i) => i === 0 || val >= recentTrend[i - 1]);
      const isDecreasing = recentTrend.every((val, i) => i === 0 || val <= recentTrend[i - 1]);
      
      if (isIncreasing) {
        insights.push("Recent trend shows improving sentiment over time");
      } else if (isDecreasing) {
        insights.push("Recent trend shows declining sentiment over time");
      } else {
        insights.push("Sentiment shows mixed patterns with no clear trend");
      }
    }
    
    // Activity insights
    const avgPosts = data.reduce((sum, d) => sum + d.postCount, 0) / data.length;
    const highActivityDays = data.filter(d => d.postCount > avgPosts * 1.5);
    if (highActivityDays.length > 0) {
      insights.push(`${highActivityDays.length} days had unusually high activity (above ${Math.round(avgPosts * 1.5)} posts)`);
    }
    
    return insights;
  };

  const timelineInsights = generateTimelineInsights();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          Sentiment Timeline Analysis
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('sentiment')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'sentiment'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Sentiment
          </button>
          <button
            onClick={() => setViewMode('emotions')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'emotions'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Emotions
          </button>
        </div>
      </div>

      {/* Data Source Indicator */}
      {!hasUploadedData && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200 text-sm">
            <Info className="h-4 w-4" />
            <span>Showing sample timeline data. Upload your dataset to see your actual timeline trends.</span>
          </div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No timeline data available</p>
          <p className="text-sm">Upload a dataset with timestamps to see timeline analysis</p>
        </div>
      ) : (
        <>
          {/* Timeline Chart */}
          <div className="relative h-64 mb-6">
            <svg className="w-full h-full" viewBox="0 0 800 200">
              {/* Grid Lines */}
              {[0, 50, 100, 150, 200].map(y => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="800"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-300 dark:text-gray-600"
                />
              ))}
              
              {/* Zero Line */}
              <line
                x1="0"
                y1="100"
                x2="800"
                y2="100"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-400 dark:text-gray-500"
              />

              {/* Data Points and Lines */}
              {viewMode === 'sentiment' && (
                <>
                  {/* Sentiment Line */}
                  <polyline
                    points={data.map((point, index) => {
                      const x = (index / Math.max(data.length - 1, 1)) * 800;
                      const y = 100 - (point.sentimentScore / maxSentimentScore) * 80;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  
                  {/* Data Points */}
                  {data.map((point, index) => {
                    const x = (index / Math.max(data.length - 1, 1)) * 800;
                    const y = 100 - (point.sentimentScore / maxSentimentScore) * 80;
                    
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="4"
                        fill={point.sentimentScore > 0 ? '#10b981' : point.sentimentScore < 0 ? '#ef4444' : '#6b7280'}
                        className="cursor-pointer hover:r-6 transition-all duration-200"
                        onClick={() => handlePointClick(point)}
                      />
                    );
                  })}
                </>
              )}

              {viewMode === 'emotions' && (
                <>
                  {/* Emotion Lines */}
                  {Object.keys(data[0]?.emotionScores || {}).map((emotion, emotionIndex) => (
                    <polyline
                      key={emotion}
                      points={data.map((point, index) => {
                        const x = (index / Math.max(data.length - 1, 1)) * 800;
                        const y = 180 - (point.emotionScores[emotion as keyof typeof point.emotionScores] * 160);
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke={getEmotionColor(emotion)}
                      strokeWidth="2"
                      opacity="0.8"
                    />
                  ))}
                  
                  {/* Data Points */}
                  {data.map((point, index) => {
                    const x = (index / Math.max(data.length - 1, 1)) * 800;
                    
                    return (
                      <g key={index}>
                        {Object.entries(point.emotionScores).map(([emotion, score]) => (
                          <circle
                            key={emotion}
                            cx={x}
                            cy={180 - score * 160}
                            r="3"
                            fill={getEmotionColor(emotion)}
                            className="cursor-pointer hover:r-4 transition-all duration-200"
                            onClick={() => handlePointClick(point)}
                          />
                        ))}
                      </g>
                    );
                  })}
                </>
              )}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
              {data.length > 0 && (
                <>
                  <span>{new Date(data[0].timestamp).toLocaleDateString()}</span>
                  {data.length > 2 && (
                    <span>{new Date(data[Math.floor(data.length / 2)]?.timestamp).toLocaleDateString()}</span>
                  )}
                  <span>{new Date(data[data.length - 1].timestamp).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4">
            {viewMode === 'sentiment' && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-blue-600"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Sentiment Score</span>
              </div>
            )}
            
            {viewMode === 'emotions' && (
              <div className="flex flex-wrap gap-4">
                {Object.keys(data[0]?.emotionScores || {}).map(emotion => (
                  <div key={emotion} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-0.5"
                      style={{ backgroundColor: getEmotionColor(emotion) }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {emotion}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timeline Insights */}
          {timelineInsights.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Timeline Insights</h4>
              <div className="space-y-1">
                {timelineInsights.map((insight, index) => (
                  <p key={index} className="text-blue-700 dark:text-blue-300 text-sm">
                    • {insight}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Selected Point Details */}
          {selectedPoint && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  {new Date(selectedPoint.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Posts</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedPoint.postCount}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Sentiment</div>
                  <div className={`font-medium ${
                    selectedPoint.sentimentScore > 0 ? 'text-green-600' : 
                    selectedPoint.sentimentScore < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {selectedPoint.sentimentScore > 0 ? 'Positive' : 
                     selectedPoint.sentimentScore < 0 ? 'Negative' : 'Neutral'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Dominant Emotion</div>
                  <div className="font-medium text-gray-900 dark:text-white capitalize">
                    {Object.entries(selectedPoint.emotionScores)
                      .reduce((a, b) => selectedPoint.emotionScores[a[0] as keyof typeof selectedPoint.emotionScores] > selectedPoint.emotionScores[b[0] as keyof typeof selectedPoint.emotionScores] ? a : b)[0]}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Score</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedPoint.sentimentScore.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}