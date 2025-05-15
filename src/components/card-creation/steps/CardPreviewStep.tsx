
import React from 'react';
import { Card } from '@/lib/types/cardTypes';

interface CardPreviewStepProps {
  cardData?: Partial<Card>;
  onSave?: () => void;
  onExport?: (format: string) => void;
}

const CardPreviewStep: React.FC<CardPreviewStepProps> = ({ cardData, onSave, onExport }) => {
  // Implementation will be added later
  return <div>Preview Step</div>;
};

export default CardPreviewStep;
