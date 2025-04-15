
import React from 'react';
import CardEditorContainer from './card-editor/CardEditorContainer';
import { CardData } from '@/types/card';

interface CardEditorProps {
  card?: CardData;
  className?: string;
  onSave?: (card: CardData) => void;
  onCancel?: () => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ 
  card, 
  className,
  onSave,
  onCancel
}) => {
  return (
    <CardEditorContainer 
      card={card} 
      className={className} 
      onSave={onSave}
      onCancel={onCancel}
    />
  );
};

export default CardEditor;
