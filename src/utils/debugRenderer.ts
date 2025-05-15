
/**
 * Utility for consistent debugging of render performance and component state
 */

// Enable/disable debug mode globally
const DEBUG_MODE = process.env.NODE_ENV === 'development' || false;

// Colored console output for different component types
const COLORS = {
  component: '#4CAF50', // Green
  hook: '#2196F3',      // Blue
  render: '#FF9800',    // Orange
  error: '#F44336',     // Red
  warning: '#FFC107',   // Yellow
  effect: '#9C27B0'     // Purple
};

/**
 * Log component render information
 */
export const logRenderInfo = (componentName: string, props?: any, counter?: number) => {
  if (!DEBUG_MODE) return;
  
  console.log(
    `%c[RENDER] ${componentName} ${counter ? `(${counter})` : ''}`, 
    `color: ${COLORS.render}; font-weight: bold;`,
    props ? { props } : ''
  );
};

/**
 * Log hook execution
 */
export const logHookExecution = (hookName: string, params?: any) => {
  if (!DEBUG_MODE) return;
  
  console.log(
    `%c[HOOK] ${hookName}`, 
    `color: ${COLORS.hook}; font-weight: bold;`,
    params ? { params } : ''
  );
};

/**
 * Log effect execution
 */
export const logEffectExecution = (effectName: string, dependencies?: any[]) => {
  if (!DEBUG_MODE) return;
  
  console.log(
    `%c[EFFECT] ${effectName}`, 
    `color: ${COLORS.effect}; font-weight: bold;`,
    dependencies ? { dependencies } : ''
  );
};

/**
 * Log rendering performance information
 */
export const logRenderingInfo = (componentName: string, info: any) => {
  if (!DEBUG_MODE) return;
  
  console.log(
    `%c[PERF] ${componentName}`, 
    `color: ${COLORS.component}; font-weight: bold;`,
    info
  );
};

/**
 * Start timing a component render
 */
export const startRenderTimer = (componentName: string) => {
  if (!DEBUG_MODE) return null;
  
  const timerName = `render_${componentName}`;
  console.time(timerName);
  return timerName;
};

/**
 * End timing a component render
 */
export const endRenderTimer = (timerName: string | null) => {
  if (!DEBUG_MODE || !timerName) return;
  
  console.timeEnd(timerName);
};

/**
 * Create a component wrapper that logs renders and timing
 */
export function withRenderLogging<P extends object>(
  Component: React.ComponentType<P>, 
  componentName?: string
) {
  const displayName = componentName || Component.displayName || Component.name;
  
  const WrappedComponent = (props: P) => {
    const timerName = startRenderTimer(displayName);
    logRenderInfo(displayName, props);
    
    const result = <Component {...props} />;
    
    endRenderTimer(timerName);
    return result;
  };
  
  WrappedComponent.displayName = `WithRenderLogging(${displayName})`;
  return WrappedComponent;
}

export default {
  logRenderInfo,
  logHookExecution,
  logEffectExecution,
  logRenderingInfo,
  startRenderTimer,
  endRenderTimer,
  withRenderLogging
};
