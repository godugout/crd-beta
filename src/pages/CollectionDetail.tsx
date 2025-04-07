
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Collection } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

export function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollectionDetails() {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch collection details
        const { data: collectionData, error: collectionError } = await supabase
          .from('collections')
          .select('*')
          .eq('id', id)
          .single();
        
        if (collectionError) {
          throw collectionError;
        }
        
        if (!collectionData) {
          setError('Collection not found');
          setIsLoading(false);
          return;
        }
        
        // Transform collection data to our Collection type
        const formattedCollection: Collection = {
          id: collectionData.id,
          name: collectionData.title || '',
          description: collectionData.description || '',
          coverImageUrl: collectionData.cover_image_url || '',
          visibility: (collectionData.visibility as 'public' | 'private' | 'team') || 'private',
          allowComments: collectionData.allow_comments !== undefined ? collectionData.allow_comments : true,
          designMetadata: collectionData.design_metadata || {},
          createdAt: collectionData.created_at,
          updatedAt: collectionData.updated_at,
          userId: collectionData.owner_id,
          cards: []
        };
        
        setCollection(formattedCollection);
        
        // Fetch cards in this collection
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .eq('collection_id', id)
          .order('created_at', { ascending: false });
        
        if (cardsError) {
          console.error('Error fetching collection cards:', cardsError);
          toast.error('Failed to load cards');
        } else if (cardsData) {
          // Transform database records to our Card type
          const formattedCards: Card[] = cardsData.map(card => ({
            id: card.id,
            title: card.title || '',
            description: card.description || '',
            imageUrl: card.image_url || '',
            thumbnailUrl: card.thumbnail_url || card.image_url || '',
            createdAt: card.created_at,
            updatedAt: card.updated_at,
            userId: card.user_id,
            teamId: card.team_id,
            collectionId: card.collection_id,
            isPublic: card.is_public || false,
            tags: card.tags || [],
            // Make sure we properly map design_metadata from the database
            designMetadata: card.design_metadata || {}
          }));
          
          setCards(formattedCards);
        }
      } catch (err: any) {
        console.error('Error fetching collection details:', err);
        setError(err.message || 'An error occurred while loading the collection');
        toast.error('Failed to load collection details');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCollectionDetails();
  }, [id]);

  const handleViewCard = (cardId: string) => {
    navigate(`/card/${cardId}`);
  };
  
  const handleAddCard = () => {
    navigate(`/card/create?collection=${id}`);
  };
  
  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      </Container>
    );
  }
  
  if (error || !collection) {
    return (
      <Container className="py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Collection not found'}</p>
          <Button onClick={() => navigate('/collections')}>
            Back to Collections
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          {collection.description && (
            <p className="mt-2 text-gray-600">{collection.description}</p>
          )}
        </div>
        <Button onClick={handleAddCard}>
          Add Card
        </Button>
      </div>
      
      <Separator className="mb-8" />
      
      {cards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No cards in this collection yet.</p>
          <Button onClick={handleAddCard}>
            Add Your First Card
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map(card => (
            <div 
              key={card.id} 
              className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewCard(card.id)}
            >
              <div className="h-40 bg-gray-100 overflow-hidden">
                {card.thumbnailUrl ? (
                  <img 
                    src={card.thumbnailUrl} 
                    alt={card.title}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium">{card.title}</h3>
                {card.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {card.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default CollectionDetail;
