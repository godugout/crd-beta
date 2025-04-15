
import React, { useContext, useReducer, useMemo, createContext, Dispatch } from 'react';

// Generic type for creating state contexts
export interface StateContextProps<State, Action> {
  state: State;
  dispatch: Dispatch<Action>;
}

/**
 * Creates a state context with reducer pattern
 * @param reducer The reducer function
 * @param initialState The initial state
 * @param displayName Optional name for debugging
 */
export function createStateContext<State, Action>(
  reducer: (state: State, action: Action) => State,
  initialState: State,
  displayName?: string
) {
  const StateContext = createContext<StateContextProps<State, Action> | undefined>(undefined);
  
  if (displayName) {
    StateContext.displayName = displayName;
  }
  
  // Provider component
  const StateProvider = ({ 
    children,
    initialStateOverride
  }: { 
    children: React.ReactNode;
    initialStateOverride?: Partial<State>;
  }) => {
    const [state, dispatch] = useReducer(
      reducer,
      initialStateOverride ? { ...initialState, ...initialStateOverride } : initialState
    );
    
    const contextValue = useMemo(() => ({ state, dispatch }), [state]);
    
    return (
      <StateContext.Provider value={contextValue}>
        {children}
      </StateContext.Provider>
    );
  };
  
  // Hook for consuming the context
  const useState = () => {
    const context = useContext(StateContext);
    
    if (context === undefined) {
      throw new Error(`useState must be used within a StateProvider`);
    }
    
    return context;
  };
  
  return {
    StateContext,
    StateProvider,
    useState
  };
}
