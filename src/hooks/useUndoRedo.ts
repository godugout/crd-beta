
import { useState, useCallback } from 'react';

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useUndoRedo<T>(initialState: T) {
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: []
  });
  
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;
  
  const undo = useCallback(() => {
    if (!canUndo) return;
    
    const newPresent = state.past[state.past.length - 1];
    
    setState({
      past: state.past.slice(0, state.past.length - 1),
      present: newPresent,
      future: [state.present, ...state.future]
    });
  }, [state, canUndo]);
  
  const redo = useCallback(() => {
    if (!canRedo) return;
    
    const newPresent = state.future[0];
    
    setState({
      past: [...state.past, state.present],
      present: newPresent,
      future: state.future.slice(1)
    });
  }, [state, canRedo]);
  
  const addToHistory = useCallback((newPresent: T) => {
    setState({
      past: [...state.past, state.present],
      present: newPresent,
      future: []
    });
  }, [state]);
  
  const resetHistory = useCallback((newPresent: T) => {
    setState({
      past: [],
      present: newPresent,
      future: []
    });
  }, []);
  
  return {
    state: state.present,
    setState: addToHistory,
    resetHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    addToHistory,
    history: {
      past: state.past,
      present: state.present,
      future: state.future
    }
  };
}

export default useUndoRedo;
