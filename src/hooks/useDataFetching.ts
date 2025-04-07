
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

interface FetchOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  dependencies?: any[];
}

/**
 * A custom hook for data fetching with built-in loading and error states
 * @param fetchFn The function that fetches data
 * @param options Optional configuration
 * @returns Object containing data, loading state, and error state
 */
export function useDataFetching<T>(
  fetchFn: () => Promise<T>,
  options: FetchOptions = {}
): FetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    isError: false,
    error: null
  });

  const { onSuccess, onError, enabled = true, dependencies = [] } = options;

  // Function to fetch data
  const fetchData = async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));

    try {
      const result = await fetchFn();
      setState({ data: result, isLoading: false, isError: false, error: null });
      if (onSuccess) onSuccess(result);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error');
      setState({ data: null, isLoading: false, isError: true, error: errorObj });
      if (onError) onError(errorObj);
      console.error('Error fetching data:', errorObj);
    }
  };

  // Effect to fetch data on mount and when dependencies change
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...dependencies]);

  // Function to manually refetch data
  const refetch = async () => {
    await fetchData();
  };

  return { ...state, refetch };
}

export default useDataFetching;
