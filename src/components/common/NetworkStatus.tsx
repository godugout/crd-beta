import React, { useEffect, useState } from 'react';
import { useConnectivity } from '@/hooks/useConnectivity';
import { WifiOff, Upload, Wifi, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SyncOptions } from '@/lib/syncService';

interface NetworkStatusProps {
  className?: string;
  showControls?: boolean;
  showStatus?: boolean;
  variant?: 'full' | 'badge' | 'minimal';
  onSync?: () => void;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({
  className = '',
  showControls = true,
  showStatus = true,
  variant = 'full',
  onSync
}) => {
  const { 
    isOnline, 
    pendingCount, 
    isSyncing, 
    syncOfflineItems, 
    cancelSync 
  } = useConnectivity();
  
  const [syncProgress, setSyncProgress] = useState(0);
  
  // Reset progress when syncing stops
  useEffect(() => {
    if (!isSyncing) {
      setSyncProgress(0);
    }
  }, [isSyncing]);
  
  const handleSync = async () => {
    // Call the onSync callback if provided
    if (onSync) {
      onSync();
    }
    
    await syncOfflineItems({
      progressCallback: (current, total) => {
        setSyncProgress(Math.round((current / total) * 100));
      }
    });
  };
  
  if (variant === 'badge') {
    return (
      <Badge 
        variant={isOnline ? "default" : "destructive"} 
        className={`px-2 py-1 ${className}`}
      >
        {isOnline ? (
          <><Wifi className="h-3 w-3 mr-1" /> Online</>
        ) : (
          <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
        )}
        {!isOnline && pendingCount > 0 && (
          <span className="ml-1">({pendingCount})</span>
        )}
      </Badge>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center text-sm ${className}`}>
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <WifiOff className="h-4 w-4 text-amber-500 mr-1" />
        )}
        {pendingCount > 0 && (
          <Badge variant="outline" className="ml-2">
            {pendingCount} pending
          </Badge>
        )}
      </div>
    );
  }

  // Full variant default
  if (!showStatus && pendingCount === 0 && isOnline) {
    return null;
  }
  
  return (
    <div className={`${className} ${isOnline ? 'bg-green-50' : 'bg-amber-50'} border-b 
      ${isOnline ? 'border-green-200' : 'border-amber-200'} p-2 text-sm 
      ${isOnline ? 'text-green-800' : 'text-amber-800'} flex items-center justify-between`}
    >
      <div className="flex items-center">
        {isOnline ? (
          <Wifi className="h-4 w-4 mr-2" />
        ) : (
          <WifiOff className="h-4 w-4 mr-2" />
        )}
        <span>
          {isOnline ? 'You\'re online.' : 'You\'re offline.'}
          {pendingCount > 0 && (
            <span> {pendingCount} item{pendingCount !== 1 ? 's' : ''} will sync when connection is restored.</span>
          )}
        </span>
      </div>
      
      {showControls && pendingCount > 0 && isOnline && (
        <div className="flex items-center space-x-2">
          {isSyncing && syncProgress > 0 && (
            <div className="w-24 mr-2">
              <Progress value={syncProgress} />
            </div>
          )}
          
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-7 bg-green-100 border-green-200 text-green-800 hover:bg-green-200 hover:text-green-900"
            onClick={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <RefreshCcw className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Upload className="h-3 w-3 mr-1" />
            )}
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
          
          {isSyncing && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-xs h-7 text-amber-800"
              onClick={cancelSync}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
