import React, { useState } from 'react';
import { Book, ChevronDown, ChevronRight, Map, BarChart3, Calendar, Hash, Upload, Wifi, Brain, Target, Globe, TrendingUp, Filter, Zap } from 'lucide-react';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppDocumentation({ isOpen, onClose }: DocumentationProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const documentationSections = [
    {
      id: 'overview',
      title: 'Application Overview',
      icon: <Brain className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>GeoSentiment Lens</strong> is an advanced sentiment analysis platform that combines natural language processing, 
            geographic visualization, and real-time data processing to provide comprehensive insights into public opinion and emotions.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Key Capabilities:</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
              <li>Real-time sentiment analysis of social media posts and news</li>
              <li>Geographic mapping of sentiment patterns worldwide</li>
              <li>Emotion detection (Joy, Sadness, Anger, Fear, Surprise)</li>
              <li>Timeline analysis showing sentiment trends over time</li>
              <li>Keyword and hashtag trend analysis</li>
              <li>Live data feeds from Twitter API and news sources</li>
              <li>Custom dataset upload and processing</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'geographic-map',
      title: 'Geographic Sentiment Map',
      icon: <Map className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            The Geographic Map visualizes sentiment data across global locations using interactive markers and heatmaps.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Visualization Modes
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Markers:</strong> Circle markers sized by post count, colored by dominant sentiment</li>
                <li><strong>Heatmap:</strong> Density visualization showing sentiment intensity across regions</li>
                <li><strong>Emoji:</strong> Emotion-based emoji markers representing dominant feelings</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Data Sources
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Your Data:</strong> Uploaded CSV datasets with location information</li>
                <li><strong>Live Feed:</strong> Real-time Twitter posts and news articles</li>
                <li><strong>Demo Data:</strong> Sample dataset for exploration and testing</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">How to Use:</h4>
            <ol className="list-decimal list-inside space-y-1 text-yellow-800 dark:text-yellow-200 text-sm">
              <li>Select visualization mode (Markers, Heatmap, or Emoji)</li>
              <li>Click on markers to see detailed sentiment breakdown</li>
              <li>Use filters to focus on specific time periods or sentiments</li>
              <li>Zoom and pan to explore different geographic regions</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'timeline',
      title: 'Timeline Analysis',
      icon: <Calendar className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            The Timeline view shows how sentiment and emotions change over time, revealing patterns and trends in public opinion.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analysis Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><strong>Sentiment Trends:</strong> Line chart showing positive/negative sentiment over time</li>
              <li><strong>Emotion Tracking:</strong> Multi-line chart displaying joy, sadness, anger, fear, and surprise</li>
              <li><strong>Volume Analysis:</strong> Post count variations indicating activity levels</li>
              <li><strong>Peak Detection:</strong> Automatic identification of sentiment spikes and valleys</li>
              <li><strong>Interactive Points:</strong> Click on data points to filter by specific dates</li>
            </ul>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Insights Generated:</h4>
            <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-200 text-sm">
              <li>Dominant sentiment periods and their duration</li>
              <li>Correlation between events and sentiment changes</li>
              <li>Activity patterns and peak engagement times</li>
              <li>Trend direction (improving, declining, or stable sentiment)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Smart Dashboard',
      icon: <BarChart3 className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            The Dashboard provides comprehensive analytics and AI-generated insights from your sentiment data.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Metrics</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Total posts analyzed</li>
                <li>• Average confidence scores</li>
                <li>• Geographic coverage</li>
                <li>• Data source distribution</li>
                <li>• Sentiment distribution percentages</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Regional Analysis</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• City-by-city sentiment breakdown</li>
                <li>• Dominant emotions per region</li>
                <li>• Activity levels comparison</li>
                <li>• Regional trending keywords</li>
                <li>• Cross-regional sentiment patterns</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">AI-Generated Insights</h4>
            <p className="text-purple-800 dark:text-purple-200 text-sm mb-2">
              The system automatically generates intelligent insights such as:
            </p>
            <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200 text-sm">
              <li>"Mumbai shows 25% rise in fear during cricket finals"</li>
              <li>"Overall sentiment is positive (68% of posts)"</li>
              <li>"Technology events dominate the conversation (45 posts)"</li>
              <li>"High confidence analysis with 87% average accuracy"</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'keywords',
      title: 'Keyword Explorer',
      icon: <Hash className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            The Keyword Explorer analyzes trending terms, hashtags, and their associated sentiments through interactive word clouds and detailed analysis.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><strong>Word Cloud:</strong> Visual representation with size indicating frequency</li>
              <li><strong>Sentiment Association:</strong> Color-coded keywords by sentiment</li>
              <li><strong>Trending Analysis:</strong> Top keywords ranked by frequency or sentiment</li>
              <li><strong>Hashtag Tracking:</strong> Special handling for social media hashtags</li>
              <li><strong>Clickable Filtering:</strong> Click keywords to filter all visualizations</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Analysis Capabilities:</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
              <li>Keyword frequency and sentiment correlation</li>
              <li>Recent posts containing selected keywords</li>
              <li>Sentiment distribution for each keyword</li>
              <li>Filtering by sentiment type (positive, negative, neutral)</li>
              <li>Sorting by frequency or sentiment strength</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'data-upload',
      title: 'Data Upload & Processing',
      icon: <Upload className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Upload your own datasets for analysis with automatic processing and validation.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Supported Formats</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><strong>CSV Files:</strong> Comma-separated values with headers</li>
              <li><strong>JSON Files:</strong> Structured data in JSON format</li>
              <li><strong>TXT Files:</strong> Plain text with structured content</li>
            </ul>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Required Fields:</h4>
            <ul className="space-y-1 text-green-800 dark:text-green-200 text-sm">
              <li><strong>text:</strong> The content to analyze (required)</li>
              <li><strong>timestamp:</strong> When the content was created (optional)</li>
              <li><strong>lat/lng:</strong> Geographic coordinates (optional)</li>
              <li><strong>city/country:</strong> Location names (optional)</li>
              <li><strong>source:</strong> Data source identifier (optional)</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Processing Pipeline:</h4>
            <ol className="list-decimal list-inside space-y-1 text-yellow-800 dark:text-yellow-200 text-sm">
              <li>Data validation and cleaning</li>
              <li>Sentiment analysis using advanced NLP</li>
              <li>Emotion detection and scoring</li>
              <li>Keyword extraction and categorization</li>
              <li>Geographic coordinate validation</li>
              <li>Event type classification</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'live-feed',
      title: 'Live Data Feed',
      icon: <Wifi className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Real-time data collection from Twitter API and news sources with automatic processing and visualization updates.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Data Sources</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Twitter API v2 (real tweets)</li>
                <li>• News RSS feeds</li>
                <li>• Social media APIs</li>
                <li>• Enhanced fallback data</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Filter Options</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Time period (today, week, month)</li>
                <li>• Geographic region</li>
                <li>• Sentiment focus</li>
                <li>• Emotion type</li>
                <li>• Update frequency</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Real-time Processing:</h4>
            <ul className="list-disc list-inside space-y-1 text-red-800 dark:text-red-200 text-sm">
              <li>Automatic sentiment analysis of incoming data</li>
              <li>Geographic coordinate extraction and validation</li>
              <li>Emotion detection and scoring</li>
              <li>Keyword extraction and trend analysis</li>
              <li>Simultaneous updates across all visualizations</li>
              <li>Quality assurance and data validation</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'filters',
      title: 'Advanced Filtering',
      icon: <Filter className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Comprehensive filtering system that applies across all visualizations simultaneously.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Filter Types</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Date Range:</strong> Start and end date selection</li>
                <li><strong>Sentiment:</strong> Positive, negative, or neutral</li>
                <li><strong>Emotion:</strong> Joy, sadness, anger, fear, surprise</li>
                <li><strong>Source:</strong> Twitter, news, or uploaded data</li>
                <li><strong>Keywords:</strong> Text search across content</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Global Application</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Map markers and heatmaps</li>
                <li>• Timeline charts and trends</li>
                <li>• Dashboard statistics</li>
                <li>• Keyword analysis</li>
                <li>• Regional breakdowns</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Active Filter Display:</h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              All active filters are displayed as colored tags below the filter panel, making it easy to see what 
              filters are currently applied and allowing quick removal of individual filters.
            </p>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Book className="h-6 w-6 text-blue-600" />
            Application Documentation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <div className="space-y-4">
            {documentationSections.map((section) => (
              <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">
                      {section.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {section.title}
                    </h3>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {expandedSections.has(section.id) && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="pt-4">
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            For additional support or questions, refer to the sample data and tooltips throughout the application.
          </p>
        </div>
      </div>
    </div>
  );
}