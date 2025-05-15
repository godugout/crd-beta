
import { useState, useCallback, useRef } from 'react';

interface HistoryEntry<T> {
  state: T;
  timestamp: number;
  label?: string;
}

interface UndoRedoOptions<T> {
  maxHistorySize?: number;
  onUndo?: (prevState: T, currentState: T) => void;
  onRedo?: (nextState: T, currentState: T) => void;
}

export function useUndoRedo<T>(
  initialState: T,
  options: UndoRedoOptions<T> = {}
) {
  const {
    maxHistorySize = 50,
    onUndo,
    onRedo
  } = options;

  // Use refs for history to prevent re-renders on history changes
  const historyRef = useRef<HistoryEntry<T>[]>([
    { state: initialState, timestamp: Date.now() }
  ]);
  const futureRef = useRef<HistoryEntry<T>[]>([]);
  const currentStateRef = useRef<T>(initialState);
  
  // State to trigger re-renders when undo/redo operations happen
  const [currentState, setCurrentState] = useState<T>(initialState);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [historyLength, setHistoryLength] = useState(1);
  const [futureLength, setFutureLength] = useState(0);

  // Add a new entry to the history
  const pushHistory = useCallback((newState: T, label?: string) => {
    // Don't push if the state hasn't changed
    if (JSON.stringify(newState) === JSON.stringify(currentStateRef.current)) {
      return;
    }

    // Update history
    historyRef.current.push({
      state: structuredClone(newState),
      timestamp: Date.now(),
      label
    });
    
    // Limit history size
    if (historyRef.current.length > maxHistorySize) {
      historyRef.current.shift();
    }
    
    // Clear future history since we've made a new change
    futureRef.current = [];
    
    // Update current state
    currentStateRef.current = structuredClone(newState);
    setCurrentState(newState);
    
    // Update UI state
    setCanUndo(historyRef.current.length > 1);
    setCanRedo(false);
    setHistoryLength(historyRef.current.length);
    setFutureLength(0);
  }, [maxHistorySize]);

  // Set state without affecting the history
  const setState = useCallback((newState: T) => {
    currentStateRef.current = structuredClone(newState);
    setCurrentState(newState);
  }, []);

  // Undo the last action
  const undo = useCallback(() => {
    if (historyRef.current.length <= 1) return currentStateRef.current;

    // Get current state before popping
    const currentEntry = historyRef.current.pop()!;
    
    // Get previous state
    const previousEntry = historyRef.current[historyRef.current.length - 1];
    
    // Add current state to future history
    futureRef.current.push(currentEntry);
    
    // Update current state
    currentStateRef.current = structuredClone(previousEntry.state);
    setCurrentState(previousEntry.state);
    
    // Update UI state
    setCanUndo(historyRef.current.length > 1);
    setCanRedo(true);
    setHistoryLength(historyRef.current.length);
    setFutureLength(futureRef.current.length);
    
    // Call onUndo callback if provided
    if (onUndo) {
      onUndo(previousEntry.state, currentEntry.state);
    }
    
    return previousEntry.state;
  }, [onUndo]);

  // Redo the last undone action
  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return currentStateRef.current;

    // Get next state
    const nextEntry = futureRef.current.pop()!;
    
    // Add current state to history
    historyRef.current.push({
      state: currentStateRef.current,
      timestamp: Date.now()
    });
    
    // Update current state
    currentStateRef.current = structuredClone(nextEntry.state);
    setCurrentState(nextEntry.state);
    
    // Update UI state
    setCanUndo(true);
    setCanRedo(futureRef.current.length > 0);
    setHistoryLength(historyRef.current.length);
    setFutureLength(futureRef.current.length);
    
    // Call onRedo callback if provided
    if (onRedo) {
      onRedo(nextEntry.state, currentStateRef.current);
    }
    
    return nextEntry.state;
  }, [onRedo]);

  // Reset history
  const resetHistory = useCallback((newState: T) => {
    historyRef.current = [{ state: newState, timestamp: Date.now() }];
    futureRef.current = [];
    currentStateRef.current = newState;
    setCurrentState(newState);
    setCanUndo(false);
    setCanRedo(false);
    setHistoryLength(1);
    setFutureLength(0);
  }, []);

  // Get the entire history
  const getHistory = useCallback(() => {
    return historyRef.current;
  }, []);

  // Get the future history (states that can be redone)
  const getFuture = useCallback(() => {
    return futureRef.current;
  }, []);

  // Go to a specific state in history by index
  const goToHistoryIndex = useCallback((index: number) => {
    if (index < 0 || index >= historyRef.current.length) return;

    // Everything after the target index goes to future
    const targetState = historyRef.current[index].state;
    const newFuture = historyRef.current.slice(index + 1).reverse();
    
    // Update history and future
    historyRef.current = historyRef.current.slice(0, index + 1);
    futureRef.current = [...newFuture, ...futureRef.current];
    
    // Update current state
    currentStateRef.current = structuredClone(targetState);
    setCurrentState(targetState);
    
    // Update UI state
    setCanUndo(index > 0);
    setCanRedo(futureRef.current.length > 0);
    setHistoryLength(historyRef.current.length);
    setFutureLength(futureRef.current.length);
  }, []);

  return {
    state: currentState,
    setState,
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
    getHistory,
    getFuture,
    goToHistoryIndex,
    historyLength,
    futureLength
  };
}
