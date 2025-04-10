
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

// Configure the main storage instance
const offlineStorage = localforage.createInstance({
  name: 'OakFanMediaStorage',
  storeName: 'media'
});

// Storage for pending uploads
const uploadsStorage = localforage.createInstance({
  name: 'OakFanMediaStorage',
  storeName: 'pending-uploads'
});

// Storage for pending memory records
const memoriesStorage = localforage.createInstance({
  name: 'OakFanMediaStorage',
  storeName: 'pending-memories'
});

export interface PendingUpload {
  id: string;
  file: File;
  memoryId: string;
  userId: string;
  metadata: Record<string, any>;
  createdAt: number;
  isPrivate: boolean;
  syncPriority?: number;
}

export interface OfflineItem {
  id: string;
  collectionName?: string;
  data: Record<string, any>;
  createdAt: string;
  syncStatus: 'pending' | 'syncing' | 'error';
  syncPriority?: number;
  errorDetails?: string;
  retryCount?: number;
  title?: string;
  description?: string | null;
  imageUrl?: string;
  tags?: string[];
}

/**
 * Save a file for offline upload when connectivity is restored
 */
export const saveForOfflineUpload = async (
  file: File,
  memoryId: string,
  userId: string,
  metadata: Record<string, any> = {},
  isPrivate = false,
  syncPriority = 1
): Promise<string> => {
  const id = uuidv4();
  const pendingUpload: PendingUpload = {
    id,
    file,
    memoryId,
    userId,
    metadata,
    createdAt: Date.now(),
    isPrivate,
    syncPriority
  };
  
  await uploadsStorage.setItem(`upload-${id}`, pendingUpload);
  return id;
};

/**
 * Get all pending uploads
 */
export const getPendingUploads = async (): Promise<PendingUpload[]> => {
  const keys = await uploadsStorage.keys();
  const pendingKeys = keys.filter(k => k.startsWith('upload-'));
  const uploads: PendingUpload[] = [];
  
  for (const key of pendingKeys) {
    const item = await uploadsStorage.getItem<PendingUpload>(key);
    if (item) uploads.push(item);
  }
  
  return uploads.sort((a, b) => a.createdAt - b.createdAt);
};

/**
 * Alias for getPendingUploads used by SyncService
 */
export const getPendingUploadItems = getPendingUploads;

/**
 * Remove a pending upload by ID
 */
export const removePendingUpload = async (id: string) => {
  await uploadsStorage.removeItem(`upload-${id}`);
};

/**
 * Save a memory item for offline sync
 */
export const saveOfflineItem = async (item: OfflineItem): Promise<string> => {
  const id = item.id || uuidv4();
  const itemToSave = {
    ...item,
    id,
    syncStatus: item.syncStatus || 'pending',
    syncPriority: item.syncPriority || 1,
    createdAt: item.createdAt || new Date().toISOString(),
    retryCount: item.retryCount || 0
  };
  
  await memoriesStorage.setItem(`item-${id}`, itemToSave);
  return id;
};

/**
 * Get all offline items
 */
export const getOfflineItems = async (): Promise<OfflineItem[]> => {
  const keys = await memoriesStorage.keys();
  const itemKeys = keys.filter(k => k.startsWith('item-'));
  const items: OfflineItem[] = [];
  
  for (const key of itemKeys) {
    const item = await memoriesStorage.getItem<OfflineItem>(key);
    if (item) items.push(item);
  }
  
  // Sort by priority (higher first) then by creation date (newer first)
  return items.sort((a, b) => {
    const priorityDiff = (b.syncPriority || 0) - (a.syncPriority || 0);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

/**
 * Remove an offline item by ID
 */
export const removeOfflineItem = async (id: string) => {
  await memoriesStorage.removeItem(`item-${id}`);
};

/**
 * Update the sync status of an offline item
 */
export const updateOfflineItemStatus = async (
  id: string, 
  status: 'pending' | 'syncing' | 'error',
  errorDetails?: string
) => {
  const key = `item-${id}`;
  const item = await memoriesStorage.getItem<OfflineItem>(key);
  
  if (item) {
    const updatedItem = { 
      ...item, 
      syncStatus: status,
      errorDetails: status === 'error' ? (errorDetails || 'Unknown error') : undefined,
      retryCount: status === 'error' ? (item.retryCount || 0) + 1 : item.retryCount
    };
    
    await memoriesStorage.setItem(key, updatedItem);
    return updatedItem;
  }
  
  return null;
};

/**
 * Store a blob in offline storage
 */
export const storeBlob = async (key: string, blob: Blob): Promise<string> => {
  await offlineStorage.setItem(key, blob);
  return key;
};

/**
 * Retrieve a blob from offline storage
 */
export const getBlob = async (key: string): Promise<Blob | null> => {
  return await offlineStorage.getItem<Blob>(key);
};

/**
 * Store file as dataURL for offline access
 */
export const storeFileAsDataUrl = async (key: string, file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result.toString();
        await offlineStorage.setItem(key, dataUrl);
        resolve(key);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Get the number of pending offline items
 */
export const getPendingItemCount = async (): Promise<number> => {
  const [uploads, items] = await Promise.all([
    getPendingUploads(),
    getOfflineItems()
  ]);
  return uploads.length + items.length;
};

/**
 * Clear all offline storage
 */
export const clearOfflineStorage = async (): Promise<void> => {
  await Promise.all([
    offlineStorage.clear(),
    uploadsStorage.clear(),
    memoriesStorage.clear()
  ]);
};

export default {
  saveForOfflineUpload,
  getPendingUploads,
  removePendingUpload,
  saveOfflineItem,
  getOfflineItems,
  removeOfflineItem,
  updateOfflineItemStatus,
  storeBlob,
  getBlob,
  storeFileAsDataUrl,
  getPendingItemCount,
  clearOfflineStorage
};
