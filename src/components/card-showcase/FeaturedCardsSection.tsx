
import React from 'react';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface FeaturedCardsSectionProps {
  title: string;
  cardsData: Card[];
  isLoading: boolean;
  onCardClick?: (cardId: string) => void;
  onAddClick?: () => void;
}

const FeaturedCardsSection: React.FC<FeaturedCardsSectionProps> = ({
  title,
  cardsData,
  isLoading,
  onCardClick,
  onAddClick
}) => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          {onAddClick && (
            <Button variant="outline" onClick={onAddClick}>
              Add Card
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <Skeleton className="aspect-[2.5/3.5] w-full rounded-md mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : cardsData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {cardsData.map((card) => (
              <div 
                key={card.id} 
                className="group cursor-pointer"
                onClick={() => onCardClick && onCardClick(card.id)}
              >
                <div className="aspect-[2.5/3.5] overflow-hidden rounded-lg border border-gray-200 mb-3 bg-gray-50 relative">
                  {card.imageUrl ? (
                    <img 
                      src={card.thumbnailUrl || card.imageUrl} 
                      alt={card.title} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <span className="text-gray-300 text-xl">No Image</span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 truncate">{card.title}</h3>
                <p className="text-sm text-gray-500">
                  {card.tags?.join(', ') || 'No tags'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No cards available</p>
            {onAddClick && (
              <Button onClick={onAddClick}>Create Your First Card</Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCardsSection;
