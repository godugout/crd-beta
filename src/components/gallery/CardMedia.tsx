
import React from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CardImage } from '@/components/cards/CardImage';
import { CardInfoOverlay } from '@/components/cards/CardInfoOverlay';

interface CardMediaProps {
  card: Card;
  onView: (cardId: string) => void;
  className?: string;
}

const CardMedia: React.FC<CardMediaProps> = ({ card, onView, className = '' }) => {
  const handleClick = () => {
    if (onView) onView(card.id);
  };

  return (
    <div 
      className={cn("relative overflow-hidden rounded-lg aspect-[2.5/3.5] cursor-pointer group", className)}
      onClick={handleClick}
    >
      <CardImage card={card} />
      <CardInfoOverlay card={card} />
    </div>
  );
};

export default CardMedia;
