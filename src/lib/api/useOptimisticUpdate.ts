
import { useState } from 'react';
import { useApiMutation, ApiMutationOptions } from './useApiMutation';

export interface OptimisticUpdateOptions<TData, TVariables, TContext> 
  extends ApiMutationOptions<TData, TVariables> {
  // Function to generate optimistic data from variables
  getOptimisticData: (variables: TVariables) => TData;
  
  // Function to update local data cache optimistically
  updateCache: (optimisticData: TData) => void;
  
  // Function to rollback changes if mutation fails
  rollbackCache: (context: TContext) => void;
}

/**
 * Hook for performing optimistic updates
 * @param mutationFn Function that performs the mutation
 * @param options Configuration options
 */
export function useOptimisticUpdate<TData, TVariables, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: OptimisticUpdateOptions<TData, TVariables, TContext>
) {
  const { 
    getOptimisticData, 
    updateCache, 
    rollbackCache, 
    onMutate: userOnMutate,
    ...restOptions
  } = options;

  const [optimisticData, setOptimisticData] = useState<TData | null>(null);

  // Create a custom onMutate handler that applies optimistic updates
  const onMutate = async (variables: TVariables) => {
    // Call user-provided onMutate if it exists
    const userContext = userOnMutate ? await userOnMutate(variables) : undefined;

    // Generate optimistic data
    const newOptimisticData = getOptimisticData(variables);
    setOptimisticData(newOptimisticData);

    // Update the cache with optimistic data
    updateCache(newOptimisticData);

    // Return context that includes both user context and our context
    return { 
      userContext,
      optimisticData: newOptimisticData
    };
  };

  // Create a custom onError handler that rolls back optimistic updates
  const onError = (error: Error, variables: TVariables, context: any) => {
    // Roll back the optimistic update
    if (context) {
      rollbackCache(context);
    }
    
    // Call user-provided onError if it exists
    if (options.onError) {
      options.onError(error, variables);
    }
  };

  const mutation = useApiMutation(mutationFn, {
    ...restOptions,
    onMutate,
    onError,
  });

  return {
    ...mutation,
    optimisticData,
  };
}
