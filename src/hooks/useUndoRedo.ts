
import { useState, useCallback } from 'react';

interface UndoRedoResult<T> {
  state: T;
  setState: (value: T) => void;
  history: T[];
  pointer: number;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  addToHistory: (state: T) => void;
  clearHistory: () => void;
}

export function useUndoRedo<T>(initialState: T): UndoRedoResult<T> {
  const [state, setInternalState] = useState<T>(initialState);
  const [history, setHistory] = useState<T[]>([initialState]);
  const [pointer, setPointer] = useState<number>(0);
  
  const setState = useCallback((newState: T) => {
    setInternalState(newState);
  }, []);
  
  const addToHistory = useCallback((newState: T) => {
    setHistory(prev => {
      // If we're not at the end of history, slice off the future states
      const newHistory = prev.slice(0, pointer + 1);
      // Add new state
      return [...newHistory, newState];
    });
    setPointer(prev => prev + 1);
  }, [pointer]);
  
  const undo = useCallback(() => {
    if (pointer > 0) {
      const newPointer = pointer - 1;
      setPointer(newPointer);
      setInternalState(history[newPointer]);
    }
  }, [history, pointer]);
  
  const redo = useCallback(() => {
    if (pointer < history.length - 1) {
      const newPointer = pointer + 1;
      setPointer(newPointer);
      setInternalState(history[newPointer]);
    }
  }, [history, pointer]);
  
  const clearHistory = useCallback(() => {
    setHistory([state]);
    setPointer(0);
  }, [state]);
  
  return {
    state,
    setState,
    history,
    pointer,
    canUndo: pointer > 0,
    canRedo: pointer < history.length - 1,
    undo,
    redo,
    addToHistory,
    clearHistory
  };
}
