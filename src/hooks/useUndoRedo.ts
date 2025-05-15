
import { useState, useCallback } from 'react';

export const useUndoRedo = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setPast(newPast);
    setFuture([state, ...future]);
    setState(previous);
  }, [past, state, future]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast([...past, state]);
    setFuture(newFuture);
    setState(next);
  }, [past, state, future]);

  const addToHistory = useCallback((newState: T) => {
    setPast([...past, state]);
    setFuture([]);
    setState(newState);
  }, [past, state]);
  
  return {
    state,
    setState: addToHistory,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    addToHistory
  };
};
