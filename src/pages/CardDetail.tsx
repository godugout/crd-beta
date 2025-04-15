
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { ArrowLeft } from 'lucide-react';
import CardDetailed from '@/components/cards/CardDetailed';
import RelatedCards from '@/components/cards/RelatedCards';
import { useCardOperations } from '@/hooks/useCardOperations';

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards, getCard } = useCards();
  const cardOperations = useCardOperations();
  
  // Find the card with the matching ID
  const card = getCard ? getCard(id || '') : cards.find(c => c.id === id);
  
  // Handle card not found
  if (!card) {
    return (
      <PageLayout
        title="Card Not Found"
        description="The requested card could not be found"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Card Not Found</h1>
            <p className="text-gray-600 mb-8">
              The card you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/cards')}>
              Browse All Cards
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Handle navigation back after delete
  const handleDeleteSuccess = () => {
    navigate('/cards');
  };
  
  return (
    <PageLayout
      title={card.title || "Card Detail"}
      description={card.description || "View card details"}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
        
        <CardDetailed 
          card={card}
          onView={cardOperations.viewCard}
          onEdit={cardOperations.editCard}
          onShare={() => cardOperations.shareCard(card)}
          onDelete={(id) => cardOperations.removeCard(id, handleDeleteSuccess)}
        />
        
        <RelatedCards 
          cards={cards}
          currentCardId={card.id}
          onCardClick={cardOperations.showCardDetails}
          className="mt-16"
        />
      </div>
    </PageLayout>
  );
};

export default CardDetail;
