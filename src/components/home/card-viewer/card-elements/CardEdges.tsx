
import React from 'react';

interface CardEdgesProps {
  edgeColor: string;
  thickness: string;
}

const CardEdges: React.FC<CardEdgesProps> = ({ edgeColor, thickness }) => {
  // Side edge styles
  const edgeStyle = {
    backgroundColor: edgeColor,
  };
  
  const thicknessValue = parseInt(thickness) || 12; // Default to 12px if invalid
  
  // Positioning for each edge
  const edges = [
    // Left edge
    {
      style: {
        ...edgeStyle,
        width: thickness,
        height: '100%',
        left: '-' + thickness,
        top: '0',
        transform: 'rotateY(90deg)',
        transformOrigin: 'right center',
      }
    },
    // Right edge
    {
      style: {
        ...edgeStyle,
        width: thickness,
        height: '100%',
        right: '-' + thickness,
        top: '0',
        transform: 'rotateY(-90deg)',
        transformOrigin: 'left center',
      }
    },
    // Top edge
    {
      style: {
        ...edgeStyle,
        width: '100%',
        height: thickness,
        top: '-' + thickness,
        left: '0',
        transform: 'rotateX(-90deg)',
        transformOrigin: 'bottom center',
      }
    },
    // Bottom edge
    {
      style: {
        ...edgeStyle,
        width: '100%',
        height: thickness,
        bottom: '-' + thickness,
        left: '0',
        transform: 'rotateX(90deg)',
        transformOrigin: 'top center',
      }
    }
  ];

  return (
    <>
      {edges.map((edge, index) => (
        <div
          key={index}
          className="absolute"
          style={edge.style as React.CSSProperties}
        />
      ))}
      
      {/* Rounded corners - optional for more realistic look */}
      <div 
        className="absolute w-3 h-3 top-0 left-0 rounded-full"
        style={{ 
          backgroundColor: edgeColor, 
          transform: `translate(-${thicknessValue/2}px, -${thicknessValue/2}px)` 
        }}
      />
      <div 
        className="absolute w-3 h-3 top-0 right-0 rounded-full"
        style={{ 
          backgroundColor: edgeColor, 
          transform: `translate(${thicknessValue/2}px, -${thicknessValue/2}px)` 
        }}
      />
      <div 
        className="absolute w-3 h-3 bottom-0 left-0 rounded-full"
        style={{ 
          backgroundColor: edgeColor, 
          transform: `translate(-${thicknessValue/2}px, ${thicknessValue/2}px)` 
        }}
      />
      <div 
        className="absolute w-3 h-3 bottom-0 right-0 rounded-full"
        style={{ 
          backgroundColor: edgeColor, 
          transform: `translate(${thicknessValue/2}px, ${thicknessValue/2}px)` 
        }}
      />
    </>
  );
};

export default CardEdges;
