
import { useState, useEffect, useRef } from 'react';

interface AutoSaveOptions<T> {
  data: T;
  key: string;
  saveInterval?: number;
  onSave?: (data: T) => Promise<void> | void;
}

interface AutoSaveResult {
  lastSaved: number;
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  forceSave: () => Promise<void>;
}

export function useAutoSave<T>({
  data,
  key,
  saveInterval = 30000, // Default to 30 seconds
  onSave
}: AutoSaveOptions<T>): AutoSaveResult {
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const dataRef = useRef<T>(data);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update ref when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);
  
  // Save function
  const saveData = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // Try to save to localStorage first
      localStorage.setItem(key, JSON.stringify(dataRef.current));
      
      // Call custom save handler if provided
      if (onSave) {
        await onSave(dataRef.current);
      }
      
      setLastSaved(Date.now());
      setSaveStatus('saved');
    } catch (err) {
      console.error('Auto-save failed:', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Force save function for external triggers
  const forceSave = async () => {
    await saveData();
  };
  
  // Set up autosave timer
  useEffect(() => {
    // Clean up existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set up new timeout
    timeoutRef.current = setTimeout(saveData, saveInterval);
    
    // Clean up on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveInterval]);
  
  return {
    lastSaved,
    isSaving,
    saveStatus,
    forceSave
  };
}
