
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import { toast } from 'sonner';
import CardBackground from '@/components/home/card-viewer/CardBackground';
import { CardImage } from '@/components/cards/CardImage';

// Import the updated RelatedCards
import RelatedCardsSlider from '@/components/card-viewer/RelatedCardsSlider';

const ImmersiveCardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, getCardById } = useCards();
  const [isLoading, setIsLoading] = useState(true);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, rotation: 0 });
  
  // Get the current card and prepare effects
  useEffect(() => {
    if (id) {
      const card = getCardById ? getCardById(id) : cards.find(c => c.id === id);
      
      if (card) {
        // Extract effects from card metadata
        const effects = [];
        if (card.designMetadata?.cardStyle?.effect === 'holographic') effects.push('Holographic');
        if (card.designMetadata?.cardStyle?.effect === 'refractor') effects.push('Refractor');
        if (card.designMetadata?.cardStyle?.effect === 'gold') effects.push('Gold Foil');
        if (card.designMetadata?.cardStyle?.effect === 'vintage') effects.push('Vintage');
        setActiveEffects(effects);
      }
      setIsLoading(false);
    }
  }, [id, cards, getCardById]);
  
  const handleClose = () => {
    navigate('/cards');
  };
  
  const handleCardClick = (cardId: string) => {
    navigate(`/view/${cardId}`);
  };
  
  const handleCardFlip = (flipped: boolean) => {
    setIsFlipped(flipped);
  };
  
  const handleUpdateCardPosition = (x: number, y: number, rotation: number) => {
    setCardPosition({ x, y, rotation });
  };
  
  const handleCardReset = () => {
    setCardPosition({ x: 0, y: 0, rotation: 0 });
    toast.info('Card position reset');
  };
  
  // Find related cards based on tags, artist, or year
  const getRelatedCards = () => {
    if (!id) return [];
    
    const currentCard = getCardById ? 
      getCardById(id) : 
      cards.find(card => card.id === id);
      
    if (!currentCard) return [];
    
    return cards
      .filter(card => 
        card.id !== id && (
          // Match by tags
          (currentCard.tags && card.tags && 
            currentCard.tags.some(tag => card.tags?.includes(tag))) ||
          // Match by player/artist
          (currentCard.player && card.player && currentCard.player === card.player) ||
          // Match by year
          (currentCard.year && card.year && currentCard.year === card.year)
        )
      )
      .slice(0, 8); // Limit to 8 related cards
  };
  
  if (!id) {
    return (
      <PageLayout title="Card Viewer" description="View your card in immersive mode">
        <div className="container mx-auto py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">No card selected</h2>
          <p className="mb-6">Please select a card from your gallery to view.</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() => navigate('/cards')}
          >
            Go to Gallery
          </button>
        </div>
      </PageLayout>
    );
  }
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  
  const currentCard = getCardById ? getCardById(id) : cards.find(card => card.id === id);
  const relatedCards = getRelatedCards();
  
  if (!currentCard) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-lg">Card not found</div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <CardBackground activeEffects={activeEffects} />
      </div>
      
      {/* Close button */}
      <button
        className="absolute top-4 right-4 z-50 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
        onClick={handleClose}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      {/* Reset button (visible when card is far from center) */}
      {(Math.abs(cardPosition.x) > 100 || Math.abs(cardPosition.y) > 100) && (
        <button
          className="absolute top-4 left-4 z-50 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          onClick={handleCardReset}
          title="Reset card position"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
          </svg>
        </button>
      )}
      
      {/* Main content area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Card with improved physics */}
        <div className="w-full max-w-lg">
          <CardImage
            card={currentCard}
            className="mx-auto transform-gpu"
            flippable={true}
            enable3D={true}
            autoRotate={false}
            onFlip={handleCardFlip}
          />
          
          <div className="mt-4 text-center text-white/70 text-sm">
            <p>Click the card to flip • Drag to move • Flick to spin</p>
          </div>
        </div>
      </div>
      
      {/* Related cards section */}
      {relatedCards.length > 0 && (
        <div className="p-4 bg-black/90 z-10">
          <h3 className="text-white text-lg font-medium mb-3">Related Cards</h3>
          <RelatedCardsSlider cards={relatedCards} onCardClick={handleCardClick} />
        </div>
      )}
    </div>
  );
};

export default ImmersiveCardViewer;
