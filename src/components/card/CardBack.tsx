
import React from 'react';
import { format } from 'date-fns';
import { Card, FabricSwatch } from '@/lib/types';

interface CardBackProps {
  card: Card;
  fabricSwatches?: FabricSwatch[];
}

const CardBack: React.FC<CardBackProps> = ({ card, fabricSwatches }) => {
  const getSwatchProperty = (swatch: FabricSwatch | undefined, property: keyof FabricSwatch) => {
    return swatch && property in swatch ? swatch[property] : undefined;
  };

  return (
    <div className="card-face card-back absolute inset-0 bg-gray-100 rounded-lg shadow-lg overflow-hidden select-none transform rotateY-180">
      <div className="absolute inset-0 p-5 flex flex-col">
        <h3 className="font-bold text-cardshow-dark text-lg mb-2">{card.title}</h3>
        
        {card.description && (
          <p className="text-cardshow-slate text-sm flex-grow overflow-y-auto mb-4">
            {card.description}
          </p>
        )}
        
        <div className="space-y-2 text-xs text-cardshow-slate">
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex bg-gray-200 text-cardshow-dark px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-2 flex justify-between">
            <span>ID: {card.id.slice(0, 8)}</span>
            <span>Created: {format(new Date(card.createdAt), 'MMM d, yyyy')}</span>
          </div>
          
          {fabricSwatches && fabricSwatches.length > 0 && (
            <div className="border-t border-gray-200 pt-2">
              <p className="font-medium text-cardshow-dark mb-1">Fabric Swatches:</p>
              {fabricSwatches.map((swatch, index) => (
                <div key={index} className="text-xs ml-2">
                  <div>Year: {getSwatchProperty(swatch, 'year')} | Team: {getSwatchProperty(swatch, 'team')} | Position: {getSwatchProperty(swatch, 'position')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export as both named and default
export { CardBack };
export default CardBack;
