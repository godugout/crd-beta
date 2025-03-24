
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCards } from '@/context/CardContext';
import '../components/home/card-effects/index.css';
import { CardFront } from './card/CardFront';
import { CardBack } from './card/CardBack';

interface CardItemProps {
  card: Card;
  className?: string;
  onClick?: () => void;
  activeEffects?: string[];
}

const CardItem: React.FC<CardItemProps> = ({ 
  card, 
  className, 
  onClick, 
  activeEffects = [] 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { deleteCard } = useCards();
  
  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Share API is not available in all browsers
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description,
        url: window.location.href,
      })
        .then(() => toast.success('Card shared successfully'))
        .catch((error) => console.error('Error sharing card:', error));
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCard(card.id);
  };
  
  return (
    <div 
      className={cn(
        "card-container relative w-full aspect-[2.5/3.5] cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("card-inner w-full h-full", isFlipped ? "flipped" : "")}>
        {/* Card Front */}
        <CardFront 
          card={card}
          activeEffects={activeEffects}
          onFlip={handleFlip}
          onShare={handleShare}
          onDelete={handleDelete}
        />
        
        {/* Card Back */}
        <CardBack card={card} />
      </div>
    </div>
  );
};

export default CardItem;
