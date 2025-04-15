
import React from 'react';
import { CardData } from '@/types/card';

interface CardBackProps {
  card: CardData;
}

const CardBack: React.FC<CardBackProps> = ({ card }) => {
  return (
    <div className="card-face card-back w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col p-4 scale-x-[-1]">
      {/* Card back design */}
      <div className="flex flex-col h-full">
        {/* Title and details */}
        <div className="text-center mb-4">
          <h3 className="text-white text-lg font-bold">{card.title || card.name || 'Untitled'}</h3>
          {card.player && (
            <p className="text-white/80 text-sm">{card.player}</p>
          )}
        </div>
        
        {/* Card description */}
        <div className="flex-grow overflow-auto px-2 text-white/90 text-sm">
          <p>{card.description || 'No description available.'}</p>
        </div>
        
        {/* Card attributes */}
        <div className="mt-4 border-t border-white/20 pt-3">
          <div className="grid grid-cols-2 gap-2">
            {card.team && (
              <div>
                <span className="text-white/60 text-xs block">Team</span>
                <span className="text-white text-sm">{card.team}</span>
              </div>
            )}
            
            {card.year && (
              <div>
                <span className="text-white/60 text-xs block">Year</span>
                <span className="text-white text-sm">{card.year}</span>
              </div>
            )}
          </div>
          
          {/* Card ID/Serial number */}
          <div className="mt-3 text-center">
            <span className="text-white/40 text-xs">Card #{typeof card.id === 'string' ? card.id.substring(0, 8) : card.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBack;
