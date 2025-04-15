
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardItemProps {
  card: Card;
  onClick?: () => void;
  activeEffects?: string[];
  showActions?: boolean;
  isSelected?: boolean;
  className?: string;
}

export const CardItem = React.memo(({ 
  card, 
  onClick, 
  activeEffects = [], 
  showActions = true,
  isSelected = false,
  className = ""
}: CardItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate css classes based on active effects
  const effectClasses = activeEffects.map(effect => 
    `effect-${effect.toLowerCase().replace(/\s+/g, '-')}`
  ).join(' ');
  
  return (
    <div 
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "aspect-[2.5/3.5] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800",
        effectClasses
      )}>
        <img 
          src={card.imageUrl || card.thumbnailUrl} 
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      {/* Card info */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white",
        "opacity-100 md:opacity-80 group-hover:opacity-100 transition-opacity duration-300"
      )}>
        <h3 className="font-medium text-sm truncate">{card.title}</h3>
        
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {card.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-xs bg-white/20 px-1.5 py-0.5 rounded-sm">
                {tag}
              </span>
            ))}
            {card.tags.length > 2 && (
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-sm">
                +{card.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Action buttons shown on hover */}
      {showActions && isHovered && (
        <div className="absolute top-2 right-2 flex gap-2 animate-fade-in">
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-black"
            onClick={(e) => {
              e.stopPropagation();
              // Like functionality would go here
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-black"
            onClick={(e) => {
              e.stopPropagation();
              // View details functionality 
              onClick?.();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
});

// Add display name for React Developer Tools
CardItem.displayName = 'CardItem';
