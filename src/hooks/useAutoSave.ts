
import { useState, useEffect, useRef } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  key: string;
  saveInterval?: number;
  storageType?: 'local' | 'session';
}

/**
 * A hook that provides auto-saving functionality for form data
 */
export function useAutoSave<T>({
  data,
  key,
  saveInterval = 60000, // 1 minute by default
  storageType = 'local'
}: UseAutoSaveOptions<T>) {
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const storage = storageType === 'local' ? localStorage : sessionStorage;
  
  const timerRef = useRef<number | null>(null);
  const dataRef = useRef<T>(data);
  
  // Update the ref whenever data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);
  
  // Load data from storage on mount
  useEffect(() => {
    try {
      const savedData = storage.getItem(key);
      if (savedData) {
        // We're not setting the data here, just checking if it exists
        const { timestamp } = JSON.parse(savedData);
        if (timestamp) {
          setLastSaved(timestamp);
        }
      }
    } catch (error) {
      console.error('Error loading auto-saved data:', error);
    }
  }, [key, storage]);
  
  // Set up the auto-save timer
  useEffect(() => {
    const saveData = async () => {
      try {
        setSaveStatus('saving');
        setIsSaving(true);
        
        // Save the current data and timestamp
        const saveObj = {
          data: dataRef.current,
          timestamp: Date.now()
        };
        
        storage.setItem(key, JSON.stringify(saveObj));
        
        setLastSaved(saveObj.timestamp);
        setSaveStatus('saved');
      } catch (error) {
        console.error('Error auto-saving data:', error);
        setSaveStatus('error');
      } finally {
        setIsSaving(false);
      }
    };
    
    // Setup interval
    timerRef.current = window.setInterval(saveData, saveInterval);
    
    // Cleanup
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [key, saveInterval, storage]);
  
  // Manual save function
  const save = async () => {
    try {
      setSaveStatus('saving');
      setIsSaving(true);
      
      const saveObj = {
        data: dataRef.current,
        timestamp: Date.now()
      };
      
      storage.setItem(key, JSON.stringify(saveObj));
      
      setLastSaved(saveObj.timestamp);
      setSaveStatus('saved');
      
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveStatus('error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Clear saved data
  const clearSaved = () => {
    try {
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing saved data:', error);
      return false;
    }
  };

  return {
    lastSaved,
    isSaving,
    saveStatus,
    save,
    clearSaved
  };
}

export default useAutoSave;
