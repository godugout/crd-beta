
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';

const MemoryPackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { collections, isLoading, cards } = useCards();
  
  const collection = collections.find(c => c.id === id);
  const collectionCards = collection 
    ? cards.filter(card => collection.cardIds.includes(card.id))
    : [];
  
  if (isLoading) {
    return <div>Loading memory pack...</div>;
  }
  
  if (!collection) {
    return <div>Memory pack not found</div>;
  }
  
  return (
    <div>
      <h1>{collection.name}</h1>
      <p>{collection.description}</p>
      <h2>Cards in this pack:</h2>
      <ul>
        {collectionCards.map(card => (
          <li key={card.id}>
            {card.title}
            {card.designMetadata?.oaklandMemory && (
              <div>
                <p>Date: {card.designMetadata.oaklandMemory.date}</p>
                <p>Opponent: {card.designMetadata.oaklandMemory.opponent}</p>
                <p>Location: {card.designMetadata.oaklandMemory.location}</p>
                <p>Score: {card.designMetadata.oaklandMemory.score}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoryPackDetail;
