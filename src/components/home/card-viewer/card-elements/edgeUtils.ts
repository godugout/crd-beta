
import React from 'react';

export const calculateEdgeStyle = (position: 'top' | 'bottom' | 'left' | 'right', thickness: string): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    background: 'var(--edge-color)',
    boxShadow: `0 0 10px 0 var(--edge-color-alpha)`,
  };

  switch (position) {
    case 'top':
      return {
        ...baseStyle,
        top: 0,
        left: 0,
        right: 0,
        height: thickness,
      };
    case 'bottom':
      return {
        ...baseStyle,
        bottom: 0,
        left: 0,
        right: 0,
        height: thickness,
      };
    case 'left':
      return {
        ...baseStyle,
        top: thickness,
        bottom: thickness,
        left: 0,
        width: thickness,
      };
    case 'right':
      return {
        ...baseStyle,
        top: thickness,
        bottom: thickness,
        right: 0,
        width: thickness,
      };
    default:
      return baseStyle;
  }
};
