
import React from 'react';
import { Card } from '@/lib/types';

interface InfoPanelProps {
  card: Card;
  showInfo: boolean;
}

const InfoPanel = ({ card, showInfo }: InfoPanelProps) => {
  if (!showInfo) return null;

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm rounded-lg p-4 shadow-lg text-white max-w-xs">
      <h3 className="text-lg font-bold mb-3">{card.title}</h3>
      <div className="space-y-2 text-sm">
        {card.description && (
          <p className="text-gray-300">{card.description}</p>
        )}
        <div className="pt-2">
          {card.rarity && (
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Rarity:</span>
              <span>{card.rarity}</span>
            </div>
          )}
          {card.year && (
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Year:</span>
              <span>{card.year}</span>
            </div>
          )}
          {card.collectionId && (
            <div className="flex justify-between">
              <span className="text-gray-400">Collection:</span>
              <span>{card.collectionId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
