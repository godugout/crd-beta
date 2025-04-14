
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
    toggleAutoRotation
  } = useCardInteraction({ containerRef, cardRef });

  const [isFlipped, setIsFlipped] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>(['Refractor', 'Holographic']);
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

  // Track mouse position for effect rendering
  const [cardMousePosition, setCardMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardControls);
    return () => {
      window.removeEventListener('keydown', handleKeyboardControls);
    };
  }, [handleKeyboardControls]);

  const handleToggleFullscreen = () => {
    toast.info('Fullscreen toggle - feature coming soon');
  };

  const handleShare = () => {
    toast.info('Share feature coming soon');
  };

  const handleToggleEffect = (effectId: string) => {
    setActiveEffects(prev => 
      prev.includes(effectId) 
        ? prev.filter(id => id !== effectId)
        : [...prev, effectId]
    );
  };

  const handleEffectIntensityChange = (effectId: string, intensity: number) => {
    setEffectIntensities(prev => ({
      ...prev,
      [effectId]: intensity
    }));
  };

  const handleCardMouseMove = (e: React.MouseEvent) => {
    // Handle mouse movement on the card for interactive effects
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setCardMousePosition({ x, y });
    
    // Detect touch imprint areas
    const cornerSize = rect.width * 0.2;
    const isCorner = x > 0.8 && y < 0.2; // Top right corner
    const isCenter = x > 0.4 && x < 0.6 && y > 0.4 && y < 0.6; // Center
    
    // Update active touch areas
    setTouchImprintAreas(prev => prev.map(area => {
      if (area.id === 'flip-corner') return { ...area, active: isCorner };
      if (area.id === 'zoom-center') return { ...area, active: isCenter };
      return area;
    }));
    
    // Trigger actions based on touch areas
    if (isCorner) {
      // Highlight the corner as an interactive element
      cardRef.current.classList.add('corner-highlight');
    } else {
      cardRef.current.classList.remove('corner-highlight');
    }
    
    // Pass the original event to the card movement handler
    handleMouseMove(e);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Detect click on touch imprint areas
    const cornerSize = rect.width * 0.2;
    const isCorner = x > 0.8 && y < 0.2; // Top right corner
    const isCenter = x > 0.4 && x < 0.6 && y > 0.4 && y < 0.6; // Center
    
    if (isCorner) {
      // Flip card on corner tap
      setIsFlipped(!isFlipped);
      toast.info(`Card ${isFlipped ? 'front' : 'back'} view`);
    } else if (isCenter) {
      // Zoom on center tap
      handleZoomIn();
    }
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
        onMouseMove={handleCardMouseMove}
        onClick={handleCardClick}
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
          mousePosition={cardMousePosition}
          touchImprintAreas={touchImprintAreas}
        />
        
        {/* Effects panel */}
        <CardEffectsPanel 
          activeEffects={activeEffects}
          onToggleEffect={handleToggleEffect}
          onEffectIntensityChange={handleEffectIntensityChange}
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
