
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import CardGrid from '@/components/cards/CardGrid';
import { Card } from '@/lib/types';
import { toast } from 'sonner';
import CardDetailView from '@/components/card-experiences/CardDetailView';
import { useCards } from '@/context/CardContext';

const Gallery = () => {
  const { cards, isLoading } = useCards();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  
  // Collect all unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    cards.forEach(card => {
      if (card.tags) {
        card.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [cards]);
  
  // Filter cards based on search and tags
  const filteredCards = React.useMemo(() => {
    return cards.filter(card => {
      // Filter by search query
      const matchesSearch = !searchQuery || 
        (card.title && card.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by selected tag
      const matchesTag = !selectedTag || 
        (card.tags && card.tags.includes(selectedTag));
      
      return matchesSearch && matchesTag;
    });
  }, [cards, searchQuery, selectedTag]);

  const handleCardClick = (cardId: string) => {
    console.log("Card clicked:", cardId);
    setSelectedCardId(cardId);
  };

  // If a card is selected, show its detail view
  if (selectedCardId) {
    return (
      <CardDetailView
        cardId={selectedCardId}
        onBack={() => setSelectedCardId(null)}
      />
    );
  }

  return (
    <PageLayout 
      title="Gallery | CardShow" 
      description="Browse our collection of cards"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Card Gallery</h1>
          <Button asChild className="ml-auto">
            <Link to="/editor">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Card
            </Link>
          </Button>
        </div>
        
        {/* Search and filter controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cards..."
              className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Filter:</span>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
              {selectedTag && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedTag(null)}
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Cards display */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading cards...</span>
          </div>
        ) : filteredCards.length > 0 ? (
          <CardGrid 
            cards={filteredCards} 
            onCardClick={handleCardClick} 
          />
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-4">No cards found</h3>
            <p className="text-muted-foreground mb-8">
              {searchQuery || selectedTag 
                ? "Try adjusting your search or filters" 
                : "There are no cards in the gallery yet"}
            </p>
            <Button asChild>
              <Link to="/editor">Create Your First Card</Link>
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Gallery;
