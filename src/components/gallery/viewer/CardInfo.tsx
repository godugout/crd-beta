
import React from 'react';
import { ProcessedCard } from '@/lib/adapters/cardAdapter';

interface CardInfoProps {
  card: ProcessedCard;
}

const CardInfo: React.FC<CardInfoProps> = ({ card }) => {
  return (
    <div className="mt-4 p-4 text-white">
      <h2 className="text-xl font-bold">{card.title}</h2>
      {card.description && (
        <p className="mt-2 text-sm text-gray-300">{card.description}</p>
      )}
    </div>
  );
};

export default CardInfo;
