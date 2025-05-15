
import { useState, useEffect, useRef } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  key: string;
  saveInterval?: number;
  onSave?: (data: T) => void;
}

export const useAutoSave = <T>({
  data,
  key,
  saveInterval = 60000, // Default: save every 60 seconds
  onSave
}: UseAutoSaveOptions<T>) => {
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(key);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        onSave?.(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [key, onSave]);
  
  // Save data function
  const saveData = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
      
      setLastSaved(Date.now());
      setSaveStatus('saved');
      
      // Call custom save handler if provided
      if (onSave) {
        await onSave(data);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Set up the auto-save interval
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveData();
    }, saveInterval);
    
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveInterval]);
  
  // Save when component unmounts
  useEffect(() => {
    return () => {
      saveData();
    };
  }, []);
  
  // Manual save function
  const manualSave = () => {
    saveData();
  };
  
  return {
    lastSaved,
    isSaving,
    saveStatus,
    manualSave
  };
};
