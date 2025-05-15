
import { useState, useCallback } from 'react';

interface UseUndoRedoStateOptions<T> {
  maxHistoryLength?: number;
}

interface UseUndoRedoStateReturn<T> {
  state: T;
  setState: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
  pushState: (newState: T, label?: string) => void;
  historyLength: number;
  futureLength: number;
}

/**
 * A hook to manage state with undo/redo functionality
 */
export function useUndoRedoState<T>(
  initialState: T,
  options: UseUndoRedoStateOptions<T> = {}
): UseUndoRedoStateReturn<T> {
  const { maxHistoryLength = 100 } = options;
  
  // Past states for undo
  const [past, setPast] = useState<T[]>([]);
  
  // Current state
  const [present, setPresent] = useState<T>(initialState);
  
  // Future states for redo
  const [future, setFuture] = useState<T[]>([]);
  
  // Set state and record in history
  const setState = useCallback((newState: T) => {
    setPast(prev => {
      const newPast = [...prev, present];
      // Trim history if it exceeds max length
      if (newPast.length > maxHistoryLength) {
        return newPast.slice(newPast.length - maxHistoryLength);
      }
      return newPast;
    });
    setPresent(newState);
    setFuture([]);
  }, [present, maxHistoryLength]);
  
  // Add a state to history without changing current state
  // Useful for initial states or when you want to manually control history
  const pushState = useCallback((newState: T, label?: string) => {
    setPast(prev => {
      const newPast = [...prev, present];
      if (newPast.length > maxHistoryLength) {
        return newPast.slice(newPast.length - maxHistoryLength);
      }
      return newPast;
    });
    setPresent(newState);
    setFuture([]);
  }, [present, maxHistoryLength]);
  
  // Undo to previous state
  const undo = useCallback(() => {
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setPast(newPast);
    setPresent(previous);
    setFuture([present, ...future]);
  }, [past, present, future]);
  
  // Redo to next state
  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);
  }, [past, present, future]);
  
  // Clear all history
  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);
  
  return {
    state: present,
    setState,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    clearHistory,
    pushState,
    historyLength: past.length,
    futureLength: future.length
  };
}
