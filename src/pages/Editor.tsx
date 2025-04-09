
import React from 'react';
import { useParams } from 'react-router-dom';
import CardEditorContainer from '@/components/card-editor/CardEditorContainer';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/context/CardContext';

const Editor = () => {
  const { id } = useParams<{ id?: string }>();
  const { cards, getCardById } = useCards();
  
  // Get card data if editing an existing card
  const card = id ? getCardById(id) : undefined;
  
  return (
    <PageLayout
      title={card ? "Edit Card" : "Create New Card"}
      description={card ? "Edit your digital card" : "Upload an image and add details to create your digital card."}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <CardEditorContainer card={card} />
      </div>
    </PageLayout>
  );
};

export default Editor;
