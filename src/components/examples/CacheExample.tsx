import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, CloudOff, RefreshCw } from 'lucide-react';

const CacheExample: React.FC = () => {
  const networkStatus = useNetworkStatus();
  const pendingCount = 0; // Placeholder since pendingCount doesn't exist in the type

  const handleReconnect = async () => {
    try {
      const success = await networkStatus.attemptReconnect();
      if (success) {
        console.log('Reconnected successfully');
      } else {
        console.log('Failed to reconnect');
      }
    } catch (error) {
      console.error('Error reconnecting:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Network Status
          {networkStatus.isOnline ? (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <CheckCircle className="h-4 w-4 mr-1" /> Online
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-700">
              <CloudOff className="h-4 w-4 mr-1" /> Offline
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Connection Type</p>
            <p className="text-sm">{networkStatus.connectionType || 'Unknown'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Offline Since</p>
            <p className="text-sm">
              {!networkStatus.isOnline && networkStatus.offlineSince
                ? new Date(networkStatus.offlineSince).toLocaleTimeString()
                : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Last Sync</p>
            <p className="text-sm">
              {networkStatus.lastSync
                ? new Date(networkStatus.lastSync).toLocaleTimeString()
                : 'Never'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Reconnect Attempts</p>
            <p className="text-sm">{networkStatus.reconnectAttempts}</p>
          </div>
        </div>

        {!networkStatus.isOnline && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Working Offline</h4>
              <p className="text-xs text-amber-700 mt-1">
                Changes will be synchronized when your connection is restored.
              </p>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleReconnect}
          disabled={networkStatus.isOnline}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {networkStatus.isOnline ? 'Connected' : 'Attempt Reconnect'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CacheExample;
