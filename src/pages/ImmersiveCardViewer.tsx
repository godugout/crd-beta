
import React, { useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import { useParams } from 'react-router-dom';
import { useCardContext } from '@/context/CardContext';

const ImmersiveCardViewer = ({ card: initialCard }: { card: Card }) => {
  const { id } = useParams();
  const { getCardById } = useCardContext();
  const [card, setCard] = useState<Card>(initialCard);
  
  useEffect(() => {
    if (id) {
      const foundCard = getCardById(id);
      if (foundCard) {
        setCard(foundCard);
      }
    }
  }, [id, getCardById]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{card.title}</h2>
      <div className="bg-gray-100 rounded-lg p-6">
        {card.imageUrl && (
          <img 
            src={card.imageUrl} 
            alt={card.title} 
            className="w-full h-auto mb-4 rounded"
          />
        )}
        
        {card.description && (
          <p className="text-gray-700 mb-4">{card.description}</p>
        )}
        
        {/* Display card stats if available */}
        {card.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {card.stats.battingAverage && (
              <div className="stat-item">
                <span className="text-sm text-gray-500">Batting Average</span>
                <span className="block text-lg font-medium">{card.stats.battingAverage}</span>
              </div>
            )}
            {card.stats.homeRuns && (
              <div className="stat-item">
                <span className="text-sm text-gray-500">Home Runs</span>
                <span className="block text-lg font-medium">{card.stats.homeRuns}</span>
              </div>
            )}
            {card.stats.rbis && (
              <div className="stat-item">
                <span className="text-sm text-gray-500">RBIs</span>
                <span className="block text-lg font-medium">{card.stats.rbis}</span>
              </div>
            )}
            {card.stats.era && (
              <div className="stat-item">
                <span className="text-sm text-gray-500">ERA</span>
                <span className="block text-lg font-medium">{card.stats.era}</span>
              </div>
            )}
            {card.stats.wins && (
              <div className="stat-item">
                <span className="text-sm text-gray-500">Wins</span>
                <span className="block text-lg font-medium">{card.stats.wins}</span>
              </div>
            )}
            {card.stats.strikeouts && (
              <div className="stat-item">
                <span className="text-sm text-gray-500">Strikeouts</span>
                <span className="block text-lg font-medium">{card.stats.strikeouts}</span>
              </div>
            )}
            {card.stats.careerYears && (
              <div className="stat-item">
                <span className="text-sm text-gray-500">Career Years</span>
                <span className="block text-lg font-medium">{card.stats.careerYears}</span>
              </div>
            )}
            {card.stats.ranking && (
              <div className="stat-item">
                <span className="text-sm text-gray-500">Ranking</span>
                <span className="block text-lg font-medium">{card.stats.ranking}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImmersiveCardViewer;
