
import { useState, useCallback } from 'react';

interface HistoryEntry<T> {
  state: T;
  label?: string;
}

interface UseUndoRedoResult<T> {
  state: T;
  setState: (newState: T) => void;
  pushHistory: (newState: T, label?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  futureLength: number;
  addToHistory: (newState: T, label?: string) => void; // Alias for pushHistory for compatibility
}

/**
 * A hook that provides undo/redo functionality
 */
export function useUndoRedo<T>(initialState: T): UseUndoRedoResult<T> {
  const [state, setInternalState] = useState<T>(initialState);
  const [past, setPast] = useState<HistoryEntry<T>[]>([]);
  const [future, setFuture] = useState<HistoryEntry<T>[]>([]);

  // Update state and push to history
  const pushHistory = useCallback((newState: T, label?: string) => {
    setPast(prev => [...prev, { state, label }]);
    setInternalState(newState);
    setFuture([]); // Clear redo stack when new action is performed
  }, [state]);

  // Alias for pushHistory for backward compatibility
  const addToHistory = useCallback((newState: T, label?: string) => {
    pushHistory(newState, label);
  }, [pushHistory]);

  // Set state without recording history
  const setState = useCallback((newState: T) => {
    setInternalState(newState);
  }, []);

  // Undo last action
  const undo = useCallback(() => {
    if (past.length === 0) return;

    const newPast = [...past];
    const previousEntry = newPast.pop() as HistoryEntry<T>;
    
    setPast(newPast);
    setFuture(prev => [...prev, { state, label: previousEntry.label }]);
    setInternalState(previousEntry.state);
  }, [past, state]);

  // Redo previously undone action
  const redo = useCallback(() => {
    if (future.length === 0) return;

    const newFuture = [...future];
    const nextEntry = newFuture.pop() as HistoryEntry<T>;
    
    setFuture(newFuture);
    setPast(prev => [...prev, { state, label: nextEntry.label }]);
    setInternalState(nextEntry.state);
  }, [future, state]);

  return {
    state,
    setState,
    pushHistory,
    addToHistory, // Added for backward compatibility
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    historyLength: past.length,
    futureLength: future.length
  };
}
