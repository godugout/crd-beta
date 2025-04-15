
import React from 'react';
import { CropBoxProps } from './CropBox';
import { MemorabiliaType } from './cardDetection';

interface CropBoxComponentProps {
  box: CropBoxProps;
  isSelected: boolean;
  onClick: () => void;
}

const CropBox: React.FC<CropBoxComponentProps> = ({ box, isSelected, onClick }) => {
  const boxStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${box.x}px`,
    top: `${box.y}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    border: `2px solid ${box.color}`,
    transform: `rotate(${box.rotation || 0}deg)`,
    transformOrigin: 'center',
    cursor: 'pointer',
    boxShadow: isSelected ? '0 0 0 2px blue, 0 0 10px rgba(0, 0, 255, 0.5)' : 'none',
    zIndex: isSelected ? 10 : 1
  };

  return (
    <div 
      className="crop-box" 
      style={boxStyle}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {isSelected && (
        <div className="crop-box-controls flex items-center justify-center h-full">
          <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
            {box.width.toFixed(0)} × {box.height.toFixed(0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropBox;
