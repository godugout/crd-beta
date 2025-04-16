
import React from 'react';

export const AccessibilityInfo: React.FC = () => {
  return (
    <div className="sr-only">
      <p>Use keyboard controls to interact with the cube:</p>
      <ul>
        <li>Use arrow keys to rotate</li>
        <li>Press + to zoom in</li>
        <li>Press - to zoom out</li>
        <li>Press R to reset position</li>
      </ul>
    </div>
  );
};
