
import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcutOptions {
  /**
   * Whether the Ctrl key must be pressed (Command on Mac)
   */
  ctrl?: boolean;
  
  /**
   * Whether the Alt key must be pressed
   */
  alt?: boolean;
  
  /**
   * Whether the Shift key must be pressed
   */
  shift?: boolean;
  
  /**
   * Whether to prevent default browser behavior
   */
  preventDefault?: boolean;
}

/**
 * Hook for handling keyboard shortcuts
 * 
 * @param key The key to listen for (e.g., 'a', 'Enter', 'Escape')
 * @param callback The function to call when the key is pressed
 * @param options Additional options to modify the behavior
 */
export function useKeyboardShortcut(
  key: string | string[],
  callback: (e: KeyboardEvent) => void,
  options: KeyboardShortcutOptions = {}
): void {
  // Store the callback in a ref to avoid re-registering the event listener
  const callbackRef = useRef(callback);
  
  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create the event handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keys = Array.isArray(key) ? key : [key];
    
    // Check if the pressed key matches any of the target keys
    if (!keys.includes(e.key)) return;
    
    // Check modifier keys if specified
    if (options.ctrl && !(e.ctrlKey || e.metaKey)) return;
    if (options.alt && !e.altKey) return;
    if (options.shift && !e.shiftKey) return;
    
    // Prevent default behavior if specified
    if (options.preventDefault) {
      e.preventDefault();
    }
    
    // Call the callback
    callbackRef.current(e);
  }, [key, options.ctrl, options.alt, options.shift, options.preventDefault]);

  // Add and remove the event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
