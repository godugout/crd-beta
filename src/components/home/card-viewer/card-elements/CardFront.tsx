
import React from 'react';
import { CardData } from '@/types/card';

interface CardFrontProps {
  card: CardData;
}

const CardFront: React.FC<CardFrontProps> = ({ card }) => {
  return (
    <div className="card-face card-front w-full h-full rounded-lg overflow-hidden">
      {/* Card image background */}
      {card.imageUrl && (
        <div className="absolute inset-0">
          <img 
            src={card.imageUrl} 
            alt={card.title || 'Card Image'} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Card content overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col p-4">
        {/* Card header */}
        <div className="text-center mb-4">
          <h3 className="text-white text-lg font-bold">{card.title || card.name || 'Untitled'}</h3>
          {card.player && (
            <p className="text-white/80 text-sm">{card.player}</p>
          )}
        </div>
        
        {/* Card body - flex-grow to push footer to bottom */}
        <div className="flex-grow"></div>
        
        {/* Card footer */}
        <div className="mt-auto">
          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Card attributes */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {card.team && (
              <div>
                <span className="text-white/60 text-xs block">Team</span>
                <span className="text-white">{card.team}</span>
              </div>
            )}
            
            {card.year && (
              <div>
                <span className="text-white/60 text-xs block">Year</span>
                <span className="text-white">{card.year}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFront;
