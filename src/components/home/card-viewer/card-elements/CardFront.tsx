
import React from 'react';
import { CardData } from '@/types/card';

interface CardFrontProps {
  card: CardData;
}

const CardFront: React.FC<CardFrontProps> = ({ card }) => {
  return (
    <>
      {card.imageUrl ? (
        <img 
          src={card.imageUrl} 
          alt={card.name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
            {card.name}
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            #{card.jersey}
          </div>
        </>
      )}
    </>
  );
};

export default CardFront;
