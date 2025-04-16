
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import CardDisplay from './viewer-components/CardDisplay';
import ViewerControls from './viewer-components/ViewerControls';
import InfoPanel from './viewer-components/InfoPanel';
import KeyboardShortcuts from './viewer-components/KeyboardShortcuts';
import { useCardInteraction } from '@/hooks/useCardInteraction';
import CardEffectsPanel from './viewer-components/CardEffectsPanel';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { cards, getCardById } = useCards();
  const card = getCardById ? getCardById(cardId) : cards.find(c => c.id === cardId);
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const {
    position,
    zoom,
    isAutoRotating,
    isDragging,
    mousePosition,
    setIsDragging,
    handleMouseMove,
    handleCardReset,
    handleKeyboardControls,
    handleZoomIn,
    handleZoomOut,
    toggleAutoRotation,
    setPosition,
    setupWheelListener
  } = useCardInteraction({ containerRef, cardRef });

  const [isFlipped, setIsFlipped] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({
    Holographic: 0.7,
    Refractor: 0.8,
    Chrome: 0.6,
    Vintage: 0.5,
  });
  const [touchImprintAreas, setTouchImprintAreas] = useState([
    { id: 'flip-corner', active: false },
    { id: 'zoom-center', active: false },
    { id: 'rotate-edges', active: false }
  ]);

  // Set initial rotation to make stacked cards visible
  useEffect(() => {
    setPosition({ x: 10, y: 15 });
  }, [setPosition]);

  // Setup keyboard controls
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardControls);
    return () => {
      window.removeEventListener('keydown', handleKeyboardControls);
    };
  }, [handleKeyboardControls]);

  // Setup wheel event listener for zoom/rotation
  useEffect(() => {
    const cleanup = setupWheelListener();
    return () => {
      if (cleanup) cleanup();
    };
  }, [setupWheelListener]);

  const handleToggleFullscreen = () => {
    toast.info('Fullscreen toggle - feature coming soon');
  };

  const handleShare = () => {
    toast.info('Share feature coming soon');
  };

  if (!card) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-lg">Card not found</div>
        <button 
          className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center overflow-hidden z-10"
        onMouseMove={handleMouseMove}
      >
        <CardDisplay
          card={card}
          rotation={position}
          isFlipped={isFlipped}
          zoom={zoom}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          cardRef={cardRef}
          containerRef={containerRef}
          isAutoRotating={isAutoRotating}
          activeEffects={activeEffects}
          effectIntensities={effectIntensities}
          mousePosition={mousePosition}
          touchImprintAreas={touchImprintAreas}
        />
        
        <CardEffectsPanel 
          activeEffects={activeEffects}
          onToggleEffect={effect => {
            setActiveEffects(prev => 
              prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
            );
          }}
          onEffectIntensityChange={(effect, intensity) => {
            setEffectIntensities(prev => ({ ...prev, [effect]: intensity }));
          }}
          effectIntensities={effectIntensities}
        />
      </div>

      <ViewerControls
        isFlipped={isFlipped}
        isAutoRotating={isAutoRotating}
        showInfo={showInfo}
        onFlipCard={() => setIsFlipped(!isFlipped)}
        onToggleAutoRotation={toggleAutoRotation}
        onToggleInfo={() => setShowInfo(!showInfo)}
        onToggleFullscreen={handleToggleFullscreen}
        onShare={handleShare}
        onClose={onClose}
      />

      <InfoPanel card={card} showInfo={showInfo} />
      
      <KeyboardShortcuts />
    </div>
  );
};

export default FullscreenViewer;
