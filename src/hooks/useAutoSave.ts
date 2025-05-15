
import { useState, useEffect, useRef } from 'react';

interface AutoSaveOptions<T> {
  data: T;
  key: string;
  saveInterval?: number; // in milliseconds
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAutoSave<T>({ data, key, saveInterval = 60000 }: AutoSaveOptions<T>) {
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const isSaving = saveStatus === 'saving';
  
  // Save data to localStorage
  const saveData = async () => {
    if (isSaving) return;
    
    setSaveStatus('saving');
    
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Save to localStorage
      localStorage.setItem(key, JSON.stringify(data));
      
      // Update state
      setLastSaved(Date.now());
      setSaveStatus('saved');
      setError(null);
    } catch (err) {
      setSaveStatus('error');
      setError(err as Error);
      console.error('Failed to save data:', err);
    }
  };
  
  // Schedule auto-save
  const scheduleAutoSave = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      saveData();
    }, saveInterval);
  };
  
  // Set up auto-save when data changes
  useEffect(() => {
    scheduleAutoSave();
    
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveInterval]);
  
  // Load data on initial render
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedData = localStorage.getItem(key);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          return parsedData;
        }
      } catch (err) {
        console.error('Failed to load saved data:', err);
      }
      return null;
    };
    
    // Initial load (optional implementation)
    // const initialData = loadSavedData();
    // if (initialData) {
    //   // Handle loading initial data 
    // }
  }, [key]);
  
  // Manual save function
  const saveNow = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    return saveData();
  };
  
  return {
    saveNow,
    lastSaved,
    isSaving,
    saveStatus,
    error
  };
}
