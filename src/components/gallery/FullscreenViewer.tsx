
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import CardDisplay from './viewer-components/CardDisplay';
import ViewerControls from './viewer-components/ViewerControls';
import InfoPanel from './viewer-components/InfoPanel';
import KeyboardShortcuts from './viewer-components/KeyboardShortcuts';
import { useCardInteraction } from '@/hooks/useCardInteraction';

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

  const [isFlipped, setIsFlipped] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);

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

