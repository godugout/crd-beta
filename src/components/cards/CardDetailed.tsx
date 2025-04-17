
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CardImage } from './CardImage';
import { Award, Calendar, FileText, Hash, Info, MapPin, Tag, User } from 'lucide-react';

export interface CardDetailedProps {
  card: Card;
  className?: string;
  onBack?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

// Helper function to check if a value is a safe ReactNode
const isSafeReactNode = (value: any): boolean => {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    React.isValidElement(value) ||
    (Array.isArray(value) && value.every(isSafeReactNode))
  );
};

// Helper function to safely convert values to ReactNode
const safeToReactNode = (value: any): React.ReactNode => {
  if (isSafeReactNode(value)) {
    return value as React.ReactNode;
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
};

const CardDetailed: React.FC<CardDetailedProps> = ({
  card,
  className,
  onBack,
  showActions = true,
  onEdit,
  onDelete,
  onShare
}) => {
  const [showMore, setShowMore] = useState(false);
  const { designMetadata } = card;

  // Function to toggle the "show more" state
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className={cn("rounded-lg overflow-hidden bg-white shadow-md", className)}>
      {/* Card image */}
      <div className="relative">
        <CardImage
          card={card}
          className="w-full"
          priority={true}
          fill={false}
          // Remove aspectRatio prop as it's not defined in the CardImageProps interface
        />
        
        {/* Back button */}
        {onBack && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 left-2 bg-black/20 hover:bg-black/40 text-white"
            onClick={onBack}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </Button>
        )}
      </div>
      
      {/* Card details */}
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold">{card.title}</h1>
        
        {/* Card description */}
        {card.description && (
          <p className="mt-2 text-gray-600">{card.description}</p>
        )}
        
        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {card.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Card metadata details */}
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">Card Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Rarity */}
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-600">Rarity:</span>
              <span className="text-sm font-medium">{card.rarity}</span>
            </div>
            
            {/* Creator */}
            {card.userId && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Creator ID:</span>
                <span className="text-sm font-medium">{card.userId}</span>
              </div>
            )}
            
            {/* Created date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Created:</span>
              <span className="text-sm font-medium">
                {new Date(card.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {/* Player - safely render */}
            {card.player && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600">Player:</span>
                <span className="text-sm font-medium">
                  {safeToReactNode(card.player)}
                </span>
              </div>
            )}
            
            {/* Team - safely render */}
            {card.team && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">Team:</span>
                <span className="text-sm font-medium">
                  {safeToReactNode(card.team)}
                </span>
              </div>
            )}
            
            {/* Year - safely render */}
            {card.year && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Year:</span>
                <span className="text-sm font-medium">
                  {safeToReactNode(card.year)}
                </span>
              </div>
            )}
            
            {/* Collection ID */}
            {card.collectionId && (
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-500" />
                <span className="text-sm text-gray-600">Collection:</span>
                <span className="text-sm font-medium">{card.collectionId}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="mt-6 flex flex-wrap gap-2">
            {onEdit && (
              <Button onClick={onEdit} variant="outline" size="sm">
                Edit Card
              </Button>
            )}
            
            {onShare && (
              <Button onClick={onShare} variant="outline" size="sm">
                Share Card
              </Button>
            )}
            
            {onDelete && (
              <Button onClick={onDelete} variant="destructive" size="sm">
                Delete Card
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetailed;
