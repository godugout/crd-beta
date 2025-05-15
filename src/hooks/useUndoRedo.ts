
import { useState, useCallback } from 'react';

export function useUndoRedo<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);
  
  // Update state and move current state to past
  const addToHistory = useCallback((newState: T) => {
    setPast(prev => [...prev, state]);
    setState(newState);
    setFuture([]); // Clear redo history when a new action is performed
  }, [state]);
  
  // Undo: go back to the previous state
  const undo = useCallback(() => {
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture(prev => [state, ...prev]);
    setState(previous);
    setPast(newPast);
  }, [past, state]);
  
  // Redo: go forward to the next state
  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast(prev => [...prev, state]);
    setState(next);
    setFuture(newFuture);
  }, [future, state]);
  
  return {
    state,
    setState: addToHistory,
    undo,
    redo,
    addToHistory,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
