
import { useConnectivity } from './useConnectivity';
import { useSaveOfflineData } from './offline/useSaveOfflineData';
import { useFileUpload } from './offline/useFileUpload';
import { useOfflineSync } from './offline/useOfflineSync';

export interface UseOfflineStorageOptions {
  onSyncComplete?: (results: { success: boolean; syncedCount: number }) => void;
  autoSync?: boolean;
}

export function useOfflineStorage(options?: UseOfflineStorageOptions) {
  const { isOnline, pendingCount } = useConnectivity();
  const { saveData, isSaving } = useSaveOfflineData();
  const { uploadFile } = useFileUpload();
  const { 
    isSyncing, 
    lastSyncResult, 
    syncData, 
    getOfflineData, 
    deleteOfflineItem 
  } = useOfflineSync(options);

  return {
    // Status
    isOnline,
    isSaving,
    isSyncing,
    pendingCount,
    lastSyncResult,
    
    // Functions
    saveData,
    uploadFile,
    syncData,
    getOfflineData,
    deleteOfflineItem
  };
}

export default useOfflineStorage;
