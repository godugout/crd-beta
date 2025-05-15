
/**
 * Helper functions for debugging rendering issues
 */

export const logRenderingInfo = (componentName: string, details?: Record<string, any>) => {
  // Only log in development mode
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.log(
    `%c[${componentName}]%c rendered${details ? ':' : ''}`,
    'color: #8B5CF6; font-weight: bold;',
    'color: inherit;',
  );

  if (details && Object.keys(details).length > 0) {
    console.log(
      '%c Details:',
      'color: #8B5CF6;',
      details
    );
  }
};

export const traceRenderCause = (componentName: string) => {
  // Only trace in development mode
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.log(
    `%c[${componentName}]%c render trace:`,
    'color: #EC4899; font-weight: bold;',
    'color: inherit;',
  );
  console.trace();
};

export const measureRenderTime = (
  componentName: string, 
  callback: () => void
) => {
  // Only measure in development mode
  if (process.env.NODE_ENV !== 'development') {
    callback();
    return;
  }

  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  
  console.log(
    `%c[${componentName}]%c rendered in %c${(endTime - startTime).toFixed(2)}ms`,
    'color: #8B5CF6; font-weight: bold;',
    'color: inherit;',
    'color: #10B981; font-weight: bold;'
  );
};

export const debugObject = (label: string, obj: any) => {
  // Only debug in development mode
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.group(`%c${label}`, 'color: #8B5CF6; font-weight: bold;');
  console.dir(obj);
  console.groupEnd();
};
