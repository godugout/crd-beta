
import React from 'react';
import { Card } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface InfoPanelProps {
  card: Card;
  showInfo: boolean;
}

const InfoPanel = ({ card, showInfo }: InfoPanelProps) => {
  if (!showInfo) return null;

  // Extract card metadata for display, with safe default values
  const cardMetadata = card.designMetadata?.cardMetadata || {};
  const marketMetadata = card.designMetadata?.marketMetadata || {};
  
  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm rounded-lg p-4 shadow-lg text-white max-w-xs">
      <h3 className="text-lg font-bold mb-2">{card.title}</h3>
      
      {card.description && (
        <p className="text-gray-300 mb-3 text-sm">{card.description}</p>
      )}
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {card.player && (
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Player</span>
              <span className="font-medium">{card.player}</span>
            </div>
          )}
          
          {card.team && (
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Team</span>
              <span className="font-medium">{card.team}</span>
            </div>
          )}
          
          {card.year && (
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Year</span>
              <span className="font-medium">{card.year}</span>
            </div>
          )}
          
          {cardMetadata && cardMetadata.cardNumber && (
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Card #</span>
              <span className="font-medium">{String(cardMetadata.cardNumber)}</span>
            </div>
          )}
          
          {card.rarity && (
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Rarity</span>
              <span className="font-medium">{card.rarity}</span>
            </div>
          )}
          
          {cardMetadata && cardMetadata.cardType && (
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Type</span>
              <span className="font-medium">{String(cardMetadata.cardType)}</span>
            </div>
          )}
          
          {cardMetadata && cardMetadata.series && (
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Series</span>
              <span className="font-medium">{String(cardMetadata.series)}</span>
            </div>
          )}
          
          {/* Check for artist in cardMetadata since 'artist' is not directly on Card type */}
          {cardMetadata && cardMetadata.artist && (
            <div className="flex flex-col col-span-2">
              <span className="text-gray-400 text-xs">Artist</span>
              <span className="font-medium">{String(cardMetadata.artist)}</span>
            </div>
          )}
        </div>
        
        {marketMetadata && marketMetadata.isPrintable !== undefined && (
          <div className="flex gap-2 flex-wrap pt-2">
            {marketMetadata.isPrintable && 
              <Badge variant="outline" className="bg-blue-900/40 text-xs">Printable</Badge>
            }
            {marketMetadata.isForSale && 
              <Badge variant="outline" className="bg-green-900/40 text-xs">For Sale</Badge>
            }
            {marketMetadata.includeInCatalog && 
              <Badge variant="outline" className="bg-purple-900/40 text-xs">In Catalog</Badge>
            }
          </div>
        )}
        
        {card.tags && card.tags.length > 0 && (
          <div className="pt-2">
            <span className="text-gray-400 text-xs block mb-1">Tags</span>
            <div className="flex gap-1 flex-wrap">
              {card.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs bg-gray-700/60">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {card.fabricSwatches && card.fabricSwatches.length > 0 && (
          <div className="pt-2">
            <span className="text-gray-400 text-xs block mb-1">Fabric Swatches</span>
            <div className="grid grid-cols-2 gap-2">
              {card.fabricSwatches.map((swatch, idx) => (
                <div key={idx} className="text-xs border border-gray-700 rounded p-1">
                  <div>{swatch.type} - {swatch.team}</div>
                  <div className="text-gray-400">{swatch.manufacturer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
