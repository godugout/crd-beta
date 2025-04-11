
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Card as CardType } from '@/lib/types';
import CardGrid from '@/components/gallery/CardGrid';
import CardList from '@/components/gallery/CardList';

interface CollectionContentProps {
  filteredCards: CardType[];
  allCardsCount: number;
  viewMode: 'grid' | 'list';
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onCardClick: (cardId: string) => void;
  openAssetGalleryForCard: (cardId: string) => void;
}

const CollectionContent: React.FC<CollectionContentProps> = ({
  filteredCards,
  allCardsCount,
  viewMode,
  searchTerm,
  setSearchTerm,
  onCardClick,
  openAssetGalleryForCard
}) => {
  if (filteredCards.length === 0 && allCardsCount > 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">No matching cards found</h2>
          <p className="text-gray-600 mb-6">Try a different search term</p>
          <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
        </CardContent>
      </Card>
    );
  }
  
  if (filteredCards.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">No cards in this collection yet</h2>
          <p className="text-gray-600 mb-6">This collection is empty. Add some cards to see them here.</p>
          <Button asChild>
            <Link to="/cards">Browse Cards</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Cards</TabsTrigger>
        {/* Additional tabs could be added here for card categories */}
      </TabsList>
      <TabsContent value="all">
        {viewMode === 'grid' ? (
          <CardGridView 
            cards={filteredCards} 
            onCardClick={onCardClick} 
            openAssetGalleryForCard={openAssetGalleryForCard} 
          />
        ) : (
          <CardList 
            cards={filteredCards}
            onCardClick={onCardClick}
            className=""
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default CollectionContent;

interface CardGridViewProps {
  cards: CardType[];
  onCardClick: (cardId: string) => void;
  openAssetGalleryForCard: (cardId: string) => void;
}

const CardGridView: React.FC<CardGridViewProps> = ({ cards, onCardClick, openAssetGalleryForCard }) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map(card => (
          <CardGridItem 
            key={card.id} 
            card={card}
            onClick={() => onCardClick(card.id)}
            onUpdateImage={() => openAssetGalleryForCard(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface CardGridItemProps {
  card: CardType;
  onClick: () => void;
  onUpdateImage: () => void;
}

const CardGridItem: React.FC<CardGridItemProps> = ({ card, onClick, onUpdateImage }) => {
  const { OptimizedImage } = require('@/components/ui/optimized-image');
  const { Upload } = require('lucide-react');

  return (
    <Card key={card.id} className="overflow-hidden">
      <div className="relative aspect-[3/4]">
        <OptimizedImage 
          src={card.imageUrl} 
          alt={card.title || ''}
          className="w-full h-full object-cover"
          placeholderSrc="/placeholder.svg"
          fadeIn={true}
        />
        <Button 
          size="sm" 
          variant="ghost" 
          className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateImage();
          }}
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium truncate">{card.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 h-10">{card.description}</p>
      </CardContent>
    </Card>
  );
};
