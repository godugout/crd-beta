
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { toast } from 'sonner';
import ScrollableGallery from '../immersive-viewer/ScrollableGallery';
import CardDisplay from './viewer-components/CardDisplay';
import ViewerControls from './viewer-components/ViewerControls';
import InfoPanel from './viewer-components/InfoPanel';
import KeyboardShortcuts from './viewer-components/KeyboardShortcuts';
import { X } from 'lucide-react';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { cards, getCardById } = useCards();
  const card = getCardById ? getCardById(cardId) : cards.find(c => c.id === cardId);
  const navigate = useNavigate();
  const { isMobile } = useMobileOptimization();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, rotation: 0 });
  const [zoom, setZoom] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const moveStep = 10;
    const rotationStep = 5;
    const zoomStep = 0.1;
    const maxZoom = 3.0;
    const minZoom = 0.5;

    switch (e.key) {
      case 'ArrowUp':
        setCardPosition(prev => ({ ...prev, y: prev.y - moveStep }));
        e.preventDefault();
        break;
      case 'ArrowDown':
        setCardPosition(prev => ({ ...prev, y: prev.y + moveStep }));
        e.preventDefault();
        break;
      case 'ArrowLeft':
        setCardPosition(prev => ({ ...prev, x: prev.x - moveStep }));
        e.preventDefault();
        break;
      case 'ArrowRight':
        setCardPosition(prev => ({ ...prev, x: prev.x + moveStep }));
        e.preventDefault();
        break;
      case '[':
        setCardPosition(prev => ({ ...prev, rotation: prev.rotation - rotationStep }));
        e.preventDefault();
        break;
      case ']':
        setCardPosition(prev => ({ ...prev, rotation: prev.rotation + rotationStep }));
        e.preventDefault();
        break;
      case 'r':
      case 'R':
        handleCardReset();
        e.preventDefault();
        break;
      case 'f':
      case 'F':
        setIsFlipped(prev => !prev);
        e.preventDefault();
        break;
      case 'i':
      case 'I':
        setShowInfo(prev => !prev);
        e.preventDefault();
        break;
      case '+':
      case '=':
        setZoom(prev => Math.min(maxZoom, prev + zoomStep));
        e.preventDefault();
        break;
      case '-':
      case '_':
        setZoom(prev => Math.max(minZoom, prev - zoomStep));
        e.preventDefault();
        break;
      case 'a':
      case 'A':
        setIsAutoRotating(prev => !prev);
        e.preventDefault();
        break;
      case 'Escape':
        if (showInfo) {
          setShowInfo(false);
        } else {
          handleClose();
        }
        e.preventDefault();
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !isAutoRotating) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    if (cardRef.current) {
      const rotationX = (y - 0.5) * -10;
      const rotationY = (x - 0.5) * 10;
      
      cardRef.current.style.transform = `
        perspective(1000px) 
        rotateX(${rotationX}deg) 
        rotateY(${rotationY}deg)
        scale(${zoom})
      `;
    }
  }, [zoom, isAutoRotating]);

  const handleCardReset = () => {
    setCardPosition({ x: 0, y: 0, rotation: 0 });
    setZoom(1);
    toast.info('Card position reset');
  };

  const handleCardClick = (newCardId: string) => {
    navigate(`/view/${newCardId}`);
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
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
      onMouseMove={handleMouseMove}
    >
      <CardDisplay
        card={card}
        rotation={cardPosition}
        isFlipped={isFlipped}
        zoom={zoom}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        cardRef={cardRef}
        containerRef={containerRef}
        isAutoRotating={isAutoRotating}
      />

      <ViewerControls
        isFlipped={isFlipped}
        isAutoRotating={isAutoRotating}
        showInfo={showInfo}
        onFlipCard={() => setIsFlipped(!isFlipped)}
        onToggleAutoRotation={() => setIsAutoRotating(!isAutoRotating)}
        onToggleInfo={() => setShowInfo(!showInfo)}
        onClose={onClose}
      />

      <InfoPanel card={card} showInfo={showInfo} />
      
      <KeyboardShortcuts />
      
      <ScrollableGallery 
        cards={cards}
        currentCardId={card.id}
        onCardClick={handleCardClick}
        className="fixed bottom-0 left-0 right-0 z-40"
      />
    </div>
  );
};

export default FullscreenViewer;
