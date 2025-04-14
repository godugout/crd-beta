
import React from 'react';
import { CardData } from '@/types/card';

interface CardFrontProps {
  card: CardData;
}

const CardFront: React.FC<CardFrontProps> = ({ card }) => {
  return (
    <div className="card-face absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden">
      {/* Card background with proper opacity - fixing black card issue */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-700/20 to-gray-900/30"></div>
      
      {/* Card image */}
      <img 
        src={card.imageUrl} 
        alt={card.title || 'Card'} 
        className="w-full h-full object-cover z-10" 
      />
      
      {/* Card info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent z-20">
        <h3 className="font-bold text-white text-lg truncate">{card.title}</h3>
        {card.player && (
          <p className="text-white/80 text-sm truncate">
            {card.player}
            {card.team && ` • ${card.team}`}
          </p>
        )}
        {card.year && (
          <p className="text-white/60 text-xs">
            {card.year}
          </p>
        )}
      </div>
      
      {/* Card shine effect */}
      <div className="card-highlight absolute inset-0 z-30 pointer-events-none"></div>
    </div>
  );
};

export default CardFront;
