import React from 'react';
import { Filter, Calendar, Tag, Soup as Source, Heart } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    dateRange: { start: string; end: string };
    sentimentFilter: string;
    emotionFilter: string;
    sourceFilter: string;
    keywordFilter: string;
  };
  onFiltersChange: {
    setDateRange: (range: { start: string; end: string }) => void;
    setSentimentFilter: (filter: string) => void;
    setEmotionFilter: (filter: string) => void;
    setSourceFilter: (filter: string) => void;
    setKeywordFilter: (filter: string) => void;
  };
  onClearFilters: () => void;
}

export function FilterPanel({ filters, onFiltersChange, onClearFilters }: FilterPanelProps) {
  const hasActiveFilters = 
    filters.dateRange.start || 
    filters.sentimentFilter !== 'all' || 
    filters.emotionFilter !== 'all' || 
    filters.sourceFilter !== 'all' || 
    filters.keywordFilter;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          Filters
        </h2>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Date Range
          </label>
          <div className="space-y-1">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => onFiltersChange.setDateRange({ ...filters.dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Start date"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => onFiltersChange.setDateRange({ ...filters.dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="End date"
            />
          </div>
        </div>

        {/* Sentiment Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Sentiment
          </label>
          <select
            value={filters.sentimentFilter}
            onChange={(e) => onFiltersChange.setSentimentFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        {/* Emotion Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Emotion
          </label>
          <select
            value={filters.emotionFilter}
            onChange={(e) => onFiltersChange.setEmotionFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Emotions</option>
            <option value="joy">Joy</option>
            <option value="sadness">Sadness</option>
            <option value="anger">Anger</option>
            <option value="fear">Fear</option>
            <option value="surprise">Surprise</option>
          </select>
        </div>

        {/* Source Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Source className="h-4 w-4" />
            Source
          </label>
          <select
            value={filters.sourceFilter}
            onChange={(e) => onFiltersChange.setSourceFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Sources</option>
            <option value="twitter">Twitter</option>
            <option value="news">News</option>
            <option value="upload">Upload</option>
          </select>
        </div>

        {/* Keyword Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Tag className="h-4 w-4" />
            Keywords
          </label>
          <input
            type="text"
            value={filters.keywordFilter}
            onChange={(e) => onFiltersChange.setKeywordFilter(e.target.value)}
            placeholder="Search keywords..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {filters.dateRange.start && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                From: {filters.dateRange.start}
              </span>
            )}
            {filters.dateRange.end && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                To: {filters.dateRange.end}
              </span>
            )}
            {filters.sentimentFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 capitalize">
                {filters.sentimentFilter}
              </span>
            )}
            {filters.emotionFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 capitalize">
                {filters.emotionFilter}
              </span>
            )}
            {filters.sourceFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 capitalize">
                {filters.sourceFilter}
              </span>
            )}
            {filters.keywordFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                "{filters.keywordFilter}"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}