
import { useState, useEffect, useCallback, useRef } from 'react';

export interface AutoSaveOptions<T> {
  data: T;
  key: string; // Storage key
  saveInterval?: number; // Autosave interval in ms
  storageType?: 'localStorage' | 'sessionStorage';
  onSave?: (data: T) => Promise<void>; // Optional custom save handler
}

export interface AutoSaveResult {
  save: () => Promise<void>;
  triggerDebouncedSave: () => void;
  hasChanges: boolean;
  isSaving: boolean;
  isAutoSaveEnabled: boolean;
  lastSaved: number; // Timestamp of last save
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

/**
 * Hook for automatically saving data at regular intervals
 */
export function useAutoSave<T>({
  data,
  key,
  saveInterval = 30000, // Default to 30 seconds
  storageType = 'localStorage',
  onSave
}: AutoSaveOptions<T>): AutoSaveResult {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isAutoSaveEnabled] = useState(saveInterval > 0);
  
  const dataRef = useRef<T>(data);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update ref when data changes
  useEffect(() => {
    const hasDataChanged = JSON.stringify(dataRef.current) !== JSON.stringify(data);
    if (hasDataChanged) {
      dataRef.current = data;
      setHasChanges(true);
    }
  }, [data]);

  // Save function
  const save = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      if (onSave) {
        // Use custom save function if provided
        await onSave(dataRef.current);
      } else {
        // Default storage implementation
        const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
        storage.setItem(key, JSON.stringify(dataRef.current));
      }
      
      setLastSaved(Date.now());
      setHasChanges(false);
      setSaveStatus('saved');
    } catch (error) {
      console.error('AutoSave error:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, key, onSave, storageType]);

  // Debounced save trigger
  const triggerDebouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (hasChanges) {
        save();
      }
    }, 1000); // 1 second debounce
  }, [hasChanges, save]);

  // Set up autosave interval
  useEffect(() => {
    if (!isAutoSaveEnabled) return;
    
    const interval = setInterval(() => {
      if (hasChanges) {
        save();
      }
    }, saveInterval);
    
    return () => clearInterval(interval);
  }, [hasChanges, save, saveInterval, isAutoSaveEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    save,
    triggerDebouncedSave,
    hasChanges,
    isSaving,
    isAutoSaveEnabled,
    lastSaved,
    saveStatus
  };
}
