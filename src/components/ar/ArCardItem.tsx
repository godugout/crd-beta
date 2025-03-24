
import React, { useRef } from 'react';
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
}

const ArCardItem: React.FC<ArCardItemProps> = ({
  card,
  index,
  isSelected,
  onSelect
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { effectClass, handleDoubleTap } = useArCardEffects(index, isSelected, cardRef);
  
  // Handle selection
  const handleSelect = () => {
    onSelect(card.id);
  };

  return (
    <div 
      ref={cardRef}
      className={`pointer-events-auto transition-all duration-300 ${isSelected ? 'shadow-lg ring-2 ring-blue-500' : ''} 
                 ${effectClass}`}
      style={{
        width: '150px',
        height: '210px',
        transformOrigin: 'center',
        touchAction: 'none',
        zIndex: isSelected ? 10 : 1,
        transition: isSelected ? 'box-shadow 0.3s ease, transform 0.3s ease' : 'transform 0.3s ease',
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
      <CardShineEffect />
      
      {/* Selection highlight */}
      {isSelected && <SelectionIndicator />}
    </div>
  );
};

export default ArCardItem;
