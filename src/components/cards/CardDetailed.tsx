
import React from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Share2, Trash2 } from 'lucide-react';
import CardThumbnail from './CardThumbnail';
import { DetailedViewCard } from '@/types/detailedCardTypes';

export interface CardDetailedProps {
  /**
   * Card data to display
   */
  card: Card | DetailedViewCard;
  
  /**
   * Optional className for styling
   */
  className?: string;
  
  /**
   * Function to call when "View" button is clicked
   */
  onView?: (cardId: string) => void;
  
  /**
   * Function to call when "Edit" button is clicked
   */
  onEdit?: (cardId: string) => void;
  
  /**
   * Function to call when "Share" button is clicked
   */
  onShare?: (cardId: string) => void;
  
  /**
   * Function to call when "Delete" button is clicked
   */
  onDelete?: (cardId: string) => void;
  
  /**
   * Whether to enable special effects for the card
   */
  enableEffects?: boolean;
  
  /**
   * List of active effects to apply to the card
   */
  activeEffects?: string[];
}

/**
 * Detailed card component that displays card with actions and detailed info
 */
export const CardDetailed: React.FC<CardDetailedProps> = ({
  card,
  className,
  onView,
  onEdit,
  onShare,
  onDelete,
  enableEffects = false,
  activeEffects = [],
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      return 'Unknown date';
    }
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8", className)}>
      {/* Card Preview */}
      <div className="flex justify-center">
        <div className="max-w-md w-full">
          <CardThumbnail 
            card={card} 
            onClick={() => onView && onView(card.id)}
            enableEffects={enableEffects}
            activeEffects={activeEffects} 
            className="shadow-lg"
          />
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            {onView && (
              <Button 
                variant="outline" 
                onClick={() => onView(card.id)}
                className="flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Screen
              </Button>
            )}
            
            {onEdit && (
              <Button 
                variant="outline" 
                onClick={() => onEdit(card.id)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Card
              </Button>
            )}
            
            {onShare && (
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => onShare(card.id)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
            
            {onDelete && (
              <Button 
                variant="outline" 
                className="flex items-center text-red-600 hover:bg-red-50"
                onClick={() => onDelete(card.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Card Details */}
      <div>
        <h1 className="text-3xl font-bold mb-3">{card.title}</h1>
        
        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {card.tags.map((tag, i) => (
              <Badge key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Description */}
        <p className="text-gray-600 mb-6">{card.description || "No description available"}</p>
        
        {/* Additional card info */}
        <div className="space-y-4">
          {card.createdAt && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p>{formatDate(card.createdAt)}</p>
            </div>
          )}
          
          {card.updatedAt && card.updatedAt !== card.createdAt && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p>{formatDate(card.updatedAt)}</p>
            </div>
          )}
          
          {'player' in card && card.player && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Player</h3>
              <p>{card.player}</p>
            </div>
          )}
          
          {'team' in card && card.team && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Team</h3>
              <p>{card.team}</p>
            </div>
          )}
          
          {'year' in card && card.year && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Year</h3>
              <p>{card.year}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetailed;
