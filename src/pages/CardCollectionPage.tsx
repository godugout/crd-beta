
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/context/CardContext';
import { useNavigate } from 'react-router-dom';
import CardGridWrapper from '@/components/gallery/CardGridWrapper';

const CardCollectionPage = () => {
  const { cards, isLoading } = useCards();
  const navigate = useNavigate();
  
  const handleCardClick = (cardId: string) => {
    navigate(`/cards/${cardId}`);
  };
  
  const getCardEffects = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    return card?.effects || [];
  };

  return (
    <PageLayout title="Card Collection" description="Browse our card collection">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Card Collection</h1>
        <div className="mb-8">
          <CardGridWrapper
            cards={cards}
            isLoading={isLoading}
            error={null}
            onCardClick={handleCardClick}
            getCardEffects={getCardEffects}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default CardCollectionPage;
