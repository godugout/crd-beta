
import React from 'react';
import { CardData } from '@/types/card';

interface CardBackProps {
  card: CardData;
}

const CardBack: React.FC<CardBackProps> = ({ card }) => {
  return (
    <div className="card-back w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="p-4 h-full flex flex-col">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white">{card.title || card.name}</h3>
          {card.team && (
            <div className="text-sm text-white/70">
              {card.team} • {card.year}
            </div>
          )}
        </div>
        
        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            {/* Card description */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-1">Description</h4>
              <p className="text-sm text-white/70">{card.description || "No description available."}</p>
            </div>

            {/* Card details */}
            <div className="grid grid-cols-2 gap-2">
              {card.cardType && (
                <div>
                  <h4 className="text-xs font-medium text-white/80">Card Type</h4>
                  <p className="text-xs text-white/70">{card.cardType}</p>
                </div>
              )}
              
              {card.set && (
                <div>
                  <h4 className="text-xs font-medium text-white/80">Set</h4>
                  <p className="text-xs text-white/70">{card.set}</p>
                </div>
              )}
              
              {card.cardNumber && (
                <div>
                  <h4 className="text-xs font-medium text-white/80">Card #</h4>
                  <p className="text-xs text-white/70">{card.cardNumber}</p>
                </div>
              )}
              
              {card.artist && (
                <div>
                  <h4 className="text-xs font-medium text-white/80">Artist</h4>
                  <p className="text-xs text-white/70">{card.artist}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Card footer */}
          <div className="mt-4 pt-2 border-t border-white/10">
            {card.fabricSwatches && card.fabricSwatches.length > 0 ? (
              <div>
                <h4 className="text-xs font-medium text-white/80 mb-1">Fabric Swatches</h4>
                <div className="flex flex-wrap gap-1">
                  {card.fabricSwatches.map((swatch, index) => (
                    <div key={index} className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-xs">
                      {swatch.type}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-center text-white/50">
                {card.specialEffect || "Standard Card"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBack;
