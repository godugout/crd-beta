
import { useState, useEffect } from 'react';

interface ConnectivityState {
  isOnline: boolean;
  offlineSince: Date | null;
  lastSync: Date | null;
  connectionType: string | null;
  reconnectAttempts: number;
}

export const useConnectivity = () => {
  const [state, setState] = useState<ConnectivityState>({
    isOnline: navigator.onLine,
    offlineSince: navigator.onLine ? null : new Date(),
    lastSync: null,
    connectionType: null,
    reconnectAttempts: 0
  });
  
  // Get connection type if available in browser
  useEffect(() => {
    const connection = 
      'connection' in navigator 
        ? (navigator as any).connection || 
          (navigator as any).mozConnection || 
          (navigator as any).webkitConnection
        : null;
        
    if (connection) {
      setState(prev => ({
        ...prev,
        connectionType: connection.effectiveType || connection.type || null
      }));
      
      const handleConnectionChange = () => {
        setState(prev => ({
          ...prev,
          connectionType: connection.effectiveType || connection.type || null
        }));
      };
      
      connection.addEventListener('change', handleConnectionChange);
      return () => connection.removeEventListener('change', handleConnectionChange);
    }
  }, []);
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({
        ...prev,
        isOnline: true,
        lastSync: new Date(),
        reconnectAttempts: 0
      }));
    };
    
    const handleOffline = () => {
      setState(prev => ({
        ...prev,
        isOnline: false,
        offlineSince: new Date()
      }));
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Method to attempt manual reconnection
  const attemptReconnect = async (): Promise<boolean> => {
    if (state.isOnline) return true;
    
    try {
      // Try to fetch a small resource to check connectivity
      const response = await fetch('/api/ping', { 
        method: 'HEAD',
        cache: 'no-store'
      });
      
      const isConnected = response.ok;
      
      if (isConnected) {
        setState(prev => ({
          ...prev,
          isOnline: true,
          lastSync: new Date()
        }));
        return true;
      }
      
      setState(prev => ({
        ...prev, 
        reconnectAttempts: prev.reconnectAttempts + 1
      }));
      
      return false;
    } catch (error) {
      setState(prev => ({
        ...prev, 
        reconnectAttempts: prev.reconnectAttempts + 1
      }));
      
      return false;
    }
  };
  
  return {
    ...state,
    attemptReconnect
  };
};
