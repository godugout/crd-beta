
import React from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CardGridItemProps {
  card: Card;
  onClick?: () => void;
  className?: string;
}

const CardGridItem: React.FC<CardGridItemProps> = ({ 
  card, 
  onClick,
  className
}) => {
  return (
    <div 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <div className="aspect-[2.5/3.5] rounded-lg overflow-hidden bg-gray-100 mb-2">
        {card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt={card.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`Failed to load image: ${card.imageUrl}`);
              e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Image+Not+Found';
            }} 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            No Image
          </div>
        )}
      </div>
      <h3 className="font-medium text-sm truncate">{card.title}</h3>
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {card.tags.slice(0, 2).map((tag, i) => (
            <span 
              key={i} 
              className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full"
            >
              {tag}
            </span>
          ))}
          {card.tags.length > 2 && (
            <span className="text-xs text-muted-foreground">
              +{card.tags.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CardGridItem;
