
import React, { useState } from 'react';
import { WifiOff, Upload, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { ConflictStrategy } from '@/lib/offline/offlineSyncService';

interface EnhancedOfflineIndicatorProps {
  className?: string;
  variant?: 'bar' | 'badge' | 'floating';
  showWhenOnline?: boolean;
  conflictStrategy?: ConflictStrategy;
}

/**
 * Enhanced offline indicator component with synchronization progress and controls
 */
const EnhancedOfflineIndicator: React.FC<EnhancedOfflineIndicatorProps> = ({
  className,
  variant = 'bar',
  showWhenOnline = false,
  conflictStrategy = 'client-wins'
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const {
    stats,
    isSyncing,
    isOnline,
    syncOfflineData,
    cancelSync
  } = useOfflineSync({
    conflictStrategy,
    autoSync: true,
    autoSyncInterval: 30000 // 30 seconds
  });

  // Don't show anything if online and not configured to show
  if (isOnline && !showWhenOnline && stats.pending === 0) {
    return null;
  }

  const syncProgress = isSyncing
    ? Math.min(Math.round((stats.synced / (stats.pending + stats.synced)) * 100), 99)
    : 0;

  // Handle different display variants
  switch (variant) {
    case 'badge':
      return (
        <>
          <div
            className={cn(
              "rounded-full p-1 px-3 text-xs flex items-center gap-1 cursor-pointer",
              isOnline
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-amber-50 text-amber-700 border border-amber-200",
              className
            )}
            onClick={() => setShowDetails(true)}
          >
            {isOnline ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            <span>
              {isOnline
                ? stats.pending > 0
                  ? `${stats.pending} item${stats.pending !== 1 ? 's' : ''} to sync`
                  : "Online"
                : `Offline${stats.pending > 0 ? ` (${stats.pending})` : ""}`}
            </span>
          </div>
          <SyncDetailsDialog
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            stats={stats}
            isOnline={isOnline}
            isSyncing={isSyncing}
            syncProgress={syncProgress}
            onSync={syncOfflineData}
            onCancel={cancelSync}
          />
        </>
      );

    case 'floating':
      if (isOnline && stats.pending === 0) return null;
      return (
        <>
          <div
            className={cn(
              "fixed bottom-4 right-4 z-50 shadow-lg rounded-lg p-3 cursor-pointer",
              isOnline
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-amber-50 text-amber-700 border border-amber-200",
              className
            )}
            onClick={() => setShowDetails(true)}
          >
            {isOnline ? (
              <>
                <Upload className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {stats.pending}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5" />
                {stats.pending > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {stats.pending}
                  </span>
                )}
              </>
            )}
          </div>
          <SyncDetailsDialog
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            stats={stats}
            isOnline={isOnline}
            isSyncing={isSyncing}
            syncProgress={syncProgress}
            onSync={syncOfflineData}
            onCancel={cancelSync}
          />
        </>
      );

    case 'bar':
    default:
      return (
        <>
          <div
            className={cn(
              "border-b p-2 text-sm flex items-center justify-between cursor-pointer",
              isOnline
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-amber-50 border-amber-200 text-amber-800",
              className
            )}
            onClick={() => setShowDetails(true)}
          >
            <div className="flex items-center">
              {isOnline ? (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              ) : (
                <WifiOff className="h-4 w-4 mr-2" />
              )}
              <span>
                {isOnline
                  ? stats.pending > 0
                    ? `Online - ${stats.pending} item${stats.pending !== 1 ? 's' : ''} pending synchronization`
                    : "Online - All data synchronized"
                  : `You're offline. ${
                      stats.pending > 0
                        ? `${stats.pending} item${stats.pending !== 1 ? 's' : ''} will sync when connection is restored.`
                        : ""
                    }`}
              </span>
            </div>

            {(isOnline && stats.pending > 0) && (
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "text-xs h-7",
                  "bg-green-100 border-green-200 text-green-800 hover:bg-green-200 hover:text-green-900"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  syncOfflineData();
                }}
                disabled={isSyncing}
              >
                <Upload className="h-3 w-3 mr-1" />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            )}
          </div>
          <SyncDetailsDialog
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            stats={stats}
            isOnline={isOnline}
            isSyncing={isSyncing}
            syncProgress={syncProgress}
            onSync={syncOfflineData}
            onCancel={cancelSync}
          />
        </>
      );
  }
};

// Dialog component for displaying sync details and controls
interface SyncDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    pending: number;
    synced: number;
    failed: number;
    conflicts: number;
    lastSyncAt: Date | null;
  };
  isOnline: boolean;
  isSyncing: boolean;
  syncProgress: number;
  onSync: () => void;
  onCancel: () => void;
}

const SyncDetailsDialog: React.FC<SyncDetailsDialogProps> = ({
  isOpen,
  onClose,
  stats,
  isOnline,
  isSyncing,
  syncProgress,
  onSync,
  onCancel
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {isOnline ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                Connection Status: Online
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-amber-600 mr-2" />
                Connection Status: Offline
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Manage offline data and synchronization
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-md p-3">
              <div className="text-sm font-medium mb-1">Pending</div>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </div>
            <div className="bg-muted rounded-md p-3">
              <div className="text-sm font-medium mb-1">Last Synced</div>
              <div className="text-xs">
                {stats.lastSyncAt 
                  ? new Date(stats.lastSyncAt).toLocaleString()
                  : 'Never'
                }
              </div>
            </div>
            <div className="bg-muted rounded-md p-3">
              <div className="text-sm font-medium mb-1">Successfully Synced</div>
              <div className="text-2xl font-bold text-green-600">{stats.synced}</div>
            </div>
            <div className="bg-muted rounded-md p-3">
              <div className="text-sm font-medium mb-1">Issues</div>
              <div className="text-2xl font-bold text-red-600">{stats.failed + stats.conflicts}</div>
            </div>
          </div>
          
          {isSyncing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sync in progress...</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            {isSyncing ? (
              <Button variant="outline" onClick={onCancel}>
                <XCircle className="h-4 w-4 mr-1" />
                Cancel Sync
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button 
                  onClick={onSync} 
                  disabled={!isOnline || stats.pending === 0}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Sync Now
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedOfflineIndicator;
