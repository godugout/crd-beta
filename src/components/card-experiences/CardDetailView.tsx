
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import CardDetailed from '@/components/cards/CardDetailed';
import RelatedCards from '@/components/cards/RelatedCards';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * Component for displaying detailed card view
 */
const CardDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, getCardById } = useCards();
  const [card, setCard] = useState<Card | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundCard = getCardById(id);
      if (foundCard) {
        setCard(foundCard);
      } else {
        console.error(`Card with ID ${id} not found`);
      }
    }
  }, [id, getCardById]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleViewFullScreen = (cardId: string) => {
    navigate(`/cards/immersive/${cardId}`);
  };
  
  const handleEditCard = (cardId: string) => {
    navigate(`/cards/${cardId}/edit`);
  };
  
  const handleCardClick = (cardId: string) => {
    navigate(`/cards/${cardId}`);
  };
  
  if (!card) {
    return (
      <div className="p-8 text-center">
        <p>Card not found</p>
        <Button variant="outline" onClick={handleGoBack} className="mt-4">
          Back to Gallery
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        onClick={handleGoBack}
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <CardDetailed 
        card={card}
        onView={handleViewFullScreen}
        onEdit={handleEditCard}
        className="mb-12"
      />
      
      <RelatedCards
        cards={cards.filter(c => c.id !== card.id)}
        currentCardId={card.id}
        onCardClick={handleCardClick}
        className="mt-12"
      />
    </div>
  );
};

export default CardDetailView;
