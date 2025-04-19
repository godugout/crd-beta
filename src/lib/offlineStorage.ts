
export interface OfflineItem {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
}

// Mock implementation of offline storage functions
const offlineItems: OfflineItem[] = [];

export const getOfflineItems = async (): Promise<OfflineItem[]> => {
  return [...offlineItems];
};

export const saveOfflineItem = async (item: Omit<OfflineItem, 'id' | 'timestamp'>): Promise<string> => {
  const id = `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const timestamp = Date.now();
  const newItem: OfflineItem = {
    ...item,
    id,
    timestamp,
    syncStatus: 'pending'
  };
  offlineItems.push(newItem);
  return id;
};

export const removeOfflineItem = async (itemId: string): Promise<void> => {
  const index = offlineItems.findIndex(item => item.id === itemId);
  if (index !== -1) {
    offlineItems.splice(index, 1);
  }
};

export const getPendingItemCount = async (): Promise<number> => {
  return offlineItems.filter(item => item.syncStatus === 'pending').length;
};
