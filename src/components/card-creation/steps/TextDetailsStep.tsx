
import React from 'react';

interface CardTextStepProps {
  cardData?: any;
  title?: string;
  description?: string;
  tags?: string[];
  player?: string;
  team?: string;
  year?: string;
  onUpdate?: (updates: any) => void;
}

const TextDetailsStep: React.FC<CardTextStepProps> = ({ cardData, onUpdate }) => {
  // Implementation will be added later
  return <div>Text Details Step</div>;
};

export default TextDetailsStep;
