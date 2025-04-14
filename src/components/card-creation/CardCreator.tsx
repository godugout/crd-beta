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

export default CardCreator;
