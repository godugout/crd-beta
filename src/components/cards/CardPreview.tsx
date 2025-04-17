
import React from 'react';
import { Card } from '@/lib/types/card';
import { cn } from '@/lib/utils';

interface CardPreviewProps {
  card: Card;
  onClick?: () => void;
  className?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  aspectRatio?: 'portrait' | 'square';
}

const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  onClick,
  className,
  showTitle = true,
  showDescription = false,
  aspectRatio = 'portrait'
}) => {
  const imageUrl = card.thumbnailUrl || card.imageUrl;
  
  return (
    <div 
      className={cn(
        'group relative bg-background border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg',
        onClick && 'cursor-pointer hover:scale-[1.02]',
        aspectRatio === 'portrait' ? 'aspect-[2.5/3.5]' : 'aspect-square',
        className
      )}
      onClick={onClick}
    >
      <div className="w-full h-full relative">
        <img 
          src={imageUrl} 
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay gradient for text visibility */}
        {showTitle && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-3 px-3">
            <h3 className="font-medium text-white line-clamp-1">
              {card.title}
            </h3>
            
            {showDescription && card.description && (
              <p className="text-xs text-gray-200 line-clamp-2 mt-1">
                {card.description}
              </p>
            )}
          </div>
        )}
        
        {/* Effects badge */}
        {card.effects && card.effects.length > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-primary/80 backdrop-blur text-white text-xs rounded-full px-2 py-0.5">
              {card.effects.length} {card.effects.length === 1 ? 'Effect' : 'Effects'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPreview;
