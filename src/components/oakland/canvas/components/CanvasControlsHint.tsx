
import React from 'react';

const CanvasControlsHint: React.FC = () => (
  <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm rounded px-2 py-1 select-none">
    <div>Drag: Smooth rotate • Wheel: Zoom • F: Flip • Space: Auto-rotate • R: Reset</div>
  </div>
);

export default CanvasControlsHint;
