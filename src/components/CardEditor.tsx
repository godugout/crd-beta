
import React from 'react';
import CardEditor from './card-editor/CardEditor';
import { Card } from '@/lib/types';

interface CardEditorProps {
  card?: Card;
  className?: string;
  onSave?: (card: Card) => void;
  onCancel?: () => void;
}

const CardEditorComponent: React.FC<CardEditorProps> = ({ 
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

  const handleExport = (card: Card) => {
    // Export functionality to be implemented
    console.log('Export card:', card);
  };

  return (
    <CardEditor
      initialCard={card}
      onSave={handleSave}
      onPreview={handlePreview}
      onExport={handleExport}
      className={className}
    />
  );
};

export default CardEditorComponent;
