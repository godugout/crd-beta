import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { Card } from '@/lib/types';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuickActions from '@/components/navigation/QuickActions';

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
  const { isMobile } = useMobileOptimization();
  
  // Use the provided cards directly
  const cards = propCards || [];
  const isLoading = propIsLoading;
  
  // Fallback image to use when card image is not available
  const fallbackImage = '/placeholder-card.png';

  // Filter cards based on search query
  const filteredCards = useMemo(() => {
    if (!searchQuery || !cards) return cards;
    
    const lowerQuery = searchQuery.toLowerCase();
    return cards.filter(card => 
      (card.title && card.title.toLowerCase().includes(lowerQuery)) || 
      (card.description && card.description.toLowerCase().includes(lowerQuery)) ||
      (card.tags && card.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }, [cards, searchQuery]);

  const handleCardItemClick = (cardId: string) => {
    if (onCardClick) {
      onCardClick(cardId);
    } else {
      // Navigate to immersive viewer for better experience
      navigate(`/immersive/${cardId}`);
    }
  };

  // Handle empty state
  if (cards.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-[#006341]/20 to-[#EFB21E]/20 rounded-full flex items-center justify-center mb-4">
          <RefreshCw className="h-8 w-8 text-[#006341]" />
        </div>
        <h3 className="text-lg font-medium mb-2">No cards found</h3>
        <p className="text-muted-foreground mb-4">
          {searchQuery 
            ? "Try adjusting your search terms" 
            : "Your collection is empty. Create your first card to get started."}
        </p>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/cards/create')} className="bg-gradient-to-r from-[#006341] to-[#EFB21E] hover:from-[#004d32] hover:to-[#d49e1a]">
            Create a Card
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <ErrorBoundary>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006341] mb-4"></div>
              <p className="text-foreground">Loading cards...</p>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : 
            "space-y-4"
          }>
            {filteredCards.map(card => (
              <div key={card.id} className={viewMode === 'list' ? "bg-background rounded-lg shadow" : ""}>
                {viewMode === 'grid' ? (
                  <div className="group relative cursor-pointer transition-all duration-200 hover:shadow-md">
                    <div 
                      className="aspect-[2.5/3.5] rounded-lg overflow-hidden mb-2 bg-gray-100 relative"
                      onClick={() => handleCardItemClick(card.id)}
                    >
                      <img 
                        src={card.imageUrl || fallbackImage}
                        alt={card.title || 'Card image'}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          console.error(`Failed to load image: ${card.imageUrl}. Using fallback.`);
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                      
                      {/* Quick Actions Overlay */}
                      <QuickActions cardId={card.id} />
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
                      <img 
                        src={card.imageUrl || fallbackImage}
                        alt={card.title || 'Card thumbnail'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Failed to load image: ${card.imageUrl}. Using fallback.`);
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{card.title || 'Untitled Card'}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{card.description}</p>
                      {card.tags && card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {card.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs text-muted-foreground">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default CardGallery;
