
import React, { useState, useEffect } from 'react';
import { X, RefreshCw, KeyboardIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/lib/types';
import { useCards } from '@/context/CardContext';
import Card3DRenderer from './Card3DRenderer';
import CardEffectsProcessor from './CardEffectsProcessor';
import CardShopBackground from './CardShopBackground';
import CardControlsPanel from './CardControlsPanel';
import CardMetadataPanel from './CardMetadataPanel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImmersiveCardViewerProps {
  isOpen: boolean;
  cardId?: string;
  onClose: () => void;
}

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({ 
  isOpen, 
  cardId,
  onClose 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedEffects, setSelectedEffects] = useState<string[]>(['holographic']);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [backgroundStyle, setBackgroundStyle] = useState<'grid' | 'shop' | 'minimal'>('grid');
  const [isOffCenter, setIsOffCenter] = useState(false);
  
  const { id: routeId } = useParams();
  const { cards } = useCards();
  const navigate = useNavigate();
  
  const activeCardId = cardId || routeId;
  const currentCard = cards?.find(card => card.id === activeCardId);
  const currentCardIndex = cards?.findIndex(card => card.id === activeCardId) ?? -1;

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          navigateToPrevious();
          break;
        case 'ArrowRight':
          navigateToNext();
          break;
        case 'f':
        case 'F':
          toggleFlip();
          break;
        case 'r':
        case 'R':
          resetCardPosition();
          break;
        case 'Escape':
          onClose();
          break;
        case 'k':
        case 'K':
          toggleKeyboardShortcuts();
          break;
        case 'b':
        case 'B':
          cycleBackground();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentCardIndex]);

  const navigateToNext = () => {
    if (!cards || cards.length <= 1) return;
    
    const nextIndex = (currentCardIndex + 1) % cards.length;
    navigate(`/card/${cards[nextIndex].id}`);
  };

  const navigateToPrevious = () => {
    if (!cards || cards.length <= 1) return;
    
    const prevIndex = (currentCardIndex - 1 + cards.length) % cards.length;
    navigate(`/card/${cards[prevIndex].id}`);
  };

  const toggleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const resetCardPosition = () => {
    // This will trigger a reset in the Card3DRenderer component
    setIsOffCenter(false);
  };

  const toggleKeyboardShortcuts = () => {
    setShowKeyboardShortcuts(prev => !prev);
  };

  const cycleBackground = () => {
    setBackgroundStyle(prev => {
      switch (prev) {
        case 'grid':
          return 'shop';
        case 'shop':
          return 'minimal';
        case 'minimal':
        default:
          return 'grid';
      }
    });
  };

  const toggleEffect = (effect: string) => {
    setSelectedEffects(prev => {
      if (prev.includes(effect)) {
        return prev.filter(e => e !== effect);
      } else {
        return [...prev, effect];
      }
    });
  };

  if (!currentCard) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'} bg-[#1A1F2C] overflow-hidden`}>
      {/* Close button */}
      <button 
        className="absolute top-4 right-4 z-50 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
        onClick={onClose}
        aria-label="Close viewer"
      >
        <X className="h-6 w-6" />
      </button>
      
      {/* Reset position button - only shown when card is off-center */}
      {isOffCenter && (
        <button 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors animate-pulse"
          onClick={resetCardPosition}
          aria-label="Reset card position"
        >
          <RefreshCw className="h-8 w-8" />
        </button>
      )}
      
      {/* Background */}
      <CardShopBackground style={backgroundStyle} />
      
      {/* 3D Card Renderer with Effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Card3DRenderer 
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={toggleFlip}
          onOffCenter={setIsOffCenter}
        >
          <CardEffectsProcessor effects={selectedEffects} />
        </Card3DRenderer>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-3xl px-4">
        <CardControlsPanel 
          isFlipped={isFlipped}
          onFlip={toggleFlip}
          effects={selectedEffects}
          onToggleEffect={toggleEffect}
          onShowKeyboardShortcuts={toggleKeyboardShortcuts}
          backgroundStyle={backgroundStyle}
          onCycleBackground={cycleBackground}
        />
      </div>
      
      {/* Card Metadata Panel */}
      <div className="absolute top-0 right-0 h-full w-72 transform transition-transform duration-300 ease-in-out">
        <CardMetadataPanel card={currentCard} />
      </div>
      
      {/* Previous/Next navigation buttons */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <button 
          className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
          onClick={navigateToPrevious}
          aria-label="Previous card"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <button 
          className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
          onClick={navigateToNext}
          aria-label="Next card"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {/* Keyboard shortcuts dialog */}
      <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-2 py-2">
            <div className="flex items-center gap-2 mb-4">
              <KeyboardIcon className="h-5 w-5" />
              <h3 className="text-lg font-medium">Keyboard Controls</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                <span>←/→</span>
                <span className="text-muted-foreground">Previous/Next card</span>
              </div>
              <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                <span>F</span>
                <span className="text-muted-foreground">Flip card</span>
              </div>
              <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                <span>R</span>
                <span className="text-muted-foreground">Reset position</span>
              </div>
              <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                <span>B</span>
                <span className="text-muted-foreground">Change background</span>
              </div>
              <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                <span>K</span>
                <span className="text-muted-foreground">Show keyboard shortcuts</span>
              </div>
              <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                <span>Esc</span>
                <span className="text-muted-foreground">Close viewer</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImmersiveCardViewer;
