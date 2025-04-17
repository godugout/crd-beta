
import React from 'react';
import { Card } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy } from 'lucide-react';

interface CardBackProps {
  card: Card;
}

const CardBack = ({ card }: CardBackProps) => {
  // Get card properties safely
  const { designMetadata } = card;
  const player = typeof card.player === 'string' ? card.player : '';
  const team = typeof card.team === 'string' ? card.team : '';
  const year = typeof card.year === 'string' ? card.year : '';
  
  // Extract other metadata safely
  const cardAttributes: Record<string, React.ReactNode> = {};
  
  if (year) cardAttributes.year = year;
  
  // Add more attributes if they exist in the card or its metadata
  if (designMetadata && designMetadata.cardMetadata) {
    const { cardMetadata } = designMetadata;
    if (typeof cardMetadata.cardType === 'string') cardAttributes.cardType = cardMetadata.cardType;
    if (typeof cardMetadata.series === 'string') cardAttributes.series = cardMetadata.series;
    if (typeof cardMetadata.category === 'string') cardAttributes.category = cardMetadata.category;
  }
  
  // Additional safe extractions
  const cardRarity = card.rarity ? String(card.rarity) : 'Standard';
  const cardSeries = designMetadata?.cardMetadata?.series || 'Core Set';
  
  return (
    <div className="absolute inset-0 flex flex-col p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" style={{ zIndex: 5 }}>
      {/* Card content - ensure it's highly visible */}
      <div className="relative z-10 flex flex-col h-full text-white">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            {card.title}
          </h2>
          {team && (
            <div className="flex justify-center items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
                {team}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Card details */}
        <div className="space-y-4 flex-grow">
          {card.description && (
            <p className="text-sm text-gray-300 text-center italic">
              "{card.description}"
            </p>
          )}
          
          <div className="grid grid-cols-3 gap-4 text-center">
            {player && (
              <div>
                <Award className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                <span className="text-xs text-gray-400 block">Player</span>
                <span className="text-sm">{player}</span>
              </div>
            )}
            
            {cardRarity && (
              <div>
                <Star className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                <span className="text-xs text-gray-400 block">Type</span>
                <span className="text-sm">{cardRarity}</span>
              </div>
            )}
            
            {cardSeries && (
              <div>
                <Trophy className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                <span className="text-xs text-gray-400 block">Set</span>
                <span className="text-sm">{cardSeries}</span>
              </div>
            )}
          </div>
          
          {Object.keys(cardAttributes).length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Attributes</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(cardAttributes).map(([key, value]) => (
                  value && (
                    <Badge 
                      key={key}
                      variant="secondary" 
                      className="bg-white/10 backdrop-blur-sm"
                    >
                      {key}: {String(value)}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/20 text-center">
          <p className="text-xs text-gray-400">
            {designMetadata?.cardMetadata?.cardType && `#${designMetadata.cardMetadata.cardType}`} • {year || 'Classic'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardBack;

