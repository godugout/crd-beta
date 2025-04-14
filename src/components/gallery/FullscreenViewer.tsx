
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Share2, Maximize, Star, Rotate3D, Info } from 'lucide-react';
import { useCards } from '@/context/CardContext';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { toast } from 'sonner';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { getCardById } = useCards();
  const card = getCardById(cardId);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMobileOptimization();
  const navigate = useNavigate();
  
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Auto rotation effect
  useEffect(() => {
    let animationFrame: number;
    let angle = 0;
    
    const rotateCard = () => {
      if (!isAutoRotating || isDragging) return;
      
      angle += 0.3;
      if (cardRef.current) {
        const newY = 5 * Math.sin(angle / 20);
        const newX = 3 * Math.cos(angle / 30);
        setRotation({ x: newX, y: newY });
      }
      
      animationFrame = requestAnimationFrame(rotateCard);
    };
    
    animationFrame = requestAnimationFrame(rotateCard);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isAutoRotating, isDragging]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isAutoRotating) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation based on mouse position relative to card center
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
  
  const handleCardClick = () => {
    if (isMobile) {
      setIsFlipped(!isFlipped);
    }
  };
  
  const handleFlipCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share && card) {
      navigator.share({
        title: card.title || 'Check out this card',
        text: card.description || 'I found this amazing card!',
        url: window.location.href
      })
      .then(() => toast.success('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers without Web Share API
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
      {/* Card container */}
      <div 
        ref={cardRef}
        className={`relative transition-transform duration-700 transform-gpu ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
        onClick={handleCardClick}
      >
        {/* Front of card */}
        <div 
          className="relative w-72 sm:w-80 md:w-96 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl transform-gpu backface-hidden"
          style={{
            borderRadius: card.designMetadata?.cardStyle?.borderRadius || '12px',
            border: `${card.designMetadata?.cardStyle?.borderWidth || 2}px solid ${card.designMetadata?.cardStyle?.borderColor || 'rgba(255,255,255,0.2)'}`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
          }}
        >
          {/* Card image */}
          <img 
            src={card.imageUrl} 
            alt={card.title || 'Card'} 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay layers for effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Shine effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              backgroundPosition: `${50 + rotation.y * 2}% ${50 - rotation.x * 2}%`
            }}
          ></div>
          
          {/* Card information overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h2 className="font-bold text-xl mb-1">{card.title}</h2>
            {card.player && <p className="text-sm opacity-90">{card.player}</p>}
            {card.team && <p className="text-xs opacity-80">{card.team}</p>}
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className="absolute inset-0 w-72 sm:w-80 md:w-96 aspect-[2.5/3.5] rounded-xl bg-gray-800 p-4 transform-gpu rotate-y-180 backface-hidden"
          style={{
            borderRadius: card.designMetadata?.cardStyle?.borderRadius || '12px',
            border: `${card.designMetadata?.cardStyle?.borderWidth || 2}px solid ${card.designMetadata?.cardStyle?.borderColor || 'rgba(255,255,255,0.2)'}`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
          }}
        >
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
            
            <div className="flex-1 overflow-y-auto text-white/80 text-sm">
              <p className="mb-3">{card.description}</p>
              
              {card.player && (
                <div className="mb-2">
                  <span className="text-white/60 font-medium">Player: </span>
                  <span>{card.player}</span>
                </div>
              )}
              
              {card.team && (
                <div className="mb-2">
                  <span className="text-white/60 font-medium">Team: </span>
                  <span>{card.team}</span>
                </div>
              )}
              
              {card.year && (
                <div className="mb-2">
                  <span className="text-white/60 font-medium">Year: </span>
                  <span>{card.year}</span>
                </div>
              )}
              
              {card.tags && card.tags.length > 0 && (
                <div className="mt-4">
                  <span className="text-white/60 font-medium mb-1 block">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-white/10 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex space-x-3">
        <button 
          className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
          onClick={handleFlipCard}
          title="Flip card"
        >
          <ChevronLeft size={20} className={isFlipped ? "hidden" : ""} />
          <ChevronRight size={20} className={isFlipped ? "" : "hidden"} />
        </button>
        
        <button 
          className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
          onClick={toggleAutoRotation}
          title={isAutoRotating ? "Stop auto rotation" : "Start auto rotation"}
        >
          <Rotate3D size={20} className={isAutoRotating ? "text-primary" : "text-white"} />
        </button>
        
        <button 
          className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
          onClick={toggleInfo}
          title="Show card info"
        >
          <Info size={20} className={showInfo ? "text-primary" : "text-white"} />
        </button>
        
        <button 
          className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
          onClick={toggleFullscreen}
          title="Toggle fullscreen"
        >
          <Maximize size={20} />
        </button>
        
        <button 
          className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
          onClick={handleShare}
          title="Share card"
        >
          <Share2 size={20} />
        </button>
        
        <button 
          className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
          onClick={onClose}
          title="Close viewer"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Mini Action Bar */}
      <div className="absolute bottom-6 right-6">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 shadow-lg text-white text-xs max-w-xs">
          <h4 className="font-medium mb-2">Keyboard Shortcuts:</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>
              <kbd className="bg-gray-800 px-1 rounded">Arrow keys</kbd> 
              <span className="ml-1">Rotate</span>
            </div>
            <div>
              <kbd className="bg-gray-800 px-1 rounded">F</kbd> 
              <span className="ml-1">Flip card</span>
            </div>
            <div>
              <kbd className="bg-gray-800 px-1 rounded">R</kbd> 
              <span className="ml-1">Auto-rotate</span>
            </div>
            <div>
              <kbd className="bg-gray-800 px-1 rounded">Esc</kbd> 
              <span className="ml-1">Close</span>
            </div>
          </div>
          <div className="mt-3 text-gray-400 text-[10px]">
            Click and drag to manually rotate the card
          </div>
        </div>
      </div>
      
      {/* Card info panel */}
      {showInfo && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm rounded-lg p-4 shadow-lg text-white max-w-xs">
          <h3 className="text-lg font-bold mb-3">{card.title}</h3>
          <div className="space-y-2 text-sm">
            {card.description && (
              <p className="text-gray-300">{card.description}</p>
            )}
            <div className="pt-2">
              {card.rarity && (
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Rarity:</span>
                  <span>{card.rarity}</span>
                </div>
              )}
              {card.year && (
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Year:</span>
                  <span>{card.year}</span>
                </div>
              )}
              {card.collectionId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Collection:</span>
                  <span>{card.collectionId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullscreenViewer;
