
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import CardGrid from '@/components/ui/card-components/CardGrid';
import { Card, Collection } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const CollectionDetail = () => {
  // Fix the type for useParams
  const { id } = useParams<{ id: string }>();
  const { collections, cards, isLoading } = useCards();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionCards, setCollectionCards] = useState<Card[]>([]);

  // Find the collection and its cards when the component mounts
  useEffect(() => {
    if (!id || !collections.length) return;
    
    const found = collections.find(c => c.id === id);
    if (found) {
      setCollection(found);
      
      // Filter cards that belong to this collection
      const collectionCardIds = found.cards || [];
      // Convert the array of card IDs to actual Card objects
      const filteredCards = cards.filter(card => 
        collectionCardIds.includes(card.id)
      );
      setCollectionCards(filteredCards);
    }
  }, [id, collections, cards]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading collection...</div>;
  }

  if (!collection) {
    return <div className="p-8 text-center">Collection not found</div>;
  }

  return (
    <div className="container mx-auto p-4 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{collection.name}</h1>
        <p className="text-gray-500 mt-1">{collection.description}</p>
        
        <div className="flex mt-4 space-x-2">
          <Badge variant={collection.visibility === 'private' ? 'secondary' : 'default'}>
            {collection.visibility === 'private' ? 'Private' : 'Public'}
          </Badge>
          <Badge variant="outline">{collectionCards.length} cards</Badge>
        </div>
      </div>
      
      {collectionCards.length > 0 ? (
        <CardGrid 
          cards={collectionCards} 
          isLoading={false}
          error={null}
          onCardClick={() => {}}
          getCardEffects={() => []}
        />
      ) : (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">This collection has no cards yet</p>
          <Button>Add Cards to Collection</Button>
        </div>
      )}
    </div>
  );
};

export default CollectionDetail;
