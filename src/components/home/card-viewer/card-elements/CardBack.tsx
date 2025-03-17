
import React from 'react';
import { CardData } from '@/types/card';

interface CardBackProps {
  card: CardData;
}

const CardBack: React.FC<CardBackProps> = ({ card }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl scale-x-[-1]">
      {card.set}
    </div>
  );
};

export default CardBack;
