import { useState, useEffect, useCallback } from 'react';
import { SentimentData, RegionData, TimelinePoint } from '../types';
import { generateMockData, processCsvData, processRegionData, generateTimelineData } from '../utils/dataProcessor';
import { dataStorageService } from '../services/dataStorage';

export function useGeoData() {
  const [data, setData] = useState<SentimentData[]>([]);
  const [filteredData, setFilteredData] = useState<SentimentData[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [timelineData, setTimelineData] = useState<TimelinePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUploadedData, setHasUploadedData] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [dataSource, setDataSource] = useState<'uploaded' | 'demo' | 'live'>('demo');
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');

  // Filters
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [emotionFilter, setEmotionFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [keywordFilter, setKeywordFilter] = useState<string>('');

  // Load persisted private data on app start
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        setProcessingStatus('processing');
        const persistedData = await dataStorageService.loadData();
        if (persistedData && persistedData.length > 0) {
          setData(persistedData);
          setHasUploadedData(true);
          setDataSource('uploaded');
          setProcessingStatus('complete');
          console.log('Loaded private data for user:', dataStorageService.getCurrentUserId(), 'Items:', persistedData.length);
        } else {
          // Only show sample data if no private data exists
          const mockData = generateMockData(50);
          setData(mockData);
          setHasUploadedData(false);
          setDataSource('demo');
          setProcessingStatus('complete');
          console.log('No private data found, showing sample data for user:', dataStorageService.getCurrentUserId());
        }
      } catch (error) {
        console.error('Failed to load private data:', error);
        setProcessingStatus('error');
        // Fallback to sample data
        const mockData = generateMockData(50);
        setData(mockData);
        setHasUploadedData(false);
        setDataSource('demo');
        setTimeout(() => setProcessingStatus('complete'), 1000);
      }
    };

    loadPersistedData();
  }, []);

  // Process data when it changes
  useEffect(() => {
    if (data.length > 0) {
      setRegionData(processRegionData(data));
      setTimelineData(generateTimelineData(data));
    }
  }, [data]);

  // Apply filters
  useEffect(() => {
    let filtered = [...data];

    // Date filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= new Date(dateRange.start) && itemDate <= new Date(dateRange.end);
      });
    }

    // Sentiment filter
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(item => item.sentiment.label === sentimentFilter);
    }

    // Emotion filter
    if (emotionFilter !== 'all') {
      filtered = filtered.filter(item => {
        const emotions = item.emotions;
        const dominantEmotion = Object.entries(emotions)
          .reduce((a, b) => emotions[a[0] as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b)[0];
        return dominantEmotion === emotionFilter;
      });
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(item => item.source === sourceFilter);
    }

    // Keyword filter
    if (keywordFilter) {
      filtered = filtered.filter(item => 
        item.text.toLowerCase().includes(keywordFilter.toLowerCase()) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(keywordFilter.toLowerCase()))
      );
    }

    setFilteredData(filtered);
  }, [data, dateRange, sentimentFilter, emotionFilter, sourceFilter, keywordFilter]);

  const uploadCsvData = useCallback(async (csvText: string) => {
    setLoading(true);
    setError(null);
    setProcessingStatus('processing');
    
    try {
      console.log('Processing uploaded CSV data for user:', dataStorageService.getCurrentUserId());
      
      // Simulate background processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const processedData = processCsvData(csvText);
      
      // Store data privately for this user
      await dataStorageService.saveData(processedData);
      
      setData(processedData);
      setHasUploadedData(true);
      setDataSource('uploaded');
      setIsLiveActive(false); // Stop live feed when uploading new data
      setProcessingStatus('complete');
      
      console.log('Successfully processed and stored private data for user:', dataStorageService.getCurrentUserId(), 'Items:', processedData.length);
    } catch (err) {
      console.error('CSV processing error:', err);
      setError('Failed to process CSV data. Please check the format and try again.');
      setProcessingStatus('error');
    } finally {
      setLoading(false);
    }
  }, []);

  const addLiveData = useCallback(async (newData: SentimentData[]) => {
    if (!isLiveActive) return;
    
    const updatedData = [...data, ...newData];
    setData(updatedData);
    setDataSource('live');
    
    // Don't persist live data to avoid overwhelming private storage
    console.log('Added live data for user:', dataStorageService.getCurrentUserId(), 'New points:', newData.length);
  }, [data, isLiveActive]);

  const toggleLiveFeed = useCallback((active: boolean) => {
    setIsLiveActive(active);
    if (active) {
      setDataSource('live');
      // Clear existing data when starting live feed
      setData([]);
    } else {
      // Revert to private uploaded data or demo data
      if (hasUploadedData) {
        dataStorageService.loadData().then(persistedData => {
          if (persistedData) {
            setData(persistedData);
            setDataSource('uploaded');
          }
        });
      } else {
        const mockData = generateMockData(50);
        setData(mockData);
        setDataSource('demo');
      }
    }
  }, [hasUploadedData]);

  const clearData = useCallback(async () => {
    try {
      await dataStorageService.clearData();
      setData([]);
      setFilteredData([]);
      setHasUploadedData(false);
      setIsLiveActive(false);
      setDataSource('demo');
      
      // Load sample data after clearing private data
      const mockData = generateMockData(50);
      setData(mockData);
      
      console.log('Cleared private data for user:', dataStorageService.getCurrentUserId());
    } catch (error) {
      console.error('Failed to clear private data:', error);
    }
  }, []);

  return {
    data: filteredData,
    allData: data,
    regionData,
    timelineData,
    loading,
    error,
    hasUploadedData,
    isLiveActive,
    dataSource,
    processingStatus,
    filters: {
      dateRange,
      sentimentFilter,
      emotionFilter,
      sourceFilter,
      keywordFilter
    },
    setFilters: {
      setDateRange,
      setSentimentFilter,
      setEmotionFilter,
      setSourceFilter,
      setKeywordFilter
    },
    actions: {
      uploadCsvData,
      addLiveData,
      toggleLiveFeed,
      clearData
    }
  };
}