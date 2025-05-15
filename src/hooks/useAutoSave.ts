
import { useEffect, useRef, useCallback } from 'react';
import { toast } from '@/lib/utils/toast';

interface AutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  interval?: number;
  debounce?: number;
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  showNotifications?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  interval = 60000, // Default to 1 minute
  debounce = 2000,  // Default to 2 seconds
  enabled = true,
  onSuccess,
  onError,
  showNotifications = true
}: AutoSaveOptions<T>) {
  // Reference to the current data to save
  const dataRef = useRef<T>(data);
  
  // Flag to track pending changes
  const hasChangesRef = useRef<boolean>(false);
  
  // Flag to track if save is in progress
  const isSavingRef = useRef<boolean>(false);
  
  // Track last saved data for comparison
  const lastSavedDataRef = useRef<string>(JSON.stringify(data));
  
  // Track the timeout IDs for interval and debounce
  const intervalTimerRef = useRef<number | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Update ref when data changes
  useEffect(() => {
    dataRef.current = data;
    
    // Check if data has changed since last save
    const currentDataString = JSON.stringify(data);
    if (lastSavedDataRef.current !== currentDataString) {
      hasChangesRef.current = true;
    }
  }, [data]);

  // Function to execute the save
  const saveData = useCallback(async () => {
    // If already saving or no changes, skip
    if (isSavingRef.current || !hasChangesRef.current || !enabled) {
      return;
    }

    try {
      isSavingRef.current = true;
      
      // Show notification
      let toastId: string | undefined;
      if (showNotifications) {
        toastId = toast({
          title: "Saving changes...",
          description: "Your changes are being saved automatically"
        });
      }
      
      // Execute the save function
      await onSave(dataRef.current);
      
      // Update last saved data
      lastSavedDataRef.current = JSON.stringify(dataRef.current);
      hasChangesRef.current = false;
      
      // Show success notification
      if (showNotifications) {
        toast({
          title: "Changes saved",
          description: "Your changes have been saved automatically",
          variant: "success"
        });
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Show error notification
      if (showNotifications) {
        toast({
          title: "Save failed",
          description: "There was an error saving your changes",
          variant: "destructive"
        });
      }
      
      // Call error callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [onSave, enabled, onSuccess, onError, showNotifications]);

  // Function to trigger a debounced save
  const triggerDebouncedSave = useCallback(() => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    // Set new debounce timer
    debounceTimerRef.current = window.setTimeout(() => {
      saveData();
    }, debounce);
  }, [debounce, saveData]);

  // Set up interval auto-save
  useEffect(() => {
    if (!enabled) return;
    
    // Set initial interval timer
    intervalTimerRef.current = window.setInterval(() => {
      if (hasChangesRef.current) {
        saveData();
      }
    }, interval);
    
    // Clean up timers on unmount
    return () => {
      if (intervalTimerRef.current) {
        window.clearInterval(intervalTimerRef.current);
      }
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      
      // Save any pending changes before unmounting
      if (hasChangesRef.current) {
        saveData();
      }
    };
  }, [enabled, interval, saveData]);

  // Function to manually trigger a save
  const save = useCallback(() => {
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    return saveData();
  }, [saveData]);

  // Return the manual save function and ability to check if auto-save is active
  return {
    save,
    triggerDebouncedSave,
    hasChanges: hasChangesRef.current,
    isSaving: isSavingRef.current,
    isAutoSaveEnabled: enabled
  };
}
