
import React from 'react';
import { DetectionTabProps } from '../types';

const DetectionTab: React.FC<DetectionTabProps> = ({ uploadedImage, detectedCards }) => {
  return (
    <div className="p-4">
      <h3 className="font-medium text-lg mb-4">Card Detection Results</h3>
      
      <div className="relative border rounded-md overflow-hidden mb-4">
        <img 
          src={uploadedImage.src} 
          alt="Uploaded" 
          className="max-w-full h-auto"
        />
        
        {detectedCards.map((card, index) => (
          <div 
            key={index}
            className="absolute border-2 border-green-500"
            style={{
              left: `${card.x}px`,
              top: `${card.y}px`,
              width: `${card.width}px`,
              height: `${card.height}px`,
              transform: `rotate(${card.rotation}deg)`,
              transformOrigin: 'center'
            }}
          >
            <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1">
              {((card.confidence || 0) * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Detection Details</h4>
        <ul className="text-sm space-y-1">
          {detectedCards.map((card, index) => (
            <li key={index} className="flex justify-between p-2 bg-gray-50 rounded">
              <span>Card {index + 1}</span>
              <span className="font-mono">
                {card.width.toFixed(0)}×{card.height.toFixed(0)}
              </span>
              <span>{((card.confidence || 0) * 100).toFixed(0)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetectionTab;
