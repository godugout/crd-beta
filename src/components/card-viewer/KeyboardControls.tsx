
import React from 'react';

const KeyboardControls = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-sm rounded-lg p-4 backdrop-blur-sm">
      <h3 className="font-semibold mb-2">Keyboard Controls:</h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
        <div>
          <span className="text-gray-400">Arrow Keys:</span> Move Card
        </div>
        <div>
          <span className="text-gray-400">[/]:</span> Rotate
        </div>
        <div>
          <span className="text-gray-400">F:</span> Flip card
        </div>
        <div>
          <span className="text-gray-400">E:</span> Effects panel
        </div>
        <div>
          <span className="text-gray-400">+/-:</span> Zoom in/out
        </div>
        <div>
          <span className="text-gray-400">M:</span> Multi-card view
        </div>
        <div>
          <span className="text-gray-400">B:</span> Card back
        </div>
        <div>
          <span className="text-gray-400">R:</span> Reset position
        </div>
        <div>
          <span className="text-gray-400">ESC:</span> Close panels
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Scroll with CTRL + wheel to zoom. Mouse over to see card effects.
      </div>
    </div>
  );
};

export default KeyboardControls;
