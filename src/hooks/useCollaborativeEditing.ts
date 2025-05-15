
import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/lib/utils/toast';

// Define types for collaborative editing
interface CollaboratorCursor {
  x: number;
  y: number;
  lastUpdated: number;
}

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursor?: CollaboratorCursor;
  selection?: any;
  lastActive: number;
}

interface CollaborationState<T> {
  documentId: string;
  version: number;
  lastModified: number;
  data: T;
  collaborators: Record<string, Collaborator>;
}

interface CollaborationOptions<T> {
  documentId?: string;
  initialData: T;
  username?: string;
  userColor?: string;
  onChange?: (data: T) => void;
  presenceTimeout?: number;
  debug?: boolean;
}

// Mock WebSocket for demo purposes. In a real implementation, this would be a real WebSocket connection.
class MockWebSocketConnection<T> {
  private listeners: Record<string, ((data: any) => void)[]> = {};
  private state: CollaborationState<T>;
  private userId: string;
  private mockCollaborators: Collaborator[] = [];
  private isConnected = false;
  
  constructor(documentId: string, initialData: T, userId: string) {
    this.state = {
      documentId,
      version: 1,
      lastModified: Date.now(),
      data: initialData,
      collaborators: {}
    };
    this.userId = userId;
    
    // Simulate some collaborators
    this.mockCollaborators = [
      { id: 'user1', name: 'John Doe', color: '#3B82F6', lastActive: Date.now() },
      { id: 'user2', name: 'Jane Smith', color: '#10B981', lastActive: Date.now() },
    ].filter(c => c.id !== userId);
    
    // Connect after a short delay
    setTimeout(() => {
      this.isConnected = true;
      this.emit('connected', { userId });
      this.simulateCollaboratorActivity();
    }, 1000);
  }
  
  addEventListener(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  removeEventListener(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }
  
  emit(event: string, data: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
  
  sendUpdate(data: T) {
    if (!this.isConnected) return;
    
    // Simulate network delay
    setTimeout(() => {
      this.state.data = data;
      this.state.version += 1;
      this.state.lastModified = Date.now();
      
      this.emit('document_updated', {
        documentId: this.state.documentId,
        version: this.state.version,
        data,
        userId: this.userId
      });
    }, 100);
  }
  
  updateCursor(position: { x: number, y: number }) {
    if (!this.isConnected) return;
    
    // Simulate cursor update
    setTimeout(() => {
      this.emit('cursor_moved', {
        userId: this.userId,
        position,
        timestamp: Date.now()
      });
    }, 50);
  }
  
  disconnect() {
    this.isConnected = false;
    this.emit('disconnected', { userId: this.userId });
  }
  
  private simulateCollaboratorActivity() {
    // Simulate other users' activity
    this.mockCollaborators.forEach(collab => {
      // Add collaborator to state
      this.state.collaborators[collab.id] = collab;
      
      // Notify of their presence
      this.emit('collaborator_joined', {
        userId: collab.id,
        name: collab.name,
        color: collab.color
      });
      
      // Simulate cursor movement
      setInterval(() => {
        if (!this.isConnected) return;
        
        const cursor = {
          x: Math.floor(Math.random() * 500),
          y: Math.floor(Math.random() * 700),
          lastUpdated: Date.now()
        };
        
        this.emit('cursor_moved', {
          userId: collab.id,
          position: cursor,
          timestamp: Date.now()
        });
      }, 3000 + Math.random() * 5000);  // Random interval between 3-8 seconds
    });
  }
}

// Main hook for collaborative editing
export function useCollaborativeEditing<T>({
  documentId = uuidv4(),
  initialData,
  username = 'Anonymous',
  userColor = '#F59E0B',
  onChange,
  presenceTimeout = 30000, // 30 seconds
  debug = false
}: CollaborationOptions<T>) {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<T>(initialData);
  const [version, setVersion] = useState(1);
  const [collaborators, setCollaborators] = useState<Record<string, Collaborator>>({});
  const [userId] = useState(uuidv4());
  
  // Store connection in a ref
  const connectionRef = useRef<MockWebSocketConnection<T> | null>(null);
  
  // Store current data in ref to avoid stale closures
  const dataRef = useRef<T>(initialData);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);
  
  // Function to log debug messages
  const logDebug = useCallback((message: string, ...args: any[]) => {
    if (debug) {
      console.log(`[Collab] ${message}`, ...args);
    }
  }, [debug]);
  
  // Update data without triggering collaborative sync
  const setLocalData = useCallback((newData: T) => {
    setData(newData);
    if (onChange) {
      onChange(newData);
    }
  }, [onChange]);
  
  // Send data updates to collaborators
  const updateData = useCallback((newData: T) => {
    setLocalData(newData);
    connectionRef.current?.sendUpdate(newData);
    logDebug('Sent data update', newData);
  }, [setLocalData, logDebug]);
  
  // Update cursor position
  const updateCursorPosition = useCallback((x: number, y: number) => {
    connectionRef.current?.updateCursor({ x, y });
  }, []);
  
  // Initialize connection
  useEffect(() => {
    const connection = new MockWebSocketConnection<T>(documentId, initialData, userId);
    connectionRef.current = connection;
    
    // Handle connection events
    const handleConnect = (data: { userId: string }) => {
      setIsConnected(true);
      logDebug('Connected', data);
      toast({
        title: "Collaboration active",
        description: "You are now editing collaboratively",
        variant: "success"
      });
    };
    
    const handleDisconnect = () => {
      setIsConnected(false);
      logDebug('Disconnected');
      toast({
        title: "Disconnected",
        description: "Collaboration session ended",
        variant: "warning"
      });
    };
    
    const handleDocumentUpdated = (event: { 
      documentId: string;
      version: number;
      data: T;
      userId: string;
    }) => {
      if (event.userId !== userId && event.version > version) {
        setVersion(event.version);
        setLocalData(event.data);
        logDebug('Document updated by another user', event);
      }
    };
    
    const handleCollaboratorJoined = (event: {
      userId: string;
      name: string;
      color: string;
    }) => {
      setCollaborators(prev => ({
        ...prev,
        [event.userId]: {
          id: event.userId,
          name: event.name,
          color: event.color,
          lastActive: Date.now()
        }
      }));
      logDebug('Collaborator joined', event);
      toast({
        title: "Collaborator joined",
        description: `${event.name} is now editing`
      });
    };
    
    const handleCollaboratorLeft = (event: { userId: string }) => {
      setCollaborators(prev => {
        const newState = { ...prev };
        delete newState[event.userId];
        return newState;
      });
      logDebug('Collaborator left', event);
      const collaborator = collaborators[event.userId];
      if (collaborator) {
        toast({
          title: "Collaborator left",
          description: `${collaborator.name} has left`
        });
      }
    };
    
    const handleCursorMoved = (event: {
      userId: string;
      position: { x: number; y: number };
      timestamp: number;
    }) => {
      if (event.userId === userId) return;
      
      setCollaborators(prev => {
        const collaborator = prev[event.userId];
        if (!collaborator) return prev;
        
        return {
          ...prev,
          [event.userId]: {
            ...collaborator,
            cursor: {
              x: event.position.x,
              y: event.position.y,
              lastUpdated: event.timestamp
            },
            lastActive: event.timestamp
          }
        };
      });
      logDebug('Cursor moved', event);
    };
    
    // Add event listeners
    connection.addEventListener('connected', handleConnect);
    connection.addEventListener('disconnected', handleDisconnect);
    connection.addEventListener('document_updated', handleDocumentUpdated);
    connection.addEventListener('collaborator_joined', handleCollaboratorJoined);
    connection.addEventListener('collaborator_left', handleCollaboratorLeft);
    connection.addEventListener('cursor_moved', handleCursorMoved);
    
    // Clean up on unmount
    return () => {
      connection.disconnect();
      connection.removeEventListener('connected', handleConnect);
      connection.removeEventListener('disconnected', handleDisconnect);
      connection.removeEventListener('document_updated', handleDocumentUpdated);
      connection.removeEventListener('collaborator_joined', handleCollaboratorJoined);
      connection.removeEventListener('collaborator_left', handleCollaboratorLeft);
      connection.removeEventListener('cursor_moved', handleCursorMoved);
    };
  }, [documentId, initialData, userId, version, logDebug, collaborators, setLocalData]);
  
  // Clean up inactive collaborators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCollaborators(prev => {
        const newState = { ...prev };
        let changed = false;
        
        Object.keys(newState).forEach(id => {
          if (now - newState[id].lastActive > presenceTimeout) {
            delete newState[id];
            changed = true;
            logDebug('Removing inactive collaborator', id);
          }
        });
        
        return changed ? newState : prev;
      });
    }, presenceTimeout / 2);
    
    return () => clearInterval(interval);
  }, [presenceTimeout, logDebug]);
  
  // Return the collaborative state and methods
  return {
    data,
    setData: updateData,
    isConnected,
    collaborators,
    documentId,
    version,
    updateCursorPosition,
    userId,
    username,
    userColor
  };
}
