
import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import '../home/card-effects/HolographicEffects.css';
import '../home/card-effects/SpectralEffects.css';
import '../home/card-effects/PremiumEffects.css';

interface ArCardItemProps {
  card: Card;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ArCardItem: React.FC<ArCardItemProps> = ({
  card,
  index,
  isSelected,
  onSelect
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [effectIndex, setEffectIndex] = useState(index % 4);
  
  // Available effects
  const effects = [
    'card-holographic',
    'card-refractor',
    'spectral-hologram',
    'card-gold-foil'
  ];
  
  // Handle selection
  const handleSelect = () => {
    onSelect(card.id);
  };

  // Double tap to change effect
  const handleDoubleTap = (e: React.MouseEvent) => {
    if (isSelected) {
      setEffectIndex((effectIndex + 1) % effects.length);
      e.stopPropagation();
    }
  };

  // Apply floating animation when selected
  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.style.animation = 'float 6s ease-in-out infinite';
      
      // Add shimmer effect
      document.documentElement.style.setProperty('--shimmer-speed', '3s');
      document.documentElement.style.setProperty('--hologram-intensity', '0.8');
    }
  }, [isSelected]);

  return (
    <div 
      ref={cardRef}
      className={`pointer-events-auto transition-shadow ${isSelected ? 'shadow-lg ring-2 ring-blue-500' : ''} 
                 ${effects[effectIndex]} transition-all duration-300`}
      style={{
        width: '150px',
        height: '210px',
        transformOrigin: 'center',
        touchAction: 'none',
        zIndex: isSelected ? 10 : 1,
        transition: isSelected ? 'box-shadow 0.3s ease' : 'transform 0.3s ease',
        willChange: 'transform, opacity',
        borderRadius: '8px',
        overflow: 'hidden',
        '--shimmer-speed': '3s',
        '--hologram-intensity': '0.7',
        '--motion-speed': '1',
      } as React.CSSProperties}
      onClick={handleSelect}
      onDoubleClick={handleDoubleTap}
    >
      <img 
        src={card.imageUrl} 
        alt={card.title}
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
      
      {/* Add shine effect that follows pointer */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundSize: '200% 200%',
          backgroundPosition: 'var(--mouse-x, 0) var(--mouse-y, 0)',
        }}
      />
      
      {/* Selection highlight */}
      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-blue-500 ring-offset-0 pointer-events-none"></div>
      )}
    </div>
  );
};

export default ArCardItem;
