
import React from 'react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date-utils';
import { EditActions } from './EditActions';

interface CardFrontProps {
  card: {
    imageUrl: string;
    title: string;
    createdAt: Date;
  };
  activeEffects: string[];
  onFlip: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const CardFront: React.FC<CardFrontProps> = ({ 
  card, 
  activeEffects,
  onFlip, 
  onShare, 
  onDelete 
}) => {
  // Build card front classes based on active effects
  const getCardFrontClasses = () => {
    const classes = ["card-front rounded-xl overflow-hidden shadow-card bg-white"];
    
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
    
    if (activeEffects.includes('Gold Foil')) {
      classes.push('card-gold-foil');
    }
    
    if (activeEffects.includes('Chrome')) {
      classes.push('card-chrome');
    }
    
    if (activeEffects.includes('Vintage')) {
      classes.push('card-vintage');
    }
    
    return cn(...classes);
  };

  const formattedDate = formatDate(card.createdAt);

  return (
    <div className={getCardFrontClasses()}>
      <div className="relative w-full h-full">
        <img
          src={card.imageUrl}
          alt={card.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold truncate">{card.title}</h3>
          
          {activeEffects.length > 0 && (
            <span className="text-xs text-white/90 bg-black/40 px-2 py-0.5 rounded-full">
              {activeEffects[0]}
            </span>
          )}
        </div>
        
        {/* Hover Actions */}
        <EditActions 
          onFlip={onFlip}
          onShare={onShare}
          onDelete={onDelete}
        />

        {/* Card indicator and created date */}
        <div className="absolute top-0 left-0 p-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-cardshow-slate shadow-subtle">
            {formattedDate}
          </div>
        </div>
        
        {/* Refractor effect overlay if active */}
        {activeEffects.includes('Refractor') && (
          <div className="absolute inset-0 pointer-events-none opacity-50 overflow-hidden rounded-xl">
            <div className="absolute inset-0 card-refractor"></div>
          </div>
        )}
      </div>
    </div>
  );
};
