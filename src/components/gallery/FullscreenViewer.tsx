import React, { useState, useRef, useEffect } from 'react';
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMobileOptimization();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isAutoRotating) return;
    
    const cardElement = cardRef.current;
    const rect = cardElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 15;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!cardRef.current || isAutoRotating || !isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastPosition.x;
    const deltaY = touch.clientY - lastPosition.y;
    
    setRotation(prev => ({
      x: prev.x - deltaY / 5,
      y: prev.y + deltaX / 5
    }));
    
    setLastPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setIsAutoRotating(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleCardClick = (newCardId: string) => {
    navigate(`/view/${newCardId}`);
  };

  const handleFlipCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share && card) {
      try {
        await navigator.share({
          title: card.title || 'Check out this card',
          text: card.description || 'I found this amazing card!',
          url: window.location.href
        });
        toast.success('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  const toggleAutoRotation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoRotating(!isAutoRotating);
  };

  const toggleInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
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
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <CardDisplay
        card={card}
        rotation={rotation}
        isFlipped={isFlipped}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      <ViewerControls
        isFlipped={isFlipped}
        isAutoRotating={isAutoRotating}
        showInfo={showInfo}
        onFlipCard={handleFlipCard}
        onToggleAutoRotation={toggleAutoRotation}
        onToggleInfo={toggleInfo}
        onToggleFullscreen={toggleFullscreen}
        onShare={handleShare}
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
