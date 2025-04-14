
import React from 'react';
import { cn } from '@/lib/utils';

interface CardPreviewProps {
  cardData: any;
  effectClasses: string;
  className?: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  cardData,
  effectClasses,
  className
}) => {
  if (!cardData.imageUrl) {
    return (
      <div className={cn(
        "aspect-[2.5/3.5] bg-gray-100 rounded-lg border flex flex-col items-center justify-center text-gray-400",
        className
      )}>
        <p className="text-center px-4">
          Upload an image to see your card preview
        </p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div 
        className={cn(
          "aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-xl",
          effectClasses,
          className
        )}
        style={{
          backgroundColor: cardData.backgroundColor,
          borderRadius: cardData.borderRadius,
          borderColor: cardData.borderColor,
          borderWidth: '2px',
          borderStyle: 'solid',
        }}
      >
        <div className="relative w-full h-full">
          <img 
            src={cardData.imageUrl} 
            alt={cardData.title || "Card preview"} 
            className="w-full h-full object-cover"
          />
          
          {cardData.title && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <h3 className="text-white text-sm font-bold truncate">
                {cardData.title}
              </h3>
              {cardData.player && (
                <p className="text-white/80 text-xs truncate">
                  {cardData.player}
                  {cardData.team && ` • ${cardData.team}`}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {cardData.backImageUrl && (
        <div className="absolute top-2 right-2 w-16 h-16 rounded-md overflow-hidden border-2 border-white shadow-lg">
          <img 
            src={cardData.backImageUrl} 
            alt="Card back" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default CardPreview;
