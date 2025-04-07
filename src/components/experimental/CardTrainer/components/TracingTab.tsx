
import React from 'react';
import { TracingTabProps } from '../types';

const TracingTab: React.FC<TracingTabProps> = ({
  uploadedImage,
  canvasRef,
  fabricCanvasRef,
  displayWidth,
  displayHeight,
  activeTool,
  setActiveTool,
  manualTraces,
  onAddTrace,
  onClearTraces
}) => {
  return (
    <div className="p-4">
      <h3 className="font-medium text-lg mb-4">Manual Card Tracing</h3>
      
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setActiveTool('rect')}
          className={`px-3 py-1 rounded ${activeTool === 'rect' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Rectangle
        </button>
        <button
          onClick={() => setActiveTool('select')}
          className={`px-3 py-1 rounded ${activeTool === 'select' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Select
        </button>
        <button
          onClick={onClearTraces}
          className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 ml-auto"
        >
          Clear All
        </button>
      </div>
      
      <div className="relative border rounded-md overflow-hidden" style={{ height: `${displayHeight}px` }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <img 
            src={uploadedImage.src} 
            alt="Uploaded" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <canvas 
          ref={canvasRef} 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            zIndex: 10 
          }} 
          width={displayWidth} 
          height={displayHeight}
        />
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium">Manual Traces ({manualTraces.length})</h4>
        {manualTraces.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            No manual traces yet. Draw rectangles around cards in the image.
          </p>
        )}
      </div>
    </div>
  );
};

export default TracingTab;
