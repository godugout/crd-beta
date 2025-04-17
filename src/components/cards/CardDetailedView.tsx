
import React from 'react';
import { CardDetailedViewCard } from '@/hooks/useCardDetail';

export interface CardDetailedViewProps {
  card: CardDetailedViewCard;
  onEdit: () => void;
  onShare: () => void;
  onDelete: () => void;
  onView: () => void;
}

const CardDetailedView: React.FC<CardDetailedViewProps> = ({ 
  card, 
  onEdit, 
  onShare, 
  onDelete, 
  onView 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 lg:w-2/5">
          <div className="aspect-[2.5/3.5] relative rounded-lg overflow-hidden">
            <img 
              src={card.imageUrl} 
              alt={card.title} 
              className="w-full h-full object-cover cursor-pointer"
              onClick={onView}
            />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-700 mb-6">{card.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {card.player && <div><span className="font-medium">Player:</span> {card.player}</div>}
            {card.team && <div><span className="font-medium">Team:</span> {card.team}</div>}
            {card.year && <div><span className="font-medium">Year:</span> {card.year}</div>}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {card.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <Button onClick={onEdit}>Edit Card</Button>
            <Button variant="outline" onClick={onShare}>Share Card</Button>
            <Button variant="destructive" onClick={onDelete}>Delete Card</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import Button here to avoid circular dependencies
import { Button } from '@/components/ui/button';

export default CardDetailedView;
