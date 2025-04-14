
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, RefreshCw, Smartphone, RotateCw, Share2, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { CardData } from '@/types/card';
import { toast } from 'sonner';
import CardViewer from '@/components/home/CardViewer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useCardEffects } from '@/hooks/useCardEffects';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import RelatedCardsSlider from '../card-viewer/RelatedCardsSlider';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { cards } = useCards();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [currentTab, setCurrentTab] = useState('view');
  const { shouldOptimizeAnimations } = useMobileOptimization();
  
  const currentCardIdRef = useRef<string>(cardId);
  const preloadImagesRef = useRef<HTMLDivElement>(null);
  
  // Get related cards based on tags and artist
  const relatedCards = useCallback(() => {
    if (!selectedCard) return [];
    
    return cards.filter(card => 
      card.id !== selectedCard.id && 
      (card.tags?.some(tag => selectedCard.tags?.includes(tag)) || 
       card.userId === selectedCard.userId)
    ).slice(0, 8);
  }, [selectedCard, cards]);
  
  // Get similar style cards
  const similarStyleCards = useCallback(() => {
    if (!selectedCard) return [];
    
    // Filter cards with similar visual style
    return cards.filter(card => 
      card.id !== selectedCard.id && 
      card.designMetadata?.cardStyle?.borderRadius === selectedCard.designMetadata?.cardStyle?.borderRadius
    ).slice(0, 4);
  }, [selectedCard, cards]);
  
  const { 
    cardEffects, 
    toggleEffect, 
    setCardEffects
  } = useCardEffects(
    cards, 
    shouldOptimizeAnimations,
    { initialEffects: { [cardId]: ['Refractor', 'Holographic'] } }
  );
  
  // Make sure default effects are applied for better visibility
  useEffect(() => {
    if (selectedCard && (!cardEffects[selectedCard.id] || cardEffects[selectedCard.id].length === 0)) {
      setCardEffects(selectedCard.id, ['Refractor', 'Holographic']);
    }
  }, [selectedCard, cardEffects, setCardEffects]);
  
  const activeEffects = selectedCard ? (cardEffects[selectedCard.id] || ['Refractor', 'Holographic']) : [];

  useEffect(() => {
    currentCardIdRef.current = cardId;
    
    const card = cards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      const index = cards.findIndex(c => c.id === cardId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    const docElement = document.documentElement;
    if (docElement.requestFullscreen) {
      docElement.requestFullscreen()
        .catch(err => {
          console.warn('Error attempting to enable fullscreen:', err);
        });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      
      if (document.fullscreenElement) {
        document.exitFullscreen()
          .catch(err => {
            console.warn('Error attempting to exit fullscreen:', err);
          });
      }
    };
  }, [cardId, cards, onClose]);

  useKeyboardShortcut('ArrowLeft', navigateToPrevious);
  useKeyboardShortcut('ArrowRight', navigateToNext);
  useKeyboardShortcut(' ', toggleFlip);

  useEffect(() => {
    if (cards.length <= 1 || !preloadImagesRef.current) return;
    
    const preloadContainer = preloadImagesRef.current;
    preloadContainer.innerHTML = '';
    
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    const nextIndex = (currentIndex + 1) % cards.length;
    
    [prevIndex, nextIndex].forEach(index => {
      if (index !== currentIndex && cards[index]) {
        const img = document.createElement('img');
        img.src = cards[index].imageUrl;
        img.style.display = 'none';
        preloadContainer.appendChild(img);
      }
    });
  }, [currentIndex, cards]);

  function toggleFlip() {
    setIsFlipped(!isFlipped);
  }

  function navigateToNext() {
    if (currentIndex < cards.length - 1) {
      const nextCard = cards[currentIndex + 1];
      setSelectedCard(nextCard);
      setCurrentIndex(currentIndex + 1);
    } else {
      const firstCard = cards[0];
      setSelectedCard(firstCard);
      setCurrentIndex(0);
    }
  }

  function navigateToPrevious() {
    if (currentIndex > 0) {
      const prevCard = cards[currentIndex - 1];
      setSelectedCard(prevCard);
      setCurrentIndex(currentIndex - 1);
    } else {
      const lastCard = cards[cards.length - 1];
      setSelectedCard(lastCard);
      setCurrentIndex(cards.length - 1);
    }
  }

  const takeScreenshot = () => {
    toast.success('Screenshot saved to your gallery', {
      description: 'Card image has been saved with current effects'
    });
  };
  
  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
    toast.success(autoRotate ? 'Auto-rotation disabled' : 'Auto-rotation enabled');
  };
  
  const shareCard = () => {
    toast.success('Share link copied to clipboard', {
      description: 'You can now paste and share the link with friends'
    });
  };

  const handleToggleEffect = useCallback((effect: string) => {
    if (selectedCard) {
      toggleEffect(selectedCard.id, effect);
    }
  }, [selectedCard, toggleEffect]);

  const convertToCardData = useCallback((card: Card): CardData => {
    return {
      id: parseInt(card.id),
      name: card.title,
      imageUrl: card.imageUrl,
      description: card.description,
      team: card.tags?.[0] || '',
      year: new Date(card.createdAt).getFullYear().toString(),
      cardType: card.tags?.[1] || 'Standard',
      artist: card.userId || 'Unknown',
      set: card.collectionId || 'Personal Collection',
      cardNumber: card.id.slice(0, 6),
      specialEffect: activeEffects[0] || 'Standard',
      jersey: '',
      backgroundColor: '#000',
      textColor: '#fff',
      fabricSwatches: card.designMetadata?.cardStyle?.fabricSwatches || []
    };
  }, [activeEffects]);

  const launchArMode = () => {
    if (selectedCard) {
      onClose();
      window.location.href = `/ar-card-viewer/${selectedCard.id}`;
    }
  };

  if (!selectedCard) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-white rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-950 to-black z-50">
      <div ref={preloadImagesRef} className="hidden"></div>
      
      <ErrorBoundary>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="h-screen w-screen flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={navigateToPrevious}
            className="absolute left-4 md:left-8 text-white hover:bg-white/10 h-12 w-12 z-20"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={navigateToNext}
            className="absolute right-4 md:right-8 text-white hover:bg-white/10 h-12 w-12 z-20"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="w-full max-w-6xl">
            <Tabs defaultValue="view" value={currentTab} onValueChange={setCurrentTab} className="flex flex-col h-full">
              <TabsList className="mx-auto bg-gray-900/40 backdrop-blur-md mb-4">
                <TabsTrigger value="view">View Card</TabsTrigger>
                <TabsTrigger value="related">Related Cards</TabsTrigger>
                <TabsTrigger value="details">Card Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="view" className="flex-1 overflow-hidden">
                <CardViewer
                  card={convertToCardData(selectedCard)}
                  isFlipped={isFlipped}
                  flipCard={toggleFlip}
                  onBackToCollection={onClose}
                  activeEffects={activeEffects}
                  onSnapshot={takeScreenshot}
                  autoRotate={autoRotate}
                />
              </TabsContent>
              
              <TabsContent value="related">
                <div className="p-4 bg-gray-900/40 backdrop-blur-md rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Related Cards</h3>
                  <RelatedCardsSlider cards={relatedCards()} onCardClick={(id) => {
                    setSelectedCard(cards.find(c => c.id === id) || null);
                    setCurrentTab('view');
                  }} />
                  
                  <h3 className="text-xl font-bold text-white mt-8 mb-4">Similar Style</h3>
                  <RelatedCardsSlider cards={similarStyleCards()} onCardClick={(id) => {
                    setSelectedCard(cards.find(c => c.id === id) || null);
                    setCurrentTab('view');
                  }} />
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <div className="p-6 bg-gray-900/40 backdrop-blur-md rounded-lg text-white">
                  <h2 className="text-2xl font-bold">{selectedCard.title}</h2>
                  <p className="mt-2 text-gray-300">{selectedCard.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h3 className="text-sm text-gray-400 uppercase">Collection</h3>
                      <p>{selectedCard.collectionId || 'Personal Collection'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 uppercase">Created</h3>
                      <p>{new Date(selectedCard.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm text-gray-400 uppercase">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCard.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-gray-800">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          {['Refractor', 'Holographic', 'Shimmer', 'Vintage', 'Gold Foil', 'Chrome'].map(effect => (
            <Button
              key={effect}
              variant={activeEffects.includes(effect) ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggleEffect(effect)}
              className={activeEffects.includes(effect) 
                ? "bg-blue-600 text-white" 
                : "bg-gray-900/60 border-white/20 text-white hover:bg-white/20"}
            >
              {effect}
            </Button>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="container mx-auto max-w-6xl flex justify-between items-center">
            <div className="text-white">
              <h3 className="text-xl font-bold">{selectedCard.title}</h3>
              <p className="text-sm text-gray-400">
                {currentIndex + 1} of {cards.length} • {selectedCard.userId || 'Unknown Artist'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="bg-gray-900/60 border-white/20 text-white hover:bg-white/20"
                onClick={toggleAutoRotate}
              >
                <RotateCw className={`h-4 w-4 mr-2 ${autoRotate ? 'animate-spin' : ''}`} style={{animationDuration: '3s'}} />
                <span>{autoRotate ? 'Stop Rotation' : 'Auto Rotate'}</span>
              </Button>
              
              <Button 
                variant="outline"
                className="bg-gray-900/60 border-white/20 text-white hover:bg-white/20"
                onClick={toggleFlip}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>Flip</span>
              </Button>
              
              <Button 
                variant="outline"
                className="bg-gray-900/60 border-white/20 text-white hover:bg-white/20"
                onClick={takeScreenshot}
              >
                <Camera className="h-4 w-4 mr-2" />
                <span>Screenshot</span>
              </Button>
              
              <Button 
                variant="outline"
                className="bg-gray-900/60 border-white/20 text-white hover:bg-white/20"
                onClick={shareCard}
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span>Share</span>
              </Button>
              
              <Button 
                variant="default"
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={launchArMode}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                <span>View in AR</span>
              </Button>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default FullscreenViewer;
