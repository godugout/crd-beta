
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { syncAllData } from '@/lib/syncService';
import { getOfflineItems } from '@/lib/offlineStorage';

export const useConnectivity = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are back online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline - data will be saved locally');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add the syncOfflineItems function that is being used
  const syncOfflineItems = async () => {
    if (!isOnline || isSyncing) return 0;
    
    setIsSyncing(true);
    try {
      const syncCount = await syncAllData();
      setPendingCount(prevCount => Math.max(0, prevCount - syncCount));
      return syncCount;
    } catch (error) {
      console.error("Error syncing offline items:", error);
      return 0;
    } finally {
      setIsSyncing(false);
    }
  };

  // Update the pending count periodically
  useEffect(() => {
    const updatePendingCount = async () => {
      try {
        // Get actual pending count from storage
        const items = await getOfflineItems();
        const count = items.filter(item => item.syncStatus === 'pending').length;
        setPendingCount(count);
      } catch (error) {
        console.error("Error updating pending count:", error);
      }
    };
    
    // Initial update
    updatePendingCount();
    
    // Set interval for updates
    const interval = setInterval(updatePendingCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { isOnline, pendingCount, syncOfflineItems, isSyncing };
};

export default useConnectivity;
