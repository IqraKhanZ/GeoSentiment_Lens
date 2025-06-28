import React, { useState } from 'react';
import { BarChart3, TrendingUp, MapPin, Users, Zap, Globe, Brain, Target, Info } from 'lucide-react';
import { SentimentData, RegionData } from '../types';

interface DashboardProps {
  data: SentimentData[];
  regionData: RegionData[];
  hasUploadedData: boolean;
}

export function Dashboard({ data, regionData, hasUploadedData }: DashboardProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Calculate overall statistics
  const totalPosts = data.length;
  const sentimentCounts = data.reduce((acc, item) => {
    acc[item.sentiment.label]++;
    return acc;
  }, { positive: 0, negative: 0, neutral: 0 });

  const avgConfidence = data.length > 0 ? data.reduce((sum, item) => sum + item.sentiment.confidence, 0) / data.length : 0;
  
  const sourceCounts = data.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eventTypeCounts = data.reduce((acc, item) => {
    if (item.eventType) {
      acc[item.eventType] = (acc[item.eventType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Generate insights based on actual data
  const generateInsights = () => {
    const insights = [];
    
    if (data.length === 0) {
      insights.push("No data available for analysis. Upload a dataset to see insights.");
      return insights;
    }

    // Sentiment insights
    const dominantSentiment = Object.entries(sentimentCounts)
      .reduce((a, b) => sentimentCounts[a[0] as keyof typeof sentimentCounts] > sentimentCounts[b[0] as keyof typeof sentimentCounts] ? a : b)[0];
    
    const sentimentPercentage = Math.round((sentimentCounts[dominantSentiment as keyof typeof sentimentCounts] / totalPosts) * 100);
    insights.push(`Overall sentiment is ${dominantSentiment} (${sentimentPercentage}% of posts)`);

    // Confidence insights
    if (avgConfidence > 0.8) {
      insights.push(`High confidence analysis with ${Math.round(avgConfidence * 100)}% average accuracy`);
    } else if (avgConfidence < 0.5) {
      insights.push(`Mixed signals detected - sentiment confidence is ${Math.round(avgConfidence * 100)}%`);
    }

    // Regional insights
    if (regionData.length > 0) {
      const mostActiveRegion = regionData.reduce((a, b) => a.totalPosts > b.totalPosts ? a : b);
      insights.push(`${mostActiveRegion.region} has the highest activity with ${mostActiveRegion.totalPosts} posts`);
      
      const mostPositiveRegion = regionData.reduce((a, b) => 
        a.sentimentDistribution.positive > b.sentimentDistribution.positive ? a : b
      );
      insights.push(`${mostPositiveRegion.region} shows the most positive sentiment (${Math.round(mostPositiveRegion.sentimentDistribution.positive * 100)}%)`);
    }

    // Event type insights
    const dominantEventType = Object.entries(eventTypeCounts)
      .reduce((a, b) => (eventTypeCounts[a[0]] || 0) > (eventTypeCounts[b[0]] || 0) ? a : b);
    
    if (dominantEventType[0] && dominantEventType[1] > 0) {
      insights.push(`${dominantEventType[0]} events dominate the conversation (${dominantEventType[1]} posts)`);
    }

    // Time-based insights
    const timestamps = data.map(item => new Date(item.timestamp)).sort((a, b) => a.getTime() - b.getTime());
    if (timestamps.length > 1) {
      const timeSpan = timestamps[timestamps.length - 1].getTime() - timestamps[0].getTime();
      const days = Math.ceil(timeSpan / (1000 * 60 * 60 * 24));
      insights.push(`Data spans ${days} days with ${Math.round(totalPosts / days)} average posts per day`);
    }

    return insights;
  };

  const insights = generateInsights();

  // Game mode questions
  const gameQuestions = data.slice(0, 10).map((item, index) => ({
    id: index.toString(),
    text: item.text,
    correctSentiment: item.sentiment.label,
    options: ['positive', 'negative', 'neutral']
  }));

  const handleGameAnswer = (answer: string) => {
    const isCorrect = answer === gameQuestions[currentQuestion].correctSentiment;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (currentQuestion < gameQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setGameMode(false);
      setCurrentQuestion(0);
    }
  };

  const startGame = () => {
    setGameMode(true);
    setCurrentQuestion(0);
    setScore({ correct: 0, total: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Data Source Indicator */}
      {!hasUploadedData && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <Info className="h-5 w-5" />
            <span className="font-medium">Showing Sample Data</span>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
            Upload your own dataset to see analysis of your actual data instead of sample data.
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalPosts}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Confidence</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round(avgConfidence * 100)}%
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Regions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{regionData.length}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sources</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {Object.keys(sourceCounts).length}
              </p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Sentiment Distribution Analysis
        </h3>
        <div className="space-y-4">
          {Object.entries(sentimentCounts).map(([sentiment, count]) => {
            const percentage = totalPosts > 0 ? (count / totalPosts) * 100 : 0;
            const color = sentiment === 'positive' ? 'bg-green-500' : 
                         sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500';
            
            return (
              <div key={sentiment} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {sentiment}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {count} ({Math.round(percentage)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {totalPosts > 0 && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Analysis:</strong> {insights[0] || 'Sentiment analysis complete.'}
            </p>
          </div>
        )}
      </div>

      {/* Smart Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          Smart Insights from Your Data
        </h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Region Comparison */}
      {regionData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Regional Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionData.slice(0, 6).map((region, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{region.region}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Posts:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{region.totalPosts}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Dominant:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {region.dominantEmotion}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Positive: {Math.round(region.sentimentDistribution.positive * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sentiment Game */}
      {data.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Sentiment Challenge
            </h3>
            {!gameMode && (
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Start Game
              </button>
            )}
          </div>

          {!gameMode && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Test your sentiment analysis skills! Try to guess the sentiment of real posts from your dataset.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Current Score: {score.total > 0 ? `${score.correct}/${score.total} (${Math.round((score.correct / score.total) * 100)}%)` : 'Not played yet'}
              </div>
            </div>
          )}

          {gameMode && gameQuestions[currentQuestion] && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Question {currentQuestion + 1} of {gameQuestions.length}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Score: {score.correct}/{score.total}
                </span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white">
                  "{gameQuestions[currentQuestion].text}"
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {gameQuestions[currentQuestion].options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleGameAnswer(option)}
                    className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-900 dark:text-blue-100 px-4 py-2 rounded-lg font-medium transition-colors capitalize"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}