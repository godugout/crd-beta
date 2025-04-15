
import React from 'react';
import CardEditorContainer from './card-editor/CardEditorContainer';
import { Card } from '@/lib/types';

interface CardEditorProps {
  card?: Card;
  className?: string;
  onSave?: (card: Card) => void;
  onCancel?: () => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ card, className, onSave, onCancel }) => {
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
