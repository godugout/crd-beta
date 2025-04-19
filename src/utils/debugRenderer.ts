
/**
 * Utility functions to help debug rendering issues in 3D scenes
 */

// Enable debug mode globally
export const DEBUG_RENDERING = false;

// Log visibility issues for debugging
export const logRenderingInfo = (
  componentName: string, 
  visibilityInfo: {
    elementId?: string;
    visible: boolean;
    zIndex?: number;
    opacity?: number;
    position?: { x?: number; y?: number; z?: number };
  }
) => {
  if (!DEBUG_RENDERING) return;
  
  console.log(
    `%c[${componentName}] Rendering debug:`,
    'background: #334155; color: #94a3b8; padding: 2px 4px; border-radius: 2px;',
    visibilityInfo
  );
};

// Style object helper for z-index and visibility
export const getDebugStyles = (zIndex: number, visible: boolean = true) => {
  if (!DEBUG_RENDERING) return {};
  
  return {
    outline: '1px dashed rgba(255,0,0,0.5)',
    position: 'relative' as const,
    zIndex: zIndex,
    opacity: visible ? 1 : 0.3
  };
};
