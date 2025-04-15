
import { useState, useEffect, useCallback } from 'react';

export interface ApiQueryOptions<T> {
  initialData?: T;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  refetchInterval?: number | false;
  refetchOnMount?: boolean;
}

export interface ApiQueryResult<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching data from an API
 * @param queryFn Function that returns a promise
 * @param options Configuration options
 */
export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  options: ApiQueryOptions<T> = {}
): ApiQueryResult<T> {
  const {
    initialData,
    enabled = true,
    onSuccess,
    onError,
    onSettled,
    refetchInterval = false,
    refetchOnMount = true,
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const result = await queryFn();
      setData(result);
      setIsSuccess(true);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsError(true);
      onError?.(error);
      return undefined;
    } finally {
      setIsLoading(false);
      onSettled?.();
    }
  }, [queryFn, onSuccess, onError, onSettled]);

  // Initial fetch
  useEffect(() => {
    if (enabled && refetchOnMount) {
      fetch();
    }
  }, [enabled, fetch, refetchOnMount]);

  // Setup refetch interval if specified
  useEffect(() => {
    if (!refetchInterval || !enabled) return undefined;

    const id = setInterval(() => {
      fetch();
    }, refetchInterval);

    return () => clearInterval(id);
  }, [refetchInterval, fetch, enabled]);

  return {
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    refetch: fetch,
  };
}
