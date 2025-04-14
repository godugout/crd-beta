
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import FullscreenViewer from '@/components/gallery/FullscreenViewer';
import PageLayout from '@/components/navigation/PageLayout';
import { toast } from 'sonner';
import RelatedCardsSlider from '@/components/card-viewer/RelatedCardsSlider';
import CardBackground from '@/components/home/card-viewer/CardBackground';

const ImmersiveCardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, getCardById } = useCards();
  const [isLoading, setIsLoading] = useState(true);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  
  // Get the current card and prepare effects
  useEffect(() => {
    if (id) {
      const card = getCardById(id);
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
  }, [id, getCardById]);
  
  const handleClose = () => {
    navigate('/cards');
  };
  
  const handleCardClick = (cardId: string) => {
    navigate(`/view/${cardId}`);
  };
  
  // Find related cards based on tags, artist, or year
  const getRelatedCards = () => {
    if (!id) return [];
    const currentCard = getCardById(id);
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
  
  const relatedCards = getRelatedCards();
  
  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        <CardBackground activeEffects={activeEffects} />
        <FullscreenViewer cardId={id} onClose={handleClose} />
      </div>
      
      {relatedCards.length > 0 && (
        <div className="p-4 bg-black/90">
          <h3 className="text-white text-lg font-medium mb-3">Related Cards</h3>
          <RelatedCardsSlider cards={relatedCards} onCardClick={handleCardClick} />
        </div>
      )}
    </div>
  );
};

export default ImmersiveCardViewer;
