
import React from 'react';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export interface FeaturedCardsSectionProps {
  isLoading: boolean;
  featuredCards: Card[];
  handleViewCard: (cardId: string) => void;
  handleCreateCard: () => void;
}

const FeaturedCardsSection: React.FC<FeaturedCardsSectionProps> = ({
  isLoading,
  featuredCards,
  handleViewCard,
  handleCreateCard
}) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Cards</h2>
        <Button onClick={handleCreateCard}>Create Card</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      ) : featuredCards.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No featured cards yet.</p>
          <Button onClick={handleCreateCard}>Create Your First Card</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredCards.map(card => (
            <div 
              key={card.id} 
              className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewCard(card.id)}
            >
              <div className="h-40 bg-gray-100 overflow-hidden">
                {card.thumbnailUrl ? (
                  <img 
                    src={card.thumbnailUrl} 
                    alt={card.title}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium">{card.title}</h3>
                {card.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {card.description}
                  </p>
                )}
                {card.tags && card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {card.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {card.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                        +{card.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedCardsSection;
