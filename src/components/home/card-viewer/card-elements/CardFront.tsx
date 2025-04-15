
import React from 'react';
import { CardData } from '@/types/card';
import FabricSwatch from '@/components/home/card-effects/FabricSwatch';

interface CardFrontProps {
  card: CardData;
}

const CardFront: React.FC<CardFrontProps> = ({ card }) => {
  // Check if the card has fabric swatches (added in the metadata)
  const hasFabricSwatches = card.fabricSwatches && card.fabricSwatches.length > 0;
  
  return (
    <div className="card-front absolute inset-0 flex flex-col">
      {/* Card image */}
      <div className="relative w-full h-full overflow-hidden">
        {card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt={card.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400"
            style={{ backgroundColor: card.backgroundColor || '#f0f0f0' }}
          >
            No Image
          </div>
        )}
        
        {/* Render fabric swatches if available */}
        {hasFabricSwatches && card.fabricSwatches.map((swatch, index) => (
          <FabricSwatch
            key={index}
            fabricType={swatch.type}
            year={swatch.year}
            team={swatch.team}
            manufacturer={swatch.manufacturer}
            position={swatch.position as "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"}
            size={swatch.size as "small" | "medium" | "large"}
          />
        ))}
        
        {/* Card info overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-lg font-bold truncate">{card.name}</h3>
              <div className="text-xs opacity-90">{card.team}</div>
            </div>
            {card.jersey && (
              <div className="text-2xl font-bold">#{card.jersey}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFront;
