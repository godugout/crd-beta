
import React from 'react';

const KeyboardShortcuts = () => {
  return (
    <div className="absolute bottom-6 right-6">
      <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 shadow-lg text-white text-xs max-w-xs">
        <h4 className="font-medium mb-2">Keyboard Shortcuts:</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div>
            <kbd className="bg-gray-800 px-1 rounded">Arrow keys</kbd> 
            <span className="ml-1">Rotate</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">F</kbd> 
            <span className="ml-1">Flip card</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">R</kbd> 
            <span className="ml-1">Auto-rotate</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">Esc</kbd> 
            <span className="ml-1">Close</span>
          </div>
        </div>
        <div className="mt-3 text-gray-400 text-[10px]">
          Click and drag to manually rotate the card
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;

