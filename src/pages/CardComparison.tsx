
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import CardMedia from '@/components/gallery/CardMedia';

const CardComparison = () => {
  const navigate = useNavigate();
  const { cards } = useCards();
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [showSelection, setShowSelection] = useState(true);
  
  // Handler for selecting a card for comparison
  const handleCardSelect = (card: Card) => {
    if (selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, card]);
    }
  };
  
  // Handler for viewing a card in fullscreen mode
  const handleViewCard = (cardId: string) => {
    navigate(`/cards/${cardId}`);
  };
  
  // Clear all selected cards
  const handleClearSelection = () => {
    setSelectedCards([]);
  };
  
  // Toggle between selection mode and comparison mode
  const toggleSelectionMode = () => {
    setShowSelection(!showSelection);
  };

  return (
    <PageLayout
      title="Card Comparison"
      description="Compare multiple cards side by side"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Card Comparison</h1>
            <p className="text-gray-600">Select up to 3 cards to compare side by side</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={toggleSelectionMode}
            >
              {showSelection ? 'Hide Selection' : 'Show Selection'}
            </Button>
            <Button 
              variant="outline"
              onClick={handleClearSelection}
              disabled={selectedCards.length === 0}
            >
              Clear Selection
            </Button>
          </div>
        </div>
        
        {/* Selected cards for comparison */}
        {selectedCards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Comparing {selectedCards.length} Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCards.map(card => (
                <div key={card.id} className="border rounded-lg overflow-hidden bg-white shadow">
                  <div className="relative h-80">
                    <CardMedia card={card} onView={handleViewCard} className="h-full" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-2">{card.title}</h3>
                    {card.tags && card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {card.tags.map((tag, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-2">{card.description || 'No description available'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Card selection grid (conditionally shown) */}
        {showSelection && (
          <>
            <h2 className="text-xl font-semibold mb-4">Select Cards to Compare</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cards.slice(0, 10).map(card => (
                <div 
                  key={card.id} 
                  className={`cursor-pointer relative border rounded-lg overflow-hidden 
                    ${selectedCards.some(c => c.id === card.id) ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleCardSelect(card)}
                >
                  <div className="h-56">
                    <CardMedia card={card} onView={() => {}} className="h-full" />
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-sm truncate">{card.title}</h3>
                  </div>
                  {selectedCards.some(c => c.id === card.id) && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                      {selectedCards.findIndex(c => c.id === card.id) + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {cards.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No cards found in your collection</p>
                <Button className="mt-4" onClick={() => navigate('/cards/create')}>
                  Create Your First Card
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default CardComparison;
