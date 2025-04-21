
import { getOfflineItems, removeOfflineItem } from '@/lib/offlineStorage';

// A simple sync service that handles offline data synchronization
export async function syncAllData() {
  try {
    // Get all pending items
    const pendingItems = await getOfflineItems();
    const itemsToSync = pendingItems.filter(item => item.syncStatus === 'pending');
    
    if (itemsToSync.length === 0) {
      return 0;
    }
    
    console.log(`Syncing ${itemsToSync.length} pending items...`);
    
    let syncedCount = 0;
    
    // Process items in batches
    const batchSize = 5;
    for (let i = 0; i < itemsToSync.length; i += batchSize) {
      const batch = itemsToSync.slice(i, i + batchSize);
      
      // Process each item in the batch
      await Promise.all(batch.map(async (item) => {
        try {
          // In a real implementation, this would send the data to a server
          // For now, just simulate a network request
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Remove the item from offline storage after successful sync
          await removeOfflineItem(item.id);
          syncedCount++;
        } catch (error) {
          console.error(`Error syncing item ${item.id}:`, error);
        }
      }));
    }
    
    console.log(`Successfully synced ${syncedCount} items`);
    return syncedCount;
  } catch (error) {
    console.error('Error syncing data:', error);
    return 0;
  }
}
