
import React, { useState, useEffect } from 'react';
import { useCards } from '@/hooks/useCards';
import { Card } from '@/lib/types';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import CardFilter from '@/components/gallery/CardFilter';
import CardGrid from '@/components/gallery/CardGrid';

const CardGallery: React.FC = () => {
  const { cards, loading } = useCards();
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Extract unique tags from all cards
  const allTags = React.useMemo(() => {
    const tags = cards.flatMap(card => card.tags || []);
    return [...new Set(tags)];
  }, [cards]);

  // Apply filtering when selectedTag or cards change
  useEffect(() => {
    setIsFiltering(true);
    setTimeout(() => {
      if (selectedTag === 'all') {
        setFilteredCards(cards);
      } else {
        setFilteredCards(cards.filter(card => card.tags?.includes(selectedTag)));
      }
      setIsFiltering(false);
    }, 300);
  }, [selectedTag, cards]);

  const handleCardClick = (cardId: string) => {
    // Navigate to card detail or immersive view
    console.log('Card clicked:', cardId);
  };

  return (
    <PageLayout title="Card Gallery" description="Browse your card collection">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Cards</h1>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/cards/create">Create New Card</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/collections">View Collections</Link>
            </Button>
          </div>
        </div>

        {/* Add filter component */}
        <CardFilter 
          tags={allTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />

        {/* Card grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredCards.length > 0 ? (
          <CardGrid cards={filteredCards} onCardClick={handleCardClick} />
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-4">No Cards Found</h3>
            <p className="text-gray-600 mb-8">You haven't created any cards yet, or none match your filter.</p>
            <Button asChild>
              <Link to="/cards/create">Create Your First Card</Link>
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CardGallery;
