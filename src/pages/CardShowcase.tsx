
import React, { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import FeaturedCardsSection from '@/components/card-showcase/FeaturedCardsSection';
import CollectionsSection from '@/components/card-showcase/CollectionsSection';
import MemoryPacksSection from '@/components/card-showcase/MemoryPacksSection';
import { Separator } from '@/components/ui/separator';
import { Card, Collection } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// CardShowcase component to display featured cards and collections
export function CardShowcase() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching collections:', error);
          return;
        }

        // Transform database records to our Collection type
        const formattedCollections: Collection[] = (data as any[]).map(collection => ({
          id: collection.id,
          name: collection.title || '', // Use title instead of name
          description: collection.description || '',
          coverImageUrl: collection.cover_image_url || '',
          visibility: collection.visibility || 'public',
          allowComments: collection.allow_comments !== undefined ? collection.allow_comments : true,
          designMetadata: collection.design_metadata || {},
          createdAt: collection.created_at,
          updatedAt: collection.updated_at,
          userId: collection.owner_id
        }));

        setCollections(formattedCollections);
      } catch (err) {
        console.error('Failed to fetch collections:', err);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchFeaturedCards() {
      try {
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('is_public', true)
          .limit(4);

        if (error) {
          console.error('Error fetching featured cards:', error);
          return;
        }

        // Transform database records to our Card type
        const formattedCards: Card[] = (data as any[]).map(card => ({
          id: card.id,
          title: card.title || '',
          description: card.description || '',
          imageUrl: card.image_url || '',
          thumbnailUrl: card.thumbnail_url || card.image_url || '',
          collectionId: card.collection_id,
          userId: card.user_id,
          teamId: card.team_id,
          createdAt: card.created_at,
          updatedAt: card.updated_at,
          isPublic: card.is_public || false,
          tags: card.tags || [],
          designMetadata: card.design_metadata || {}
        }));

        setFeaturedCards(formattedCards);
      } catch (err) {
        console.error('Failed to fetch featured cards:', err);
      }
    }

    fetchCollections();
    fetchFeaturedCards();
  }, []);

  const handleViewCard = (cardId: string) => {
    navigate(`/card/${cardId}`);
  };

  const handleCreateCard = () => {
    navigate('/card/create');
  };

  const handleViewPack = (packId: string) => {
    navigate(`/pack/${packId}`);
  };

  return (
    <Container className="py-8">
      <FeaturedCardsSection 
        isLoading={isLoading} 
        featuredCards={featuredCards}
        handleViewCard={handleViewCard}
        handleCreateCard={handleCreateCard}
      />
      
      <Separator className="my-12" />
      
      <CollectionsSection collections={collections} isLoading={isLoading} />
      
      <Separator className="my-12" />
      
      <MemoryPacksSection 
        isLoading={isLoading} 
        packs={collections.filter(c => c.designMetadata?.type === 'memory-pack')}
        handleViewPack={handleViewPack}
      />
    </Container>
  );
}

// Export default for proper importing
export default CardShowcase;
