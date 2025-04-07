
import React from 'react';
import { ComparisonTabProps } from '../types';

const ComparisonTab: React.FC<ComparisonTabProps> = ({ 
  uploadedImage, 
  detectedCards, 
  manualTraces 
}) => {
  return (
    <div className="p-4">
      <h3 className="font-medium text-lg mb-4">Detection Comparison</h3>
      
      <div className="relative border rounded-md overflow-hidden mb-4">
        <img 
          src={uploadedImage.src} 
          alt="Uploaded" 
          className="max-w-full h-auto"
        />
        
        {/* AI Detected Cards */}
        {detectedCards.map((card, index) => (
          <div 
            key={`ai-${index}`}
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
              AI
            </div>
          </div>
        ))}
        
        {/* Manual Traces */}
        {manualTraces.map((trace, index) => (
          <div 
            key={`manual-${index}`}
            className="absolute border-2 border-blue-500"
            style={{
              left: `${trace.x}px`,
              top: `${trace.y}px`,
              width: `${trace.width}px`,
              height: `${trace.height}px`,
              transform: `rotate(${trace.rotation}deg)`,
              transformOrigin: 'center'
            }}
          >
            <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1">
              Manual
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Statistics</h4>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">AI Detections</div>
              <div className="text-xl font-semibold">{detectedCards.length}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Manual Traces</div>
              <div className="text-xl font-semibold">{manualTraces.length}</div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium">Insights</h4>
          <p className="text-sm text-gray-600 mt-1">
            {detectedCards.length > manualTraces.length 
              ? "AI detected more cards than manual tracing. Check if there are false positives." 
              : detectedCards.length < manualTraces.length
                ? "Manual tracing found more cards than AI detection. Model may need improvement."
                : "Both methods found the same number of cards."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTab;
