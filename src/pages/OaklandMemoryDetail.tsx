
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';

const OaklandMemoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getCard } = useCards();
  
  const card = id ? getCard(id) : undefined;
  
  if (!card) {
    return <div>Memory not found</div>;
  }
  
  return (
    <div>
      <h1>{card.title}</h1>
      <img src={card.imageUrl} alt={card.title} style={{ maxWidth: '300px' }} />
      <p>{card.description}</p>
      
      {card.designMetadata?.oaklandMemory && (
        <div>
          <p>Date: {card.designMetadata.oaklandMemory.date}</p>
          <p>Opponent: {card.designMetadata.oaklandMemory.opponent}</p>
        </div>
      )}
    </div>
  );
};

export default OaklandMemoryDetail;
