
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/navigation/PageLayout';
import CardGrid from '@/components/gallery/CardGrid';
import CardFilter from '@/components/gallery/CardFilter';

const CardGallery = () => {
  const { cards, isLoading, error } = useCards();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const filteredCards = selectedTag 
    ? cards.filter(card => card.tags?.includes(selectedTag)) 
    : cards;
    
  const allTags = Array.from(new Set(cards.flatMap(card => card.tags || [])));
  
  return (
    <PageLayout title="Card Gallery" description="Browse through your card collection">
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Card Gallery</h1>
            <p className="text-gray-600">Browse through your collection of cards</p>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" asChild>
              <Link to="/card-creator">Create New Card</Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/collections">View Collections</Link>
            </Button>
          </div>
        </div>
        
        {allTags.length > 0 && (
          <CardFilter 
            tags={allTags}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-lg font-medium text-red-800">Error loading cards</h3>
            <p className="mt-2 text-red-700">{error.message}</p>
            <Button 
              variant="destructive" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-medium">No cards found</h3>
            {selectedTag ? (
              <p className="mt-2 text-gray-600">
                No cards found with the tag "{selectedTag}".{' '}
                <button 
                  className="text-primary hover:underline" 
                  onClick={() => setSelectedTag(null)}
                >
                  Clear filter
                </button>
              </p>
            ) : (
              <p className="mt-2 text-gray-600">
                You don't have any cards in your collection yet.
              </p>
            )}
            <Button className="mt-4" asChild>
              <Link to="/card-creator">Create Your First Card</Link>
            </Button>
          </div>
        ) : (
          <CardGrid cards={filteredCards} />
        )}
      </div>
    </PageLayout>
  );
};

export default CardGallery;
