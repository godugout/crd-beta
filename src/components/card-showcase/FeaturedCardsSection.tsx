
import React from 'react';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';

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
    <section className="py-12 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Cards</h2>
          <Button onClick={handleCreateCard} variant="outline">
            Create Your Own
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-100 rounded-lg aspect-[2.5/3.5] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCards.map(card => (
              <div 
                key={card.id} 
                className="relative rounded-lg overflow-hidden aspect-[2.5/3.5] cursor-pointer group"
                onClick={() => handleViewCard(card.id)}
              >
                <img 
                  src={card.imageUrl} 
                  alt={card.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-medium text-lg">{card.title}</h3>
                    {card.tags && card.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {card.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {card.tags.length > 2 && (
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                            +{card.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCardsSection;
