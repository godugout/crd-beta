
import { useState, useEffect, useCallback } from 'react';

interface AutoSaveOptions<T> {
  data: T;
  key: string;
  saveInterval?: number; // in milliseconds
  onSave?: (data: T) => Promise<void> | void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAutoSave<T>({
  data,
  key,
  saveInterval = 30000, // default: 30 seconds
  onSave
}: AutoSaveOptions<T>) {
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Save data to localStorage and optionally call the onSave callback
  const saveData = useCallback(async () => {
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      
      // First save to localStorage
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      // Then call onSave callback if provided
      if (onSave) {
        await onSave(data);
      }
      
      setLastSaved(Date.now());
      setSaveStatus('saved');
      setError(null);
    } catch (err) {
      console.error('Error auto-saving data:', err);
      setSaveStatus('error');
      setError(err instanceof Error ? err : new Error('Unknown error during autosave'));
    } finally {
      setIsSaving(false);
    }
  }, [data, key, onSave]);
  
  // Load data from localStorage on initial mount
  useEffect(() => {
    try {
      const savedItem = localStorage.getItem(key);
      if (savedItem) {
        const { timestamp } = JSON.parse(savedItem);
        setLastSaved(timestamp);
      }
    } catch (err) {
      console.error('Error loading saved data:', err);
    }
  }, [key]);
  
  // Set up interval for auto-saving
  useEffect(() => {
    const interval = setInterval(() => {
      saveData();
    }, saveInterval);
    
    return () => clearInterval(interval);
  }, [saveData, saveInterval]);
  
  // Save on unmount
  useEffect(() => {
    return () => {
      saveData();
    };
  }, [saveData]);
  
  // Manual save function that can be called from components
  const save = useCallback(async () => {
    await saveData();
  }, [saveData]);

  return {
    lastSaved,
    save,
    isSaving,
    saveStatus,
    error
  };
}

export default useAutoSave;
