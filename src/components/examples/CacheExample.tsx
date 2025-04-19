
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useConnectivity } from '@/hooks/useConnectivity';

interface CacheExampleProps {
  title?: string;
}

const CacheExample: React.FC<CacheExampleProps> = ({ title = 'Cache Example' }) => {
  const { isOnline, pendingCount, syncOfflineItems } = useConnectivity();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];
      
      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      
      <div className="flex items-center gap-2 mb-4">
        <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{isOnline ? 'Online' : 'Offline'}</span>
        
        {pendingCount > 0 && (
          <span className="ml-2 px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
            {pendingCount} pending
          </span>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-2">
          {data.map(item => (
            <div key={item.id} className="p-2 border rounded">
              {item.name}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex gap-2">
        <Button onClick={fetchData} disabled={isLoading}>
          Refresh Data
        </Button>
        
        {pendingCount > 0 && (
          <Button onClick={syncOfflineItems} variant="outline">
            Sync Pending ({pendingCount})
          </Button>
        )}
      </div>
    </div>
  );
};

export default CacheExample;
