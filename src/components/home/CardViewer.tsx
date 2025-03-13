
import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, ArrowRight, Camera } from 'lucide-react';
import { CardData } from '@/types/card';
import { toast } from 'sonner';
import './CardEffects.css';

interface CardViewerProps {
  card: CardData;
  isFlipped: boolean;
  flipCard: () => void;
  onBackToCollection: () => void;
  activeEffects: string[];
  onSnapshot: () => void;
}

const CardViewer = ({ 
  card, 
  isFlipped, 
  flipCard, 
  onBackToCollection, 
  activeEffects,
  onSnapshot
}: CardViewerProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMoving, setIsMoving] = useState(false);

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !containerRef.current) return;
    
    setIsMoving(true);
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to center (values between -1 and 1)
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    // Apply rotation based on mouse position (max 15 degrees)
    const rotateY = relativeX * 15;
    const rotateX = -relativeY * 15;
    
    cardRef.current.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    
    // Adjust holographic effect based on angle
    if (activeEffects.includes('Classic Holographic') && cardRef.current) {
      const shine = cardRef.current.querySelector('.card-holographic::before') as HTMLElement;
      if (shine) {
        const shinePositionX = 50 + relativeX * 50;
        shine.style.backgroundPosition = `${shinePositionX}% 0`;
      }
    }
  };

  // Reset card position when mouse leaves
  const handleMouseLeave = () => {
    if (cardRef.current) {
      setIsMoving(false);
      cardRef.current.style.transform = '';
    }
  };

  const getCardClasses = () => {
    const classes = [
      'w-64 h-96 relative transition-all duration-300 rounded-lg shadow-xl overflow-hidden',
      isFlipped ? 'scale-x-[-1]' : '',
      isMoving ? 'mouse-move' : 'dynamic-card'
    ];
    
    if (activeEffects.includes('Classic Holographic')) {
      classes.push('card-holographic');
    }
    
    if (activeEffects.includes('Refractor')) {
      classes.push('card-refractor');
    }
    
    if (activeEffects.includes('Prismatic')) {
      classes.push('card-prismatic');
    }
    
    if (activeEffects.includes('Electric')) {
      classes.push('card-electric');
    }
    
    return classes.join(' ');
  };

  const getFilterStyle = () => {
    let filterStyle: React.CSSProperties = {};
    
    // Apply filters based on active effects
    if (activeEffects.includes('Classic Holographic')) {
      filterStyle = {
        ...filterStyle,
        filter: 'contrast(1.1) brightness(1.1) saturate(1.3)',
      };
    }
    
    if (activeEffects.includes('Refractor')) {
      filterStyle = {
        ...filterStyle,
        borderRadius: '12px',
      };
    }
    
    if (activeEffects.includes('Prismatic')) {
      filterStyle = {
        ...filterStyle,
        borderRadius: '12px',
      };
    }
    
    // Add card base color
    filterStyle.backgroundColor = card.backgroundColor;
    
    return filterStyle;
  };

  const handleSnapshot = () => {
    onSnapshot();
    toast.success('Snapshot captured!', {
      description: 'Effect combination saved to gallery'
    });
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
      
      {/* Card container with 3D perspective */}
      <div 
        ref={containerRef}
        className="card-3d-container relative w-80 h-[450px] flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card representation */}
        <div 
          ref={cardRef}
          className={getCardClasses()}
          style={getFilterStyle()}
        >
          {!isFlipped ? (
            card.imageUrl ? (
              <img 
                src={card.imageUrl} 
                alt={card.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                {card.name}
              </div>
            )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl scale-x-[-1]">
              {card.set}
            </div>
          )}
          
          {!isFlipped && !card.imageUrl && (
            <div className="absolute bottom-4 left-4 text-white">
              #{card.jersey}
            </div>
          )}
        </div>
      </div>
      
      {/* Flip button */}
      <button 
        className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
        onClick={flipCard}
      >
        <RotateCw className="h-6 w-6" />
      </button>
      
      {/* Return to collection button */}
      <button 
        className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
        onClick={onBackToCollection}
      >
        <ArrowRight className="h-6 w-6 rotate-180" />
      </button>

      {/* Snapshot button */}
      <button 
        className="absolute bottom-4 right-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm group"
        onClick={handleSnapshot}
      >
        <Camera className="h-6 w-6 group-hover:text-blue-500 transition-colors" />
        <span className="sr-only">Take Snapshot</span>
      </button>

      {activeEffects.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1.5 rounded-full text-xs font-medium">
          {activeEffects.length} effect{activeEffects.length !== 1 ? 's' : ''} active
        </div>
      )}

      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-xs text-white opacity-60 rotate-[-90deg] origin-center">
        Move your mouse over the card
      </div>
    </div>
  );
};

export default CardViewer;
