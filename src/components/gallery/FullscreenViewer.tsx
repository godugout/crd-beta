import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import CardDisplay from './viewer-components/CardDisplay';
import ViewerControls from './viewer-components/ViewerControls';
import KeyboardShortcuts from './viewer-components/KeyboardShortcuts';
import LayerMonitor from './viewer-components/LayerMonitor';
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

  const [isFlipped, setIsFlipped] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [cardMousePosition, setCardMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [showControls, setShowControls] = useState(false);
  const [layerStatus, setLayerStatus] = useState([
    { name: 'Base Card', loaded: false, timestamp: 0 },
    { name: 'Texture', loaded: false, timestamp: 0 },
    { name: 'Overlay', loaded: false, timestamp: 0 }
  ]);

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

  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setCardMousePosition({ x, y });
    handleMouseMove(e);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const isCorner = x > 0.8 && y < 0.2;
    const isCenter = x > 0.4 && x < 0.6 && y > 0.4 && y < 0.6;
    
    if (isCorner) {
      setIsFlipped(!isFlipped);
      toast.info(`Card ${isFlipped ? 'front' : 'back'} view`);
    } else if (isCenter) {
      handleZoomIn();
    }
  };

  const updateLayerStatus = (layerName: string, loaded: boolean) => {
    setLayerStatus(prev => prev.map(layer => {
      if (layer.name === layerName) {
        return {
          ...layer,
          loaded,
          timestamp: performance.now()
        };
      }
      return layer;
    }));
  };

  const toggleControls = () => {
    setShowControls(prev => !prev);
    toast.info(showControls ? 'Controls hidden' : 'Controls visible');
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
          mousePosition={mousePosition}
          onLayerLoad={updateLayerStatus}
        />
      </div>

      <ViewerControls
        isFlipped={isFlipped}
        isAutoRotating={isAutoRotating}
        onFlipCard={() => setIsFlipped(!isFlipped)}
        onToggleAutoRotation={toggleAutoRotation}
        onToggleControls={toggleControls}
        onClose={onClose}
      />

      {showControls && (
        <>
          <KeyboardShortcuts />
          <LayerMonitor 
            isVisible={true}
            layers={layerStatus}
          />
        </>
      )}
    </div>
  );
};

export default FullscreenViewer;
