
/**
 * Helper utility for debugging rendering performance in development
 */

// Track render times by component
const renderCounts: Record<string, number> = {};
const renderTimes: Record<string, number> = {};

/**
 * Logs information about component renders for performance debugging
 * @param componentName Name of the component being rendered
 * @param props Optional props to log (for checking what causes re-renders)
 */
export const logRenderingInfo = (
  componentName: string, 
  props?: Record<string, any>
) => {
  if (process.env.NODE_ENV !== 'development') return;
  
  // Update render count
  renderCounts[componentName] = (renderCounts[componentName] || 0) + 1;
  
  // Track render time
  const now = performance.now();
  const lastRender = renderTimes[componentName];
  renderTimes[componentName] = now;
  
  const timeSinceLastRender = lastRender ? now - lastRender : null;
  
  // Log render information
  console.group(`%c🔄 Render: ${componentName} (${renderCounts[componentName]})`);
  
  if (timeSinceLastRender !== null) {
    const color = timeSinceLastRender < 100 
      ? 'color: green' 
      : timeSinceLastRender < 500 
        ? 'color: orange'
        : 'color: red; font-weight: bold';
    
    console.log(`%cTime since last render: ${timeSinceLastRender.toFixed(2)}ms`, color);
  }
  
  if (props) {
    console.log('Props:', props);
  }
  
  console.groupEnd();
};

/**
 * Reset all the rendering stats (useful for testing specific workflows)
 */
export const resetRenderingStats = () => {
  Object.keys(renderCounts).forEach(key => {
    delete renderCounts[key];
    delete renderTimes[key];
  });
};

/**
 * Log a summary of all render counts
 */
export const logRenderingSummary = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.group('📊 Rendering Summary');
  
  Object.entries(renderCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([component, count]) => {
      console.log(`${component}: ${count} renders`);
    });
  
  console.groupEnd();
};
