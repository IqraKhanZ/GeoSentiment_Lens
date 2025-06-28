import React, { useState, useEffect } from 'react';
import { Play, Pause, Wifi, Calendar, Heart, MapPin, Loader, CheckCircle, AlertCircle, Smile } from 'lucide-react';
import { SentimentData } from '../types';
import { liveDataService } from '../services/liveDataService';

interface LivePreviewProps {
  onDataReceived: (data: SentimentData[]) => void;
  isActive: boolean;
  onToggle: (active: boolean) => void;
  onFiltersChange: (filters: any) => void;
}

export function LivePreview({ onDataReceived, isActive, onToggle, onFiltersChange }: LivePreviewProps) {
  const [selectedDay, setSelectedDay] = useState<string>('today');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [dataCount, setDataCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [updateInterval, setUpdateInterval] = useState<number>(30);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      setConnectionStatus('connected');
      // Start fetching data immediately
      fetchLiveData();
      
      // Set up interval for continuous updates
      interval = setInterval(fetchLiveData, updateInterval * 1000);
    } else {
      setConnectionStatus('disconnected');
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, selectedDay, selectedSentiment, selectedEmotion, selectedRegion, updateInterval]);

  // Notify parent about filter changes
  useEffect(() => {
    onFiltersChange({
      day: selectedDay,
      sentiment: selectedSentiment,
      emotion: selectedEmotion,
      region: selectedRegion
    });
  }, [selectedDay, selectedSentiment, selectedEmotion, selectedRegion, onFiltersChange]);

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      const filters = {
        day: selectedDay,
        sentiment: selectedSentiment,
        emotion: selectedEmotion,
        region: selectedRegion
      };
      
      const newData = await liveDataService.fetchData(filters);
      
      if (newData && newData.length > 0) {
        onDataReceived(newData);
        setDataCount(prev => prev + newData.length);
        setLastUpdate(new Date().toLocaleTimeString());
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Failed to fetch live data:', error);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    onToggle(!isActive);
    if (!isActive) {
      setDataCount(0);
      setLastUpdate('');
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Live Feed Connected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Live Feed Disconnected';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Wifi className="h-6 w-6 text-blue-600" />
          Live Data Controls
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            {getStatusIcon()}
            <span className={`font-medium ${
              connectionStatus === 'connected' ? 'text-green-600' :
              connectionStatus === 'error' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {getStatusText()}
            </span>
          </div>
          
          <button
            onClick={handleToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isActive ? 'Stop Live Feed' : 'Start Live Feed'}
          </button>
        </div>
      </div>

      {/* Unified Filter Controls with Emotions */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Time Period
          </label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Sentiment Focus
          </label>
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive Only</option>
            <option value="negative">Negative Only</option>
            <option value="neutral">Neutral Only</option>
            <option value="trending">Trending Topics</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
            <Smile className="h-4 w-4" />
            Emotion Focus
          </label>
          <select
            value={selectedEmotion}
            onChange={(e) => setSelectedEmotion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Emotions</option>
            <option value="joy">Joy</option>
            <option value="sadness">Sadness</option>
            <option value="anger">Anger</option>
            <option value="fear">Fear</option>
            <option value="surprise">Surprise</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Region
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="global">Global</option>
            <option value="north-america">North America</option>
            <option value="europe">Europe</option>
            <option value="asia">Asia</option>
            <option value="africa">Africa</option>
            <option value="south-america">South America</option>
            <option value="oceania">Oceania</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Update Rate
          </label>
          <select
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value={15}>15 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>
      </div>

      {/* Status Display */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">
                {isActive ? `Live Feed Active (${updateInterval}s intervals)` : 'Live Feed Stopped'}
              </span>
            </div>
            
            {loading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm">Fetching data...</span>
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Data Points: <span className="font-medium text-gray-900 dark:text-white">{dataCount}</span>
            </div>
            {lastUpdate && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Last update: {lastUpdate}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Live Feed Information</h3>
        <div className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
          <p>• <strong>Data Sources:</strong> News APIs, Social Media feeds, RSS feeds</p>
          <p>• <strong>Processing:</strong> Real-time sentiment analysis and emotion detection</p>
          <p>• <strong>Updates:</strong> All visualizations update automatically when new data arrives</p>
          <p>• <strong>Filters:</strong> Changes apply to Map, Timeline, Dashboard, and Keywords simultaneously</p>
          <p>• <strong>Quality:</strong> Data is validated and processed before display</p>
          <p>• <strong>Emotions:</strong> Joy, Sadness, Anger, Fear, and Surprise detection included</p>
        </div>
      </div>
    </div>
  );
}