import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CardGrid from '@/components/gallery/CardGrid';
import { useAuth } from '@/context/auth';
import { Collection, Card as CardType } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface CollectionDetailParams {
  id: string;
}

const CollectionDetail: React.FC = () => {
  const { id } = useParams<CollectionDetailParams>();
  const { user } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!id) {
          setError('Collection ID is missing');
          return;
        }
        
        const { data: collectionData, error: collectionError } = await supabase
          .from('collections')
          .select('*')
          .eq('id', id)
          .single();
        
        if (collectionError) {
          console.error('Error fetching collection:', collectionError);
          setError('Failed to load collection');
          return;
        }
        
        if (!collectionData) {
          setError('Collection not found');
          return;
        }
        
        const formattedCollection: Collection = {
          id: collectionData.id,
          name: collectionData.title || '',
          description: collectionData.description || '',
          coverImageUrl: collectionData.cover_image_url || '',
          userId: collectionData.owner_id,
          visibility: collectionData.visibility || 'public',
          allowComments: collectionData.allow_comments !== undefined ? collectionData.allow_comments : true,
          createdAt: collectionData.created_at,
          updatedAt: collectionData.updated_at
        };
        
        setCollection(formattedCollection);
        
        const { data: cardData, error: cardError } = await supabase
          .from('cards')
          .select('*')
          .eq('collection_id', id);
        
        if (cardError) {
          console.error('Error fetching cards:', cardError);
          setError('Failed to load cards in collection');
          return;
        }
        
        if (cardData) {
          const formattedCards = cardData.map(item => ({
            id: item.id,
            title: item.title || '',
            description: item.description || '',
            imageUrl: item.image_url || '',
            thumbnailUrl: item.thumbnail_url || item.image_url || '',
            userId: item.user_id,
            teamId: item.team_id,
            collectionId: item.collection_id,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            isPublic: item.is_public || false,
            tags: item.tags || [],
            designMetadata: item.design_metadata || {},
            reactions: item.reactions || []
          }));
          
          setCards(formattedCards);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCollection();
  }, [id, user]);

  // Update collection visibility to use proper type
  const updateVisibility = async (visibility: 'public' | 'private' | 'team') => {
    if (!collection) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('collections')
        .update({ visibility: visibility })
        .eq('id', collection.id);
      
      if (error) {
        console.error('Error updating visibility:', error);
        setError('Failed to update visibility');
      } else {
        setCollection({ ...collection, visibility: visibility });
      }
    } catch (err) {
      console.error('Error updating visibility:', err);
      setError('Failed to update visibility');
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the addCardToCollection to use proper Card type
  const addCardToCollection = async (cardId: CardType) => {
    // Use cardId.id if CardType object is passed
    const id = typeof cardId === 'string' ? cardId : cardId.id;
    if (!collection) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cards')
        .update({ collection_id: collection.id })
        .eq('id', id);
      
      if (error) {
        console.error('Error adding card to collection:', error);
        setError('Failed to add card to collection');
      } else {
        setCards(prevCards => [...prevCards, cardId]);
      }
    } catch (err) {
      console.error('Error adding card to collection:', err);
      setError('Failed to add card to collection');
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the removeCardFromCollection to use proper Card type  
  const removeCardFromCollection = async (cardId: CardType) => {
    // Use cardId.id if CardType object is passed
    const id = typeof cardId === 'string' ? cardId : cardId.id;
    if (!collection) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cards')
        .update({ collection_id: null })
        .eq('id', id);
      
      if (error) {
        console.error('Error removing card from collection:', error);
        setError('Failed to remove card from collection');
      } else {
        setCards(prevCards => prevCards.filter(card => card.id !== id));
      }
    } catch (err) {
      console.error('Error removing card from collection:', err);
      setError('Failed to remove card from collection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      
      {collection && (
        <div>
          <h1>{collection.name}</h1>
          <p>{collection.description}</p>
          
          {/* Add card to collection */}
          {/* Remove card from collection */}
          
          <CardGrid cards={cards} />
        </div>
      )}
    </Container>
  );
};

export default CollectionDetail;
