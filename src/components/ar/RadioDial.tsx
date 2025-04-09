
import React from 'react';
import { Card } from '@/lib/types';

interface RadioDialProps {
  cards: Card[];
  activeCardId: string | null;
  onSelectCard: (id: string) => void;
}

const RadioDial: React.FC<RadioDialProps> = ({
  cards,
  activeCardId,
  onSelectCard
}) => {
  if (cards.length <= 1) return null;

  return (
    <div className="radio-dial">
      {cards.map((card) => (
        <div 
          key={card.id}
          className={`radio-dial-item transition-all ${activeCardId === card.id ? 'active' : ''}`}
          onClick={() => onSelectCard(card.id)}
        />
      ))}
    </div>
  );
};

export default RadioDial;
