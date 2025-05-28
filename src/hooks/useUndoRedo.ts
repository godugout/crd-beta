
import { useState, useCallback } from 'react';
import { Card } from '@/lib/types';

interface UndoRedoState {
  past: Partial<Card>[];
  present: Partial<Card>;
  future: Partial<Card>[];
}

export const useUndoRedo = (initialState: Partial<Card>) => {
  const [state, setState] = useState<UndoRedoState>({
    past: [],
    present: initialState,
    future: []
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const pushState = useCallback((newState: Partial<Card>) => {
    setState(prev => ({
      past: [...prev.past, prev.present],
      present: newState,
      future: [] // Clear future when new action is performed
    }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const reset = useCallback((newState: Partial<Card>) => {
    setState({
      past: [],
      present: newState,
      future: []
    });
  }, []);

  return {
    state: state.present,
    canUndo,
    canRedo,
    pushState,
    undo,
    redo,
    reset
  };
};
