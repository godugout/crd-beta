
import { OfflineItem, getOfflineItems, removeOfflineItem } from './offlineStorage';

export interface SyncOptions {
  notify?: boolean;
  continueOnError?: boolean;
  batchSize?: number;
}

let isSyncCancelled = false;

export const syncAllData = async (options: SyncOptions = {}): Promise<number> => {
  const { continueOnError = true, batchSize = 10 } = options;
  
  isSyncCancelled = false;
  const offlineItems = await getOfflineItems();
  let syncedCount = 0;
  
  for (const item of offlineItems) {
    if (isSyncCancelled) break;
    
    try {
      // Mock sync process
      await new Promise(resolve => setTimeout(resolve, 500));
      await removeOfflineItem(item.id);
      syncedCount++;
    } catch (error) {
      console.error(`Failed to sync item ${item.id}:`, error);
      if (!continueOnError) {
        break;
      }
    }
  }
  
  return syncedCount;
};

export const cancelSync = (): void => {
  isSyncCancelled = true;
};
