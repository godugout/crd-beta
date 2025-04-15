import React, { useState } from 'react';
import { CardDesignState, CardLayer } from './types/cardTypes';

const CardCreator: React.FC = () => {
  const [layers, setLayers] = useState<CardLayer[]>([]);
  
  return (
    <div>
      <h1>Card Creator</h1>
      {/* Implementation will be added in future updates */}
    </div>
  );
};

// Re-export types for backward compatibility
export type { CardDesignState, CardLayer };

export default CardCreator;
