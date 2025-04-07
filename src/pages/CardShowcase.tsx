
import React, { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import FeaturedCardsSection from '@/components/card-showcase/FeaturedCardsSection';
import CollectionsSection from '@/components/card-showcase/CollectionsSection';
import MemoryPacksSection from '@/components/card-showcase/MemoryPacksSection';
import { Separator } from '@/components/ui/separator';
import { Collection } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

// CardShowcase component to display featured cards and collections
export function CardShowcase() {
  const [collections, setCollections] = useState<Collection[]>([]);
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
          updatedAt: collection.updated_at
        }));

        setCollections(formattedCollections);
      } catch (err) {
        console.error('Failed to fetch collections:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollections();
  }, []);

  return (
    <Container className="py-8">
      <FeaturedCardsSection />
      
      <Separator className="my-12" />
      
      <CollectionsSection collections={collections} isLoading={isLoading} />
      
      <Separator className="my-12" />
      
      <MemoryPacksSection collections={collections} isLoading={isLoading} />
    </Container>
  );
}

// Export default for proper importing
export default CardShowcase;
