
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import { toast } from 'sonner';
import CardBackground from '@/components/home/card-viewer/CardBackground';
import { CardImage } from '@/components/cards/CardImage';
import MouseInteractionLayer from '@/components/ar/MouseInteractionLayer';

// Import the updated RelatedCards
import RelatedCardsSlider from '@/components/card-viewer/RelatedCardsSlider';
import { RotateCcw, RotateCw, Layers, RefreshCw, Share2, Sparkles, X } from 'lucide-react';

const ImmersiveCardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, getCardById } = useCards();
  const [isLoading, setIsLoading] = useState(true);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, rotation: 0 });
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  
  // Available card effects
  const availableEffects = [
    { id: 'holographic', name: 'Holographic', premium: true },
    { id: 'refractor', name: 'Refractor', premium: true },
    { id: 'gold', name: 'Gold Foil', premium: true },
    { id: 'shimmer', name: 'Shimmer', premium: false },
    { id: 'vintage', name: 'Vintage', premium: false }
  ];
  
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

  const handleFlipCard = (cardId: string) => {
    setIsFlipped(!isFlipped);
  };
  
  const handleUpdateCardPosition = (cardId: string, x: number, y: number, rotation: number) => {
    setCardPosition({ x, y, rotation });
  };

  const handleResetCard = () => {
    setCardPosition({ x: 0, y: 0, rotation: 0 });
  };

  const toggleEffect = (effectName: string) => {
    setActiveEffects(prev => 
      prev.includes(effectName) 
        ? prev.filter(e => e !== effectName) 
        : [...prev, effectName]
    );
    
    // Show a message about premium effects
    const effect = availableEffects.find(e => e.name === effectName);
    if (effect?.premium && !activeEffects.includes(effectName)) {
      toast.info('Premium effect applied!', {
        description: 'Create an account to save custom card effects.',
        action: {
          label: 'Sign Up',
          onClick: () => navigate('/signup')
        }
      });
    }
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
        <X size={24} />
      </button>
      
      {/* Effects toggle button */}
      <button
        className="absolute top-4 left-4 z-50 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
        onClick={() => setShowEffectsPanel(!showEffectsPanel)}
        title="Card Effects"
      >
        <Sparkles size={24} />
      </button>
      
      {/* Effects panel */}
      {showEffectsPanel && (
        <div className="absolute top-16 left-4 z-50 bg-black/70 backdrop-blur-md rounded-lg p-4 w-64 text-white">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Card Effects</h3>
            <button 
              className="text-white/70 hover:text-white"
              onClick={() => setShowEffectsPanel(false)}
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="space-y-2">
            {availableEffects.map(effect => (
              <div 
                key={effect.id} 
                className={`flex items-center justify-between p-2 rounded ${
                  activeEffects.includes(effect.name) 
                    ? 'bg-primary/20 border border-primary/40' 
                    : 'bg-white/5 border border-transparent hover:border-white/20'
                } cursor-pointer transition-all`}
                onClick={() => toggleEffect(effect.name)}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className={activeEffects.includes(effect.name) ? 'text-primary' : 'text-gray-400'} />
                  <span>{effect.name}</span>
                </div>
                
                {effect.premium && (
                  <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">Premium</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-400">
            Premium effects require an account to save.
          </div>
        </div>
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
            onFlip={setIsFlipped}
          />
          
          {/* Mouse interaction layer for better card movement */}
          <MouseInteractionLayer
            cards={[currentCard]}
            selectedCardId={currentCard.id}
            onUpdateCardPosition={handleUpdateCardPosition}
            onFlipCard={handleFlipCard}
            onResetCard={handleResetCard}
          />
          
          <div className="mt-4 text-center text-white/70 text-sm">
            <p>Click to flip • Drag to move • Flick to spin • Apply effects to preview premium features</p>
          </div>
        </div>
      </div>
      
      {/* Card controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
        <button 
          className="flex items-center gap-1 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-full"
          onClick={() => handleResetCard()}
          title="Reset card position"
        >
          <RefreshCw size={16} />
          <span>Reset</span>
        </button>
        
        <button 
          className="flex items-center gap-1 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-full"
          onClick={() => navigate('/signup')}
          title="Save card design"
        >
          <Share2 size={16} />
          <span>Save & Share</span>
        </button>
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
