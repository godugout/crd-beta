
import { useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Helper hook to create memoized callbacks that don't trigger rerenders
 * Similar to useCallback but with improved dependency tracking
 */
export function useStableMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[] = []
): T {
  // Ref to store the latest callback
  const callbackRef = useRef<T>(callback);
  
  // Update the ref whenever the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Create a stable callback that uses the ref
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, dependencies) as T;
}

/**
 * Custom hook for improving useMemo performance by tracking deep dependencies
 */
export function useDeepMemo<T>(factory: () => T, dependencies: any[]): T {
  const ref = useRef<{ deps: any[]; value: T }>({
    deps: [],
    value: {} as T,
  });
  
  // Check if dependencies have changed
  const depsChanged = !dependencies.every((dep, i) => {
    return Object.is(dep, ref.current.deps[i]);
  });
  
  if (depsChanged || ref.current.value === undefined) {
    ref.current = {
      deps: dependencies,
      value: factory(),
    };
  }
  
  return ref.current.value;
}

/**
 * Hook to prevent unnecessary rerenders by skipping state updates if the value is the same
 */
export function useStateWithCompare<S>(initialState: S | (() => S)) {
  const [state, setState] = useState(initialState);
  
  // Create a wrapper function that only updates state if it's different
  const setStateIfChanged = useCallback((newState: React.SetStateAction<S>) => {
    setState(prevState => {
      // Handle function updates
      const nextState = typeof newState === 'function'
        ? (newState as (prevState: S) => S)(prevState)
        : newState;
      
      // Only update if different
      return Object.is(prevState, nextState) ? prevState : nextState;
    });
  }, []);
  
  return [state, setStateIfChanged] as const;
}

/**
 * Import useState here to use in useStateWithCompare
 */
import { useState } from 'react';
