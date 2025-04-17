
import React from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CardPreviewProps {
  card: Card;
  onClick?: () => void;
  className?: string;
  showDetails?: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  onClick,
  className,
  showDetails = true
}) => {
  return (
    <div 
      className={cn("relative group cursor-pointer overflow-hidden rounded-lg", className)}
      onClick={onClick}
    >
      <div className="aspect-[2.5/3.5] overflow-hidden relative">
        {card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-white opacity-60">{card.title}</span>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {showDetails && (
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-semibold text-sm truncate">{card.title}</h3>
          {card.team && (
            <p className="text-xs text-gray-300">{card.team}</p>
          )}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {card.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-xs bg-white/20 px-1.5 py-0.5 rounded-sm">
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
      )}
    </div>
  );
};

export default CardPreview;
