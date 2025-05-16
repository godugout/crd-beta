
import { useState, useEffect } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  offlineSince: Date;
  lastSync: Date;
  connectionType: string;
  reconnectAttempts: number;
  pendingCount: number;
  attemptReconnect: () => Promise<boolean>;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineSince, setOfflineSince] = useState<Date>(new Date());
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineSince(new Date());
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Get connection type if available
    if ('connection' in navigator) {
      const nav = navigator as any;
      if (nav.connection) {
        setConnectionType(nav.connection.effectiveType || 'unknown');
        
        const handleConnectionChange = () => {
          setConnectionType(nav.connection.effectiveType || 'unknown');
        };
        
        nav.connection.addEventListener('change', handleConnectionChange);
        
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
          nav.connection.removeEventListener('change', handleConnectionChange);
        };
      }
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Mock pending operations for demo purposes
  useEffect(() => {
    if (!isOnline) {
      const timer = setInterval(() => {
        setPendingCount(count => count + Math.floor(Math.random() * 2));
      }, 10000);
      
      return () => clearInterval(timer);
    } else {
      setPendingCount(0);
    }
  }, [isOnline]);
  
  const attemptReconnect = async (): Promise<boolean> => {
    setReconnectAttempts(prev => prev + 1);
    
    try {
      const response = await fetch('/api/ping', { 
        method: 'GET',
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      const success = response.ok;
      
      if (success) {
        setIsOnline(true);
        setLastSync(new Date());
        setPendingCount(0);
      }
      
      return success;
    } catch (error) {
      console.error('Reconnection attempt failed:', error);
      return false;
    }
  };
  
  return {
    isOnline,
    offlineSince,
    lastSync,
    connectionType,
    reconnectAttempts,
    pendingCount,
    attemptReconnect
  };
};

export default useNetworkStatus;
