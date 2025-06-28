import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, Info, Database, Wifi, Upload } from 'lucide-react';
import { SentimentData } from '../types';
import 'leaflet/dist/leaflet.css';

interface GeoMapProps {
  data: SentimentData[];
  onLocationClick: (location: SentimentData['location']) => void;
  dataSource: 'uploaded' | 'demo' | 'live';
  isLiveActive: boolean;
}

// Custom component to handle map updates
function MapUpdater({ data }: { data: SentimentData[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (data.length > 0) {
      // Fit map to show all data points
      const bounds = data.map(item => [item.location.lat, item.location.lng] as [number, number]);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [data, map]);

  return null;
}

// Custom Emoji Marker Component
function EmojiMarker({ 
  position, 
  emoji, 
  onClick, 
  tooltip 
}: { 
  position: [number, number]; 
  emoji: string; 
  onClick: () => void; 
  tooltip: string; 
}) {
  const map = useMap();
  
  useEffect(() => {
    const container = map.getContainer();
    const mapRect = container.getBoundingClientRect();
    
    // Convert lat/lng to pixel coordinates
    const point = map.latLngToContainerPoint(position);
    
    // Create emoji element
    const emojiElement = document.createElement('div');
    emojiElement.innerHTML = emoji;
    emojiElement.className = 'emoji-marker';
    emojiElement.style.cssText = `
      position: absolute;
      left: ${point.x - 12}px;
      top: ${point.y - 12}px;
      font-size: 24px;
      cursor: pointer;
      z-index: 1000;
      pointer-events: auto;
      transition: transform 0.2s ease;
      transform-origin: center;
    `;
    
    emojiElement.addEventListener('mouseenter', () => {
      emojiElement.style.transform = 'scale(1.3)';
    });
    
    emojiElement.addEventListener('mouseleave', () => {
      emojiElement.style.transform = 'scale(1)';
    });
    
    emojiElement.addEventListener('click', onClick);
    emojiElement.title = tooltip;
    
    container.appendChild(emojiElement);
    
    // Update position on map move
    const updatePosition = () => {
      const newPoint = map.latLngToContainerPoint(position);
      emojiElement.style.left = `${newPoint.x - 12}px`;
      emojiElement.style.top = `${newPoint.y - 12}px`;
    };
    
    map.on('zoom', updatePosition);
    map.on('move', updatePosition);
    
    return () => {
      container.removeChild(emojiElement);
      map.off('zoom', updatePosition);
      map.off('move', updatePosition);
    };
  }, [map, position, emoji, onClick, tooltip]);
  
  return null;
}

export function GeoMap({ data, onLocationClick, dataSource, isLiveActive }: GeoMapProps) {
  const [mapStyle, setMapStyle] = useState<'heatmap' | 'emoji' | 'markers'>('markers');

  const getSentimentColor = (sentiment: SentimentData['sentiment']) => {
    const alpha = Math.max(0.6, sentiment.confidence);
    switch (sentiment.label) {
      case 'positive':
        return `rgba(34, 197, 94, ${alpha})`;
      case 'negative':
        return `rgba(239, 68, 68, ${alpha})`;
      default:
        return `rgba(107, 114, 128, ${alpha})`;
    }
  };

  const getSentimentEmoji = (sentiment: SentimentData['sentiment'], emotions: SentimentData['emotions']) => {
    if (sentiment.label === 'positive') {
      if (emotions.joy > 0.5) return '😊';
      if (emotions.surprise > 0.5) return '😮';
      return '👍';
    } else if (sentiment.label === 'negative') {
      if (emotions.anger > 0.5) return '😠';
      if (emotions.sadness > 0.5) return '😢';
      if (emotions.fear > 0.5) return '😨';
      return '👎';
    }
    return '😐';
  };

  const aggregatedData = useMemo(() => {
    const locationMap = new Map();
    
    data.forEach(item => {
      // Validate coordinates
      if (!item.location || 
          typeof item.location.lat !== 'number' || 
          typeof item.location.lng !== 'number' ||
          item.location.lat < -90 || item.location.lat > 90 ||
          item.location.lng < -180 || item.location.lng > 180) {
        console.warn('Invalid coordinates for item:', item);
        return;
      }

      // Group by approximate location (rounded to 2 decimal places for better clustering)
      const key = `${Math.round(item.location.lat * 100) / 100},${Math.round(item.location.lng * 100) / 100}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          location: item.location,
          items: [],
          sentimentCounts: { positive: 0, negative: 0, neutral: 0 },
          totalCount: 0
        });
      }
      
      const group = locationMap.get(key);
      group.items.push(item);
      group.sentimentCounts[item.sentiment.label]++;
      group.totalCount++;
    });

    return Array.from(locationMap.values());
  }, [data]);

  const getMarkerSize = (count: number) => {
    return Math.max(8, Math.min(25, count * 2 + 5));
  };

  const getDataSourceIcon = () => {
    switch (dataSource) {
      case 'uploaded':
        return <Upload className="h-4 w-4 text-blue-600" />;
      case 'live':
        return <Wifi className="h-4 w-4 text-green-600" />;
      default:
        return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDataSourceText = () => {
    switch (dataSource) {
      case 'uploaded':
        return 'Your Uploaded Data';
      case 'live':
        return isLiveActive ? 'Live Feed Data (Active)' : 'Live Feed Data (Paused)';
      default:
        return 'Demo Sample Data';
    }
  };

  const getDataSourceColor = () => {
    switch (dataSource) {
      case 'uploaded':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
      case 'live':
        return isLiveActive 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Data Source Indicator */}
      <div className={`mb-4 p-3 rounded-lg border ${getDataSourceColor()}`}>
        <div className="flex items-center gap-2">
          {getDataSourceIcon()}
          <span className="font-medium">Currently Showing: {getDataSourceText()}</span>
          {dataSource === 'live' && isLiveActive && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
          )}
        </div>
        <p className="text-sm mt-1 opacity-80">
          {dataSource === 'uploaded' && 'Displaying analysis of your uploaded dataset'}
          {dataSource === 'live' && 'Real-time data updates every 30 seconds'}
          {dataSource === 'demo' && 'Sample data for demonstration purposes'}
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          Geographic Sentiment Map
        </h2>
        
        <div className="flex items-center gap-2">
          {/* Map Style Toggle */}
          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="markers">Markers</option>
            <option value="heatmap">Heatmap</option>
            <option value="emoji">Emoji</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 relative">
        {data.length > 0 ? (
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapUpdater data={data} />
            
            {/* Regular Markers */}
            {mapStyle === 'markers' && aggregatedData.map((group, index) => {
              const dominantSentiment = Object.entries(group.sentimentCounts)
                .reduce((a, b) => group.sentimentCounts[a[0] as keyof typeof group.sentimentCounts] > group.sentimentCounts[b[0] as keyof typeof group.sentimentCounts] ? a : b)[0];
              
              const avgSentiment = {
                label: dominantSentiment as 'positive' | 'negative' | 'neutral',
                confidence: Math.min(0.9, group.totalCount / 10 * 0.8 + 0.3)
              };

              const size = getMarkerSize(group.totalCount);
              const color = getSentimentColor(avgSentiment);

              return (
                <CircleMarker
                  key={index}
                  center={[group.location.lat, group.location.lng]}
                  radius={size}
                  pathOptions={{
                    fillColor: color,
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                  }}
                  eventHandlers={{
                    click: () => onLocationClick(group.location)
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold mb-2">
                        {group.location.city}, {group.location.country}
                      </div>
                      <div className="mb-2">
                        <strong>Posts:</strong> {group.totalCount}
                      </div>
                      <div className="mb-2">
                        <strong>Dominant Sentiment:</strong> 
                        <span className={`ml-1 capitalize ${
                          dominantSentiment === 'positive' ? 'text-green-600' :
                          dominantSentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {dominantSentiment}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-600">😊 {group.sentimentCounts.positive}</span>
                        <span className="text-gray-600">😐 {group.sentimentCounts.neutral}</span>
                        <span className="text-red-600">😢 {group.sentimentCounts.negative}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Click to filter by location
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

            {/* Emoji Markers */}
            {mapStyle === 'emoji' && aggregatedData.map((group, index) => {
              const dominantSentiment = Object.entries(group.sentimentCounts)
                .reduce((a, b) => group.sentimentCounts[a[0] as keyof typeof group.sentimentCounts] > group.sentimentCounts[b[0] as keyof typeof group.sentimentCounts] ? a : b)[0];
              
              const avgSentiment = {
                label: dominantSentiment as 'positive' | 'negative' | 'neutral',
                confidence: Math.min(0.9, group.totalCount / 10 * 0.8 + 0.3)
              };

              const emoji = getSentimentEmoji(avgSentiment, group.items[0]?.emotions || { joy: 0, sadness: 0, anger: 0, fear: 0, surprise: 0 });
              
              return (
                <EmojiMarker
                  key={index}
                  position={[group.location.lat, group.location.lng]}
                  emoji={emoji}
                  onClick={() => onLocationClick(group.location)}
                  tooltip={`${group.location.city}, ${group.location.country} - ${group.totalCount} posts`}
                />
              );
            })}

            {/* Heatmap Layer */}
            {mapStyle === 'heatmap' && (
              <>
                {aggregatedData.map((group, index) => {
                  const dominantSentiment = Object.entries(group.sentimentCounts)
                    .reduce((a, b) => group.sentimentCounts[a[0] as keyof typeof group.sentimentCounts] > group.sentimentCounts[b[0] as keyof typeof group.sentimentCounts] ? a : b)[0];
                  
                  const intensity = Math.min(group.totalCount / 10, 1);
                  const radius = Math.max(20, intensity * 50);
                  
                  const color = dominantSentiment === 'positive' ? '#22c55e' : 
                               dominantSentiment === 'negative' ? '#ef4444' : '#6b7280';

                  return (
                    <CircleMarker
                      key={index}
                      center={[group.location.lat, group.location.lng]}
                      radius={radius}
                      pathOptions={{
                        fillColor: color,
                        color: color,
                        weight: 0,
                        opacity: 0.6,
                        fillOpacity: intensity * 0.4
                      }}
                      eventHandlers={{
                        click: () => onLocationClick(group.location)
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <div className="font-semibold mb-2">
                            {group.location.city}, {group.location.country}
                          </div>
                          <div className="mb-2">
                            <strong>Posts:</strong> {group.totalCount}
                          </div>
                          <div className="mb-2">
                            <strong>Intensity:</strong> {Math.round(intensity * 100)}%
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-green-600">😊 {group.sentimentCounts.positive}</span>
                            <span className="text-gray-600">😐 {group.sentimentCounts.neutral}</span>
                            <span className="text-red-600">😢 {group.sentimentCounts.negative}</span>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </>
            )}
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No data to display</p>
              <p className="text-sm">Upload a dataset or enable live feed to see the map visualization</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Legend */}
      <div className="mt-4 flex justify-between items-start">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-700 dark:text-gray-300">Positive</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-gray-700 dark:text-gray-300">Neutral</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-700 dark:text-gray-300">Negative</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Stats</div>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <div>{data.length} total posts</div>
            <div>{aggregatedData.length} locations</div>
            <div className="capitalize">{mapStyle} view</div>
          </div>
        </div>
      </div>
    </div>
  );
}