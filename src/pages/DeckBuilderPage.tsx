
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import PageLayout from '@/components/navigation/PageLayout';
import DeckBuilder from '@/components/decks/DeckBuilder';

const DeckBuilderPage: React.FC = () => {
  const { deckId } = useParams();
  const { decks, loading } = useEnhancedCards();
  
  // Add isLoading property if it doesn't exist in EnhancedCardContextProps
  const isLoading = loading;
  
  const deck = deckId ? decks.find(d => d.id === deckId) : undefined;
  
  return (
    <PageLayout
      title={deck ? 'Edit Deck' : 'Create Deck'}
      description={deck ? 'Update your custom deck' : 'Build a custom deck of your favorite cards'}
    >
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <DeckBuilder initialDeck={deck} />
        )}
      </div>
    </PageLayout>
  );
};

export default DeckBuilderPage;
