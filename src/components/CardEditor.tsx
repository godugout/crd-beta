
import React from 'react';
import { EnhancedCardEditor } from './card-editor/EnhancedCardEditor';
import { Card } from '@/lib/types';

interface CardEditorProps {
  card?: Card;
  className?: string;
  onSave?: (card: Card) => void;
  onCancel?: () => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ 
  card, 
  className, 
  onSave = () => {}, 
  onCancel = () => {} 
}) => {
  const handleSave = async (savedCard: Card) => {
    onSave(savedCard);
  };

  const handlePreview = (card: Card) => {
    // For now, just log the preview - integrate with 3D viewer later
    console.log('Preview card:', card);
  };

  return (
    <EnhancedCardEditor
      initialCard={card}
      onSave={handleSave}
      onPreview={handlePreview}
      className={className}
    />
  );
};

export default CardEditor;
