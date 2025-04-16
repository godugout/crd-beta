import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import CardDisplay from './viewer-components/CardDisplay';
import ViewerControls from './viewer-components/ViewerControls';
import InfoPanel from './viewer-components/InfoPanel';
import MiniActionBar from '@/components/ui/MiniActionBar';
import { useCardInteraction } from '@/hooks/useCardInteraction';
import CardEffectsPanel from './viewer-components/CardEffectsPanel';
import { useFeatureEnabled } from '@/hooks/useFeatureFlag';
import { Card } from '@/lib/types/cardTypes';

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

  const [featuresBarMinimized, setFeaturesBarMinimized] = useState(false);
  const [showExplodedView, setShowExplodedView] = useState(false);

  useEffect(() => {
    setPosition({ x: 10, y: 15 });
  }, [setPosition]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardControls);
    return () => {
      window.removeEventListener('keydown', handleKeyboardControls);
    };
  }, [handleKeyboardControls]);

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

  const handleToggleExplodedView = () => {
    setShowExplodedView(prev => !prev);
    
    if (!showExplodedView) {
      toast.info('Exploded view activated', {
        description: 'Explore the card layers in 3D'
      });
    } else {
      toast.info('Exploded view deactivated');
    }
  };

  const handleEffectToggle = (effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
    );
    
    setShowExplodedView(false);
    setTimeout(() => {
      setShowExplodedView(true);
    }, 100);
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
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-center">
        <div className={`${featuresBarMinimized ? 'w-20' : 'w-auto px-6'} transition-all duration-300 bg-gray-900/80 backdrop-blur-md rounded-b-lg`}>
          {featuresBarMinimized ? (
            <button 
              onClick={() => setFeaturesBarMinimized(false)}
              className="w-full py-2 text-white font-bold flex items-center justify-center hover:bg-gray-800/50 transition-colors"
            >
              CRD <ChevronDown size={16} className="ml-1" />
            </button>
          ) : (
            <div className="py-3 flex items-center space-x-4 relative">
              <button 
                onClick={() => setFeaturesBarMinimized(true)}
                className="absolute right-1 top-1 text-gray-400 hover:text-white p-1"
                aria-label="Minimize"
              >
                <ChevronUp size={18} />
              </button>
              
              <button 
                onClick={handleCardReset} 
                className="text-white hover:text-blue-300 transition-colors"
                title="Reset View"
              >
                Reset View
              </button>
              
              <button 
                onClick={() => setIsFlipped(!isFlipped)} 
                className={`text-white hover:text-blue-300 transition-colors ${isFlipped ? 'text-blue-400' : ''}`}
                title="Flip Card"
              >
                Flip Card
              </button>
              
              <button 
                onClick={toggleAutoRotation}
                className={`text-white hover:text-blue-300 transition-colors ${isAutoRotating ? 'text-blue-400' : ''}`}
                title="Auto Rotate"
              >
                Auto Rotate
              </button>
              
              <button 
                onClick={handleToggleExplodedView}
                className={`text-white hover:text-blue-300 transition-colors ${showExplodedView ? 'text-blue-400' : ''}`}
                title="Exploded View"
              >
                Exploded View
              </button>
              
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className={`text-white hover:text-blue-300 transition-colors ${showInfo ? 'text-blue-400' : ''}`}
                title="Info"
              >
                Info
              </button>
            </div>
          )}
        </div>
      </div>

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
          showExplodedView={showExplodedView}
        />
        
        <div className="absolute left-4 top-20 bottom-4 w-80 pointer-events-auto">
          <CardEffectsPanel 
            activeEffects={activeEffects}
            onToggleEffect={handleEffectToggle}
            onEffectIntensityChange={(effect, intensity) => {
              setEffectIntensities(prev => ({ ...prev, [effect]: intensity }));
            }}
            effectIntensities={effectIntensities}
          />
        </div>
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
      
      <MiniActionBar />
    </div>
  );
};

export default FullscreenViewer;
