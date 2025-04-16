
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { Card } from '@/lib/types';
import { useCardOperations } from '@/hooks/useCardOperations';

interface CardGalleryProps {
  className?: string;
  viewMode?: 'grid' | 'list';
  onCardClick?: (cardId: string) => void;
  cards?: Card[]; 
  teamId?: string;
  collectionId?: string;
  tags?: string[];
  isLoading?: boolean;
  searchQuery?: string;
}

const CardGallery: React.FC<CardGalleryProps> = ({ 
  className, 
  viewMode: initialViewMode = 'grid',
  onCardClick,
  cards: propCards,
  teamId,
  collectionId,
  tags: initialTags,
  isLoading: propIsLoading = false,
  searchQuery = ''
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState(initialViewMode);
  const cardOperations = useCardOperations();
  
  // Use the provided cards directly without depending on CardContext
  const cards = propCards || [];
  const isLoading = propIsLoading;
  const { isMobile } = useMobileOptimization();

  // Filter cards based on search query
  const filteredCards = useMemo(() => {
    if (!searchQuery) return cards;
    const lowerQuery = searchQuery.toLowerCase();
    return cards.filter(card => 
      card.title?.toLowerCase().includes(lowerQuery) || 
      card.description?.toLowerCase().includes(lowerQuery) ||
      card.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [cards, searchQuery]);

  const handleCardItemClick = (cardId: string) => {
    if (onCardClick) {
      onCardClick(cardId);
    } else {
      // Navigate to card detail page
      navigate(`/cards/${cardId}`);
    }
  };

  console.log('CardGallery received cards:', cards);

  return (
    <div className={cn("", className)}>
      <ErrorBoundary>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-foreground">Loading cards...</p>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : 
            "space-y-4"
          }>
            {filteredCards.length > 0 ? filteredCards.map(card => (
              <div key={card.id} className={viewMode === 'list' ? "bg-background rounded-lg shadow" : ""}>
                {viewMode === 'grid' ? (
                  <div 
                    className="cursor-pointer transition-all duration-200 hover:shadow-md"
                    onClick={() => handleCardItemClick(card.id)}
                  >
                    <div className="aspect-[2.5/3.5] rounded-lg overflow-hidden mb-2 bg-gray-100">
                      {card.imageUrl && (
                        <img 
                          src={card.imageUrl}
                          alt={card.title || 'Card image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(`Failed to load image: ${card.imageUrl}`);
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
                          }}
                        />
                      )}
                    </div>
                    <h3 className="font-medium text-sm truncate">{card.title || 'Untitled Card'}</h3>
                    {card.tags && card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {card.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs text-muted-foreground">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center p-3 gap-4 cursor-pointer" onClick={() => handleCardItemClick(card.id)}>
                    <div className="w-16 h-24 bg-gray-100">
                      {card.imageUrl && (
                        <img 
                          src={card.imageUrl}
                          alt={card.title || 'Card thumbnail'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(`Failed to load image: ${card.imageUrl}`);
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{card.title || 'Untitled Card'}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{card.description}</p>
                      {card.tags && card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {card.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="text-xs text-muted-foreground">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No cards found matching your criteria</p>
              </div>
            )}
          </div>
        )}
        
        {filteredCards.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cards found</p>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default CardGallery;
