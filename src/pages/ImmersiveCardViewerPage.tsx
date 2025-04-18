
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import ImmersiveCollection from '@/components/immersive/ImmersiveCollection';

const ImmersiveCardViewerPage: React.FC = () => {
  const { id } = useParams();
  const { cards } = useCards();

  // If we have an ID, find its index in the collection
  const initialIndex = id ? cards.findIndex(card => card.id === id) : 0;

  return (
    <ImmersiveCollection 
      cards={cards} 
      initialCardIndex={initialIndex >= 0 ? initialIndex : 0}
    />
  );
};

export default ImmersiveCardViewerPage;
