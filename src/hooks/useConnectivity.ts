
import { useState, useEffect } from 'react';

interface ConnectivityState {
  isOnline: boolean;
  offlineSince: Date | null;
  reconnected: boolean;
  lastChecked: Date;
}

export function useConnectivity() {
  const [state, setState] = useState<ConnectivityState>({
    isOnline: navigator.onLine,
    offlineSince: null,
    reconnected: false,
    lastChecked: new Date()
  });

  // Check active connection status using fetch API
  const checkConnection = async () => {
    try {
      // Random query param to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/ping?_=${timestamp}`, {
        method: 'HEAD',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
        // Short timeout to detect poor connections
        signal: AbortSignal.timeout(3000)
      });
      
      if (response.ok) {
        setState(prev => ({
          isOnline: true,
          offlineSince: prev.isOnline ? null : prev.offlineSince,
          reconnected: !prev.isOnline,
          lastChecked: new Date()
        }));
      } else {
        handleOfflineState();
      }
    } catch (error) {
      handleOfflineState();
    }
  };

  const handleOfflineState = () => {
    setState(prev => ({
      isOnline: false,
      offlineSince: prev.offlineSince || new Date(),
      reconnected: false,
      lastChecked: new Date()
    }));
  };

  useEffect(() => {
    // Initial check
    checkConnection();
    
    // Browser online/offline events
    const handleOnline = () => {
      checkConnection(); // Verify actual connection with fetch
    };
    
    const handleOffline = () => {
      handleOfflineState();
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set up periodic checking (less frequent to save battery)
    const intervalId = setInterval(checkConnection, 30000);
    
    // Check on tab visibility change (user returns to app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkConnection();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);

  return {
    isOnline: state.isOnline,
    offlineSince: state.offlineSince,
    reconnected: state.reconnected,
    lastChecked: state.lastChecked
  };
}
