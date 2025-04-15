
/**
 * Type for action creator functions
 */
export type ActionCreator<P, T extends string> = (payload: P) => { type: T; payload: P };

/**
 * Creates an action creator function with type safety
 * @param type The action type
 */
export function createAction<P = void, T extends string = string>(type: T): ActionCreator<P, T> {
  return (payload: P) => ({
    type,
    payload
  });
}

/**
 * Creates a dictionary of typed action creators
 * @param actionMap Object of action types and their payload types
 */
export function createActions<
  T extends Record<string, unknown>
>(actionMap: { [K in keyof T]: (payload: T[K]) => any }) {
  return actionMap;
}

/**
 * Helper type to extract action types from action creators
 */
export type ActionType<T> = T extends ActionCreator<any, infer A> ? A : never;

/**
 * Helper type to extract all actions from a record of action creators
 */
export type ActionsUnion<A extends Record<string, ActionCreator<any, string>>> = ReturnType<A[keyof A]>;
