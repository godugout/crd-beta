
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface CardInfoOverlayProps {
  /**
   * Card data to display info from
   */
  card: Card;
  
  /**
   * Optional classNames to apply to the container
   */
  className?: string;
  
  /**
   * Whether to only show on hover
   * @default true
   */
  showOnHover?: boolean;
  
  /**
   * Maximum number of tags to show
   * @default 2
   */
  maxTags?: number;
}

/**
 * Glass-like overlay for displaying card information
 */
export const CardInfoOverlay: React.FC<CardInfoOverlayProps> = ({
  card,
  className,
  showOnHover = true,
  maxTags = 2,
}) => {
  const tags = card.tags || [];
  
  return (
    <div 
      className={cn(
        "absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-3 text-white",
        showOnHover ? "transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" : "",
        className
      )}
    >
      <h3 className="font-medium text-sm line-clamp-1">{card.title}</h3>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.slice(0, maxTags).map((tag, index) => (
            <span key={index} className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {tags.length > maxTags && (
            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
              +{tags.length - maxTags}
            </span>
          )}
        </div>
      )}
      
      {card.description && (
        <p className="text-xs mt-1 line-clamp-2 text-white/90">{card.description}</p>
      )}
    </div>
  );
};
