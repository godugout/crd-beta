
// Create a missing CardDetailed component to fix error in CardDetail.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/lib/types';
import { Share2, Edit, Trash, Eye, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CardDetailedProps {
  card: Card;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  className?: string;
}

const CardDetailed: React.FC<CardDetailedProps> = ({
  card,
  onEdit,
  onShare,
  onDelete,
  onView,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-8", className)}>
      <div className="md:col-span-1">
        <div className="aspect-[2.5/3.5] relative rounded-lg overflow-hidden bg-gray-100 shadow-md">
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-full object-cover"
          />
          {card.effects && card.effects.length > 0 && (
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
              <Star className="inline-block w-3 h-3 mr-1" /> 
              {card.effects[0]}
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-4 gap-2">
          {onView && (
            <Button onClick={onView} variant="outline" className="flex-1">
              <Eye className="mr-2 h-4 w-4" />
              View Full
            </Button>
          )}
          
          {onShare && (
            <Button onClick={onShare} variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="md:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{card.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {card.tags && card.tags.map((tag, i) => (
              <span 
                key={i} 
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {card.description && (
          <div className="prose max-w-none">
            <p>{card.description}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Rarity</h3>
            <p className="mt-1">{card.rarity || 'Common'}</p>
          </div>
          
          {card.player && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Player</h3>
              <p className="mt-1">{card.player}</p>
            </div>
          )}
          
          {card.team && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Team</h3>
              <p className="mt-1">{card.team}</p>
            </div>
          )}
          
          {card.year && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Year</h3>
              <p className="mt-1">{card.year}</p>
            </div>
          )}
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex gap-3 pt-4 border-t">
            {onEdit && (
              <Button onClick={onEdit} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Card
              </Button>
            )}
            
            {onDelete && (
              <Button onClick={onDelete} variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetailed;
