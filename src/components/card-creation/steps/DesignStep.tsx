
import React from 'react';
import { Card } from '@/lib/types/cardTypes';

interface CardDesignStepProps {
  cardData?: Partial<Card>;
  onUpdate?: (updates: Partial<Card>) => void;
}

const DesignStep: React.FC<CardDesignStepProps> = ({ cardData, onUpdate }) => {
  // Implementation will be added later
  return <div>Design Step</div>;
};

export default DesignStep;
