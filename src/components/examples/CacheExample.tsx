
import React, { useState, useEffect } from 'react';
import { memoryCache } from '@/lib/memoryCache';
import useMemoryCache from '@/hooks/useMemoryCache';
import { useConnectivity } from '@/hooks/useConnectivity';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, WifiOff, Wifi, Database, RefreshCw } from 'lucide-react';
import OfflineIndicator from '@/components/game-day/OfflineIndicator';

// Example data fetching function that simulates an API call
const fetchUserData = async () => {
  console.log('Fetching user data from API...');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    lastUpdated: new Date().toISOString()
  };
};

export const CacheExample: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState<string>('user-data');
  const { isOnline, pendingCount } = useConnectivity();
  
  // Use our cache hook with offline persistence enabled
  const { data, isLoading, error, refreshCache } = useMemoryCache(
    refreshKey,
    fetchUserData,
    { ttl: 30, persistOffline: true } // Cache for 30 seconds with offline persistence
  );
  
  // Force a refresh 
  const handleRefresh = () => {
    refreshCache();
  };
  
  // Clear the cache
  const handleClearCache = () => {
    memoryCache.clear();
    handleRefresh();
  };
  
  return (
    <div className="space-y-4">
      {!isOnline && (
        <OfflineIndicator itemCount={pendingCount} />
      )}
      
      <Card className="p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Memory Cache with Offline Support</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant={isOnline ? "default" : "destructive"} className="px-2 py-1">
              {isOnline ? (
                <><Wifi className="h-3 w-3 mr-1" /> Online</>
              ) : (
                <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
              )}
            </Badge>
            
            <Badge variant="outline" className="px-2 py-1">
              <Database className="h-3 w-3 mr-1" /> 
              {memoryCache.size} items cached
            </Badge>
          </div>
          
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Loading data...</p>
            </div>
          ) : error ? (
            <div className="text-red-500">
              Error loading data: {error.message}
            </div>
          ) : data ? (
            <div className="space-y-2">
              <p><strong>User ID:</strong> {data.id}</p>
              <p><strong>Name:</strong> {data.name}</p>
              <p><strong>Email:</strong> {data.email}</p>
              <p><strong>Last Updated:</strong> {new Date(data.lastUpdated).toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                Note: After fetching, this data will be cached for 30 seconds
                {!isOnline && " and persisted offline"}
              </p>
            </div>
          ) : (
            <p>No data available</p>
          )}
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleClearCache}
              disabled={isLoading}
            >
              Clear Cache
            </Button>
          </div>
          
          <div className="text-xs bg-gray-100 p-2 rounded">
            <p>Cache status: {memoryCache.size} items in cache</p>
            <p>Connection status: {isOnline ? 'Online' : 'Offline'}</p>
            <p>Pending sync items: {pendingCount}</p>
            
            <div className="mt-2 text-gray-500">
              <p>Try toggling your device's network connection to see how the cache handles offline mode.</p>
              <p>Data will persist even when the page is refreshed while offline.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CacheExample;
