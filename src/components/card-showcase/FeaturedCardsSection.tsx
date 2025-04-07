
import React from 'react';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FeaturedCardsSectionProps {
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
  const navigate = useNavigate();
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Cards</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {featuredCards.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 mb-4">No cards found in your collection</p>
                <Button onClick={handleCreateCard}>Create Your First Card</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCards.map(card => (
                  <div 
                    key={card.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
                    onClick={() => handleViewCard(card.id)}
                  >
                    <div className="h-64 bg-gray-100 overflow-hidden">
                      <img 
                        src={card.imageUrl} 
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{card.description}</p>
                      
                      {card.tags && card.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {card.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {card.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{card.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Button 
                variant="outline"
                onClick={() => navigate('/gallery')}
              >
                View All Cards
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedCardsSection;
