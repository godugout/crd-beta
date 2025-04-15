
import React from 'react';
import { CardData } from '@/types/card';

interface CardFrontProps {
  card: CardData;
}

const CardFront: React.FC<CardFrontProps> = ({ card }) => {
  return (
    <div className="card-face card-front w-full h-full rounded-lg overflow-hidden">
      {/* Main card image */}
      {card.imageUrl && (
        <img
          src={card.imageUrl}
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}
      
      {/* Card content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
        {/* Top area with title */}
        <div>
          <h3 className="text-white text-lg font-bold">{card.title}</h3>
          {card.player && (
            <p className="text-white/80 text-sm">{card.player}</p>
          )}
        </div>
        
        {/* Bottom area with additional details */}
        <div className="mt-auto">
          {card.team && (
            <p className="text-white/80 text-sm mb-1">{card.team}</p>
          )}
          
          {card.year && (
            <p className="text-white/80 text-xs">{card.year}</p>
          )}
          
          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {card.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-white/20 text-white px-1.5 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
              {card.tags.length > 3 && (
                <span className="text-xs bg-white/20 text-white px-1.5 py-0.5 rounded">
                  +{card.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardFront;
