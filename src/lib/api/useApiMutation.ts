
import { useState, useCallback } from 'react';

export interface ApiMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void;
  onMutate?: (variables: TVariables) => Promise<unknown> | unknown;
}

export interface ApiMutationResult<TData, TVariables> {
  data: TData | undefined;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
  mutate: (variables: TVariables) => Promise<TData | undefined>;
}

/**
 * Hook for performing mutations (create, update, delete)
 * @param mutationFn Function that performs the mutation
 * @param options Configuration options
 */
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: ApiMutationOptions<TData, TVariables> = {}
): ApiMutationResult<TData, TVariables> {
  const { onSuccess, onError, onSettled, onMutate } = options;

  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
  }, []);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | undefined> => {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      try {
        // Run onMutate if provided
        if (onMutate) {
          await onMutate(variables);
        }

        const result = await mutationFn(variables);
        
        setData(result);
        setIsSuccess(true);
        onSuccess?.(result, variables);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setIsError(true);
        onError?.(error, variables);
        return undefined;
      } finally {
        setIsLoading(false);
        onSettled?.(data, error, variables);
      }
    },
    [mutationFn, onSuccess, onError, onSettled, onMutate, data, error]
  );

  return {
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
    mutate,
  };
}
