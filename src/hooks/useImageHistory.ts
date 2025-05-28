
import { useState, useCallback } from 'react';

interface HistoryEntry {
  id: string;
  url: string;
  operation: string;
  timestamp: number;
}

export const useImageHistory = (initialUrl?: string) => {
  const [history, setHistory] = useState<HistoryEntry[]>(() => 
    initialUrl ? [{
      id: 'initial',
      url: initialUrl,
      operation: 'Original',
      timestamp: Date.now()
    }] : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const addToHistory = useCallback((url: string, operation: string) => {
    const newEntry: HistoryEntry = {
      id: `entry_${Date.now()}`,
      url,
      operation,
      timestamp: Date.now()
    };

    setHistory(prev => {
      // Remove any entries after current index (for branching)
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, newEntry];
    });
    
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1].url;
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1].url;
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  const currentUrl = history[currentIndex]?.url;

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    currentUrl,
    history
  };
};
