
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { ArrowLeft } from 'lucide-react';
import CardDetailed from '@/components/cards/CardDetailed';
import RelatedCards from '@/components/cards/RelatedCards';
import { useCardOperations } from '@/hooks/useCardOperations';
import FullscreenViewer from '@/components/gallery/FullscreenViewer';
import { sampleCards } from '@/lib/data/sampleCards';

// Fallback image to use when card image is not available
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards, getCard } = useCards();
  const cardOperations = useCardOperations();
  const [showViewer, setShowViewer] = useState(false);
  
  // Wait for context to load before trying to show the viewer
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Short delay to ensure context is loaded
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Find the card with the matching ID - first try from context, then fallback to sampleCards
  let card = getCard ? getCard(id || '') : cards.find(c => c.id === id);
  
  // If card is not found in the context, try to find it in sampleCards
  if (!card && id) {
    console.log('Card not found in context, checking sampleCards for ID:', id);
    card = sampleCards.find(c => c.id === id);
  }
  
  // Ensure card has valid image URLs
  if (card) {
    if (!card.imageUrl || card.imageUrl === 'undefined') {
      console.warn('Card has invalid imageUrl, applying fallback', card);
      card = {
        ...card,
        imageUrl: FALLBACK_IMAGE,
        thumbnailUrl: FALLBACK_IMAGE
      };
    }
  } else {
    console.error('Card not found at all for ID:', id);
  }
  
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

  // If showing the viewer, render it as an overlay, but only after context is loaded
  if (showViewer && isLoaded) {
    return (
      <FullscreenViewer 
        cardId={id || ''} 
        onClose={() => setShowViewer(false)} 
      />
    );
  }
  
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
          onView={() => setShowViewer(true)}
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
