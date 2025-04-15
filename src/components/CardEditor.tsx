
import React from 'react';
import CardEditorContainer from './card-editor/CardEditorContainer';

interface CardEditorProps {
  card?: any;
  className?: string;
}

const CardEditor: React.FC<CardEditorProps> = ({ card, className }) => {
  return (
    <CardEditorContainer card={card} className={className} />
  );
};

export default CardEditor;
