
import React from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface CardGridItemProps {
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
        "group cursor-pointer overflow-hidden rounded-lg transition-all hover:shadow-md",
        className
      )}
      onClick={() => onClick?.()}
    >
      <div className="relative aspect-[2.5/3.5] overflow-hidden rounded-lg">
        <img 
          src={card.thumbnailUrl || card.imageUrl} 
          alt={card.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/assets/placeholder-card.png';
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <h3 className="text-sm font-medium line-clamp-1">{card.title}</h3>
          
          {card.tags && card.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {card.tags.slice(0, 2).map((tag, idx) => (
                <span 
                  key={idx}
                  className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
              
              {card.tags.length > 2 && (
                <span className="text-xs opacity-75">+{card.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium line-clamp-1">{card.title}</h3>
        {card.rarity && (
          <div className="mt-1 text-xs text-muted-foreground">
            {card.rarity.toString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardGridItem;
