
import React from 'react';

const EmptyStateDisplay: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="text-center text-gray-500 bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg select-text">
      <div className="text-6xl mb-4">⚾</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Choose Your Template</h3>
      <p className="text-gray-600">Select an Oakland A's template from the sidebar to see your memory card in 3D</p>
    </div>
  </div>
);

export default EmptyStateDisplay;
