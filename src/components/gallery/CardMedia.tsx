
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CardImage } from '@/components/cards/CardImage';
import { CardInfoOverlay } from '@/components/cards/CardInfoOverlay';

interface CardMediaProps {
  card: Card;
  onView: (cardId: string) => void;
  className?: string;
}

const CardMedia: React.FC<CardMediaProps> = ({ card, onView, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClick = () => {
    if (onView) onView(card.id);
  };

  // Determine image URL with fallback
  const imageUrl = card.imageUrl || card.thumbnailUrl;

  return (
    <div 
      className={cn("relative overflow-hidden rounded-lg aspect-[2.5/3.5] cursor-pointer group", className)}
      onClick={handleClick}
    >
      {/* Loading state */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-gray-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center text-gray-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 mx-auto mb-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <p>Failed to load image</p>
          </div>
        </div>
      )}

      {/* The card image */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={card.title || "Card"} 
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          loading="lazy"
        />
      )}

      <CardInfoOverlay card={card} />
    </div>
  );
};

export default CardMedia;
