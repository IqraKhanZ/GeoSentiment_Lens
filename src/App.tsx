import React, { useState, useEffect } from 'react';
import { Brain, Download, Settings, Info, Database, Trash2, Loader, CheckCircle, AlertCircle, Book } from 'lucide-react';
import { useGeoData } from './hooks/useGeoData';
import { DataInput } from './components/DataInput';
import { GeoMap } from './components/GeoMap';
import { Timeline } from './components/Timeline';
import { Dashboard } from './components/Dashboard';
import { KeywordExplorer } from './components/KeywordExplorer';
import { FilterPanel } from './components/FilterPanel';
import { LivePreview } from './components/LivePreview';
import { AppDocumentation } from './components/AppDocumentation';
import { WelcomeModal } from './components/WelcomeModal';
import { ThemeToggle } from './components/ThemeToggle';
import { SentimentData } from './types';
import { dataStorageService } from './services/dataStorage';

function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'timeline' | 'dashboard' | 'keywords'>('map');
  const [showInfo, setShowInfo] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  const {
    data,
    allData,
    regionData,
    timelineData,
    loading,
    error,
    hasUploadedData,
    isLiveActive,
    dataSource,
    processingStatus,
    filters,
    setFilters,
    actions
  } = useGeoData();

  // Check for first-time user and show welcome modal
  useEffect(() => {
    const isFirstTime = dataStorageService.isFirstTimeUser();
    if (isFirstTime) {
      setShowWelcome(true);
    }
    
    // Migrate any old non-private data
    dataStorageService.migrateOldData();
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    dataStorageService.markOnboardingComplete();
  };

  const handleWelcomeToDocumentation = () => {
    setShowWelcome(false);
    setShowDocumentation(true);
    dataStorageService.markOnboardingComplete();
  };

  const handleLocationClick = (location: any) => {
    console.log('Location clicked:', location);
  };

  const handleCsvUpload = (csvText: string) => {
    actions.uploadCsvData(csvText);
  };

  const handleLiveFeedToggle = (enabled: boolean) => {
    actions.toggleLiveFeed(enabled);
  };

  const handleLiveDataReceived = (newData: SentimentData[]) => {
    actions.addLiveData(newData);
  };

  const handleKeywordFilter = (keyword: string) => {
    setFilters.setKeywordFilter(keyword);
    setActiveTab('map'); // Switch to map to show filtered results
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setFilters.setDateRange({ start, end });
  };

  const clearAllFilters = () => {
    setFilters.setDateRange({ start: '', end: '' });
    setFilters.setSentimentFilter('all');
    setFilters.setEmotionFilter('all');
    setFilters.setSourceFilter('all');
    setFilters.setKeywordFilter('');
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sentiment-analysis-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearStoredData = async () => {
    if (confirm('Are you sure you want to clear all your private data? This action cannot be undone and will only affect your personal datasets.')) {
      await actions.clearData();
    }
  };

  const getProcessingStatusIcon = () => {
    switch (processingStatus) {
      case 'processing':
        return <Loader className="h-4 w-4 animate-spin text-blue-600" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getProcessingStatusText = () => {
    switch (processingStatus) {
      case 'processing':
        return 'Processing data...';
      case 'complete':
        return 'Data ready';
      case 'error':
        return 'Processing error';
      default:
        return 'Ready';
    }
  };

  const tabButtons = [
    { id: 'map', label: 'Geographic Map', icon: '🗺️' },
    { id: 'timeline', label: 'Timeline', icon: '📈' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'keywords', label: 'Keywords', icon: '#️⃣' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  GeoSentiment Lens
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interactive Sentiment Analysis & Geographic Mapping
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Processing Status */}
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {getProcessingStatusIcon()}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getProcessingStatusText()}
                </span>
              </div>

              {/* Privacy Indicator */}
              {hasUploadedData && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Private Data
                  </span>
                </div>
              )}

              {hasUploadedData && (
                <button
                  onClick={clearStoredData}
                  className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                  title="Clear your private dataset"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear My Data
                </button>
              )}
              
              <button
                onClick={() => setShowDocumentation(true)}
                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                title="Documentation"
              >
                <Book className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </button>
              
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="About"
              >
                <Info className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              <button
                onClick={exportData}
                disabled={data.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                title="Export Data"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Info Panel */}
      {showInfo && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Welcome to GeoSentiment Lens!</p>
                <p className="mb-2">
                  This application analyzes public sentiment and emotions from social media posts and news headlines, 
                  visualizing them geographically. Your uploaded data is completely private and secure.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Upload datasets:</strong> CSV files with text, location, and timestamp data (private storage)</li>
                  <li><strong>Live preview:</strong> Real-time data simulation with customizable filters</li>
                  <li><strong>Explore geographically:</strong> Interactive maps showing sentiment by location</li>
                  <li><strong>Analyze trends:</strong> Timeline views and keyword exploration</li>
                  <li><strong>Compare regions:</strong> Dashboard with insights and comparisons</li>
                </ul>
                <p className="mt-2 text-xs">
                  🔒 <strong>Privacy:</strong> Your data is stored with a unique ID and never shared with other users.
                  Click the <Book className="h-4 w-4 inline mx-1" /> Documentation button for detailed feature explanations.
                </p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-blue-600 hover:text-blue-700 ml-auto"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Data Input */}
        <DataInput
          onCsvUpload={handleCsvUpload}
          onLiveFeedToggle={handleLiveFeedToggle}
          onLiveDataReceived={handleLiveDataReceived}
          loading={loading}
          error={error}
          hasUploadedData={hasUploadedData}
        />

        {/* Live Preview Controls */}
        <LivePreview
          onDataReceived={handleLiveDataReceived}
          isActive={isLiveActive}
          onToggle={handleLiveFeedToggle}
          onFiltersChange={(filters) => {
            // Apply live feed filters to main filters
            console.log('Live feed filters changed:', filters);
          }}
        />

        {/* Filters */}
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearAllFilters}
        />

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabButtons.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {activeTab === 'map' && (
            <GeoMap
              data={data}
              onLocationClick={handleLocationClick}
              dataSource={dataSource}
              isLiveActive={isLiveActive}
            />
          )}
          
          {activeTab === 'timeline' && (
            <Timeline
              data={timelineData}
              onDateRangeChange={handleDateRangeChange}
              hasUploadedData={hasUploadedData}
            />
          )}
          
          {activeTab === 'dashboard' && (
            <Dashboard
              data={data}
              regionData={regionData}
              hasUploadedData={hasUploadedData}
            />
          )}
          
          {activeTab === 'keywords' && (
            <KeywordExplorer
              data={data}
              onKeywordFilter={handleKeywordFilter}
            />
          )}
        </div>

        {/* Data Summary */}
        {data.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Data Points
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {regionData.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Regions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {timelineData.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Time Points
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    dataSource === 'uploaded' ? 'text-blue-600 dark:text-blue-400' :
                    dataSource === 'live' ? 'text-green-600 dark:text-green-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {dataSource === 'uploaded' && '🔒 Your Private Data'}
                    {dataSource === 'live' && (isLiveActive ? '🔴 Live Feed' : '⏸️ Live Paused')}
                    {dataSource === 'demo' && '📊 Demo Data'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Data Source
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {loading ? 'Processing...' : 
                   dataSource === 'uploaded' ? 'Your private dataset' : 
                   dataSource === 'live' ? 'Live data' : 'Sample data'}
                </div>
                {dataSource === 'uploaded' && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    🔒 Private & Secure
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Welcome Modal for New Users */}
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleWelcomeClose}
        onOpenDocumentation={handleWelcomeToDocumentation}
      />

      {/* Documentation Modal */}
      <AppDocumentation 
        isOpen={showDocumentation} 
        onClose={() => setShowDocumentation(false)} 
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              GeoSentiment Lens - Advanced sentiment analysis and geographic visualization
            </p>
            <p className="text-xs mt-1">
              Built with React, TypeScript, Tailwind CSS, and Leaflet • 🔒 Privacy-First Design
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;