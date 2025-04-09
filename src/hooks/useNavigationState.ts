
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationStateOptions<T> {
  key: string;
  defaultState: T;
  sessionOnly?: boolean;
}

/**
 * Hook to preserve state between navigations
 * @param options Configuration options
 * @returns [state, setState] tuple
 */
export function useNavigationState<T>(options: NavigationStateOptions<T>): [T, (value: T) => void] {
  const { key, defaultState, sessionOnly = true } = options;
  const location = useLocation();
  const navigate = useNavigate();
  
  // Generate a storage key specific to this route if needed
  const storageKey = `nav_state_${key}`;
  
  // Get the current state
  const getState = useCallback((): T => {
    // First check URL state
    if (location.state && location.state[key] !== undefined) {
      return location.state[key];
    }
    
    // Then check sessionStorage
    const storedValue = sessionOnly 
      ? sessionStorage.getItem(storageKey)
      : localStorage.getItem(storageKey);
    
    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch (e) {
        console.error('Failed to parse stored navigation state:', e);
      }
    }
    
    // Fall back to default
    return defaultState;
  }, [key, storageKey, sessionOnly, location.state, defaultState]);
  
  // Set the state
  const setState = useCallback((value: T) => {
    // Store in session/local storage
    try {
      const storage = sessionOnly ? sessionStorage : localStorage;
      storage.setItem(storageKey, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to store navigation state:', e);
    }
    
    // Update URL state without navigation
    const newState = { ...location.state, [key]: value };
    navigate(location.pathname + location.search, { 
      replace: true,
      state: newState
    });
  }, [key, storageKey, sessionOnly, navigate, location.pathname, location.search, location.state]);
  
  // Clean up old state when component unmounts
  useEffect(() => {
    return () => {
      // We don't clean up localStorage items as they should persist
      if (sessionOnly) {
        sessionStorage.removeItem(storageKey);
      }
    };
  }, [storageKey, sessionOnly]);
  
  return [getState(), setState];
}
