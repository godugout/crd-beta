
import React, { forwardRef } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { cn } from '@/lib/utils';

interface CardPreviewProps {
  card: Partial<Card>;
  className?: string;
}

const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ 
  card, 
  className 
}, ref) => {
  // Determine which effects classes to apply
  const effectClasses = (card.effects || [])
    .map(effect => `effect-${effect}`)
    .join(' ');
  
  const cardStyle = card.designMetadata?.cardStyle || {};
  const textStyle = card.designMetadata?.textStyle || {};
  
  return (
    <div 
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-lg shadow-lg mx-auto card-preview", 
        effectClasses,
        className
      )}
      style={{
        width: '300px',
        height: '420px',
        borderRadius: cardStyle.borderRadius || '8px',
        borderWidth: cardStyle.borderWidth || 2,
        borderStyle: 'solid',
        borderColor: cardStyle.borderColor || '#000',
        backgroundColor: cardStyle.backgroundColor || '#fff',
      }}
    >
      {/* Card Image */}
      {card.imageUrl && (
        <div className="absolute inset-0 z-10">
          <img 
            src={card.imageUrl} 
            alt={card.title || 'Card'} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Card Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
        {card.title && (
          <h3 
            className="text-lg font-bold text-white mb-1"
            style={{
              color: textStyle.titleColor || '#fff',
              textAlign: (textStyle.titleAlignment as any) || 'center',
              fontWeight: textStyle.titleWeight || 'bold'
            }}
          >
            {card.title}
          </h3>
        )}
        
        {card.description && (
          <p 
            className="text-sm text-white/80"
            style={{
              color: textStyle.descriptionColor || 'rgba(255,255,255,0.8)'
            }}
          >
            {card.description}
          </p>
        )}
        
        {(card.player || card.team) && (
          <div className="flex justify-between mt-2 text-xs text-white/70">
            <span>{card.player}</span>
            <span>{card.team} {card.year}</span>
          </div>
        )}
      </div>
    </div>
  );
});

CardPreview.displayName = 'CardPreview';

export default CardPreview;
