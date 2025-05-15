
import { useState, useCallback } from 'react';

interface UseUndoRedoOptions {
  maxHistorySize?: number;
}

/**
 * A hook that provides undo/redo functionality for any state
 */
export function useUndoRedo<T>(
  initialState: T,
  { maxHistorySize = 50 }: UseUndoRedoOptions = {}
) {
  // Current state
  const [state, setState] = useState<T>(initialState);
  
  // History stacks
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);
  
  // Add state to history
  const addToHistory = useCallback((newState: T) => {
    setPast(prevPast => {
      // Limit history size
      const nextPast = [...prevPast, state].slice(-maxHistorySize);
      return nextPast;
    });
    setFuture([]); // Clear redo stack
    setState(newState);
  }, [state, maxHistorySize]);
  
  // Undo operation
  const undo = useCallback(() => {
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setPast(newPast);
    setFuture([state, ...future]); 
    setState(previous);
  }, [past, state, future]);
  
  // Redo operation
  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast([...past, state]);
    setFuture(newFuture);
    setState(next);
  }, [past, state, future]);
  
  // Check if undo/redo are available
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  return {
    state,
    setState: addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    addToHistory,
    history: {
      past,
      present: state,
      future,
    },
  };
}

export default useUndoRedo;
