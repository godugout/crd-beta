
import React from 'react';
import { calculateEdgeStyle } from './edgeUtils';
import './card-edges.css';

interface CardEdgesProps {
  edgeColor: string;
  thickness: string;
}

const CardEdges: React.FC<CardEdgesProps> = ({ edgeColor, thickness }) => {
  const edgeStyles = {
    '--edge-color': edgeColor,
    '--edge-color-alpha': `${edgeColor}33`,
    '--thickness': thickness,
    borderColor: edgeColor,
  } as React.CSSProperties;

  const renderEdge = (position: 'top' | 'bottom' | 'left' | 'right') => {
    const style = {
      ...calculateEdgeStyle(position, thickness),
    } as React.CSSProperties;

    return (
      <div 
        className={`card-edge edge-${position}`}
        style={style}
      />
    );
  };

  return (
    <div className="card-edges" style={edgeStyles}>
      {renderEdge('top')}
      {renderEdge('bottom')}
      {renderEdge('left')}
      {renderEdge('right')}
    </div>
  );
};

export default CardEdges;
