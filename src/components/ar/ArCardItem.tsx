
import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { useArCardEffects } from './hooks/useArCardEffects';
import CardShineEffect from './card-elements/CardShineEffect';
import SelectionIndicator from './card-elements/SelectionIndicator';
import '../home/card-effects/HolographicEffects.css';
import '../home/card-effects/SpectralEffects.css';
import '../home/card-effects/PremiumEffects.css';

interface ArCardItemProps {
  card: Card;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  effectIntensity?: number;
}

const ArCardItem: React.FC<ArCardItemProps> = ({
  card,
  index,
  isSelected,
  onSelect,
  effectIntensity = 0.7
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { effectClass, handleDoubleTap } = useArCardEffects(index, isSelected, cardRef);
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // When card is selected, apply a visual animation
  useEffect(() => {
    if (isSelected) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isSelected]);
  
  // Handle selection
  const handleSelect = () => {
    if (!isSelected) {
      // Add animation when selecting a card
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
      onSelect(card.id);
    }
  };
  
  // Touch handling for better mobile experience
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const diffX = Math.abs(touch.clientX - touchStart.x);
    const diffY = Math.abs(touch.clientY - touchStart.y);
    
    // If it's a tap (not a swipe), then select the card
    if (diffX < 10 && diffY < 10) {
      handleSelect();
    }
    
    setTouchStart(null);
  };

  return (
    <div 
      ref={cardRef}
      className={`pointer-events-auto relative transition-all duration-300 
                 ${isSelected ? 'shadow-xl ring-4 ring-blue-500 scale-110 z-10' : 'shadow-md hover:scale-105 hover:shadow-lg'} 
                 ${effectClass}
                 ${isAnimating ? 'animate-pulse-fast' : ''}
                 rounded-lg`}
      style={{
        width: '150px',
        height: '210px',
        transformOrigin: 'center',
        touchAction: 'none',
        transition: isSelected 
          ? 'box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease' 
          : 'transform 0.3s ease, box-shadow 0.3s ease',
        willChange: 'transform, filter, box-shadow',
        borderRadius: '8px',
        overflow: 'hidden',
        '--shimmer-speed': '3s',
        '--hologram-intensity': effectIntensity.toString(),
        '--motion-speed': '1',
        filter: isSelected ? 'brightness(1.1) contrast(1.05)' : 'none',
        position: 'relative', // Ensure proper stacking context
      } as React.CSSProperties}
      onClick={handleSelect}
      onDoubleClick={handleDoubleTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative z-10 w-full h-full">
        <img 
          src={card.imageUrl} 
          alt={card.title}
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
        
        {/* Add shine effect that follows pointer - moved to overlay on top of card */}
        <CardShineEffect intensity={isSelected ? 0.9 : 0.6} />
        
        {/* Selection highlight - now with higher z-index */}
        {isSelected && <SelectionIndicator pulseIntensity={0.8} />}
        
        {/* Effect layer that sits on top of the card */}
        <div className="absolute inset-0 z-15 pointer-events-none effect-surface">
          {/* This layer will contain any dynamic effects */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50"></div>
        </div>
      </div>
      
      {/* Card info tooltip on hover - only visible when not selected */}
      {!isSelected && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <p className="truncate font-medium">{card.title}</p>
        </div>
      )}
    </div>
  );
};

export default ArCardItem;
