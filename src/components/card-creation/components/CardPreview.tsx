
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/lib/types/cardTypes';

interface CardPreviewProps {
  card?: Partial<Card>;
  className?: string;
  effectClasses?: string;
}

const CardPreview = React.forwardRef<HTMLDivElement, CardPreviewProps>(({
  card,
  className,
  effectClasses = ''
}, ref) => {
  if (!card || !card.imageUrl) {
    return (
      <div 
        ref={ref}
        className={cn(
          "aspect-[2.5/3.5] bg-gray-100 rounded-lg border flex flex-col items-center justify-center text-gray-400",
          className
        )}
      >
        <p className="text-center px-4">
          Upload an image to see your card preview
        </p>
      </div>
    );
  }
  
  // Use safe access for card style properties with defaults
  const cardStyle = card.designMetadata?.cardStyle || {};
  const textStyle = card.designMetadata?.textStyle || {};
  
  return (
    <div className="relative" ref={ref}>
      <div 
        className={cn(
          "aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-xl transition-all duration-300",
          effectClasses,
          className
        )}
        style={{
          backgroundColor: cardStyle.backgroundColor || '#FFFFFF',
          borderRadius: cardStyle.borderRadius || '8px',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: cardStyle.borderColor || '#000000',
        }}
      >
        <div className="relative w-full h-full">
          <img 
            src={card.imageUrl} 
            alt={card.title || "Card preview"} 
            className="w-full h-full object-cover"
          />
          
          {card.title && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <h3 
                className="text-white text-sm font-bold truncate"
                style={{ 
                  color: textStyle.titleColor || '#FFFFFF',
                  fontWeight: textStyle.titleWeight || 'bold',
                  textAlign: (textStyle.titleAlignment as any) || 'center'
                }}
              >
                {card.title}
              </h3>
              {card.player && (
                <p 
                  className="text-white/80 text-xs truncate"
                  style={{ 
                    color: textStyle.descriptionColor || '#DDDDDD',
                  }}
                >
                  {card.player}
                  {card.team && ` • ${card.team}`}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CardPreview.displayName = 'CardPreview';

export default CardPreview;
