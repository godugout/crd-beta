
import React from 'react';
import { Position, Property } from 'csstype';

interface CardEdgesProps {
  edgeColor: string;
  thickness: string;
}

const CardEdges: React.FC<CardEdgesProps> = ({ edgeColor, thickness }) => {
  // Base styles for edges with proper TypeScript types
  const edgeStyles: React.CSSProperties = {
    position: 'absolute' as Position,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box' as Property.BoxSizing,
    borderStyle: 'solid',
    borderWidth: '0px',
    borderColor: edgeColor,
    borderRadius: '12px',
    transformStyle: 'preserve-3d' as Property.TransformStyle,
    boxShadow: `0 0 8px ${edgeColor}33`
  };

  const commonEdgeStyle: React.CSSProperties = {
    position: 'absolute' as Position,
    backgroundColor: edgeColor,
    opacity: 0.95
  };

  return (
    <div className="card-edges" style={edgeStyles}>
      {/* Top edge */}
      <div 
        style={{ 
          ...commonEdgeStyle,
          width: '100%',
          height: thickness,
          transform: `rotateX(90deg) translateZ(calc(-${thickness}/2))`,
          top: `-${thickness}/2`
        }}
      />
      
      {/* Bottom edge */}
      <div 
        style={{ 
          ...commonEdgeStyle,
          width: '100%',
          height: thickness,
          transform: `rotateX(90deg) translateZ(calc(100% - ${thickness}/2))`,
          bottom: `-${thickness}/2`
        }}
      />
      
      {/* Left edge */}
      <div 
        style={{ 
          ...commonEdgeStyle,
          width: thickness,
          height: '100%',
          transform: `rotateY(90deg) translateZ(calc(-${thickness}/2))`,
          left: `-${thickness}/2`
        }}
      />
      
      {/* Right edge */}
      <div 
        style={{ 
          ...commonEdgeStyle,
          width: thickness,
          height: '100%',
          transform: `rotateY(90deg) translateZ(calc(100% - ${thickness}/2))`,
          right: `-${thickness}/2`
        }}
      />
    </div>
  );
};

export default CardEdges;
