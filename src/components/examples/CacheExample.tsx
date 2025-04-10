
import React, { useState } from 'react';
import { memoryCache } from '@/lib/memoryCache';
import useMemoryCache from '@/hooks/useMemoryCache';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
  
  // Use our cache hook
  const { data, isLoading, error } = useMemoryCache(
    refreshKey,
    fetchUserData,
    { ttlSeconds: 30 } // Cache for 30 seconds
  );
  
  // Force a refresh by changing the cache key
  const handleRefresh = () => {
    setRefreshKey(`user-data-${Date.now()}`);
  };
  
  // Clear the cache
  const handleClearCache = () => {
    memoryCache.clear();
    handleRefresh();
  };
  
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Memory Cache Example</h2>
      
      <div className="space-y-4">
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
            <p><strong>Last Updated:</strong> {data.lastUpdated}</p>
            <p className="text-xs text-gray-500">
              Note: After fetching, this data will be cached for 30 seconds
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
          >
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
          <p>Cache status: {memoryCache.size()} items in cache</p>
          <p>Has 'user-data' cached: {memoryCache.has('user-data') ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default CacheExample;
