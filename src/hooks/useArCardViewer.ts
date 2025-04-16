
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CardRecord extends Card {
  // This interface ensures CardRecord has all the properties of Card
  collection_id?: string;
  created_at: string;
  creator_id: string;
  design_metadata: any;
  edition_size: number;
  image_url: string;
  is_public: boolean;
  price?: number;
  user_id: string;
}

export function useArCardViewer() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { toast } = useToast();

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      
      // For demonstration, create some sample cards
      const demoCards: Card[] = [
        {
          id: '1',
          title: 'AR Demo Card 1',
          description: 'This is an AR-compatible card',
          imageUrl: '/ar-card-1.png',
          thumbnailUrl: '/ar-card-1-thumb.png',
          tags: ['AR', 'demo'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          effects: ['Holographic'], // Add required effects property
        },
        {
          id: '2',
          title: 'AR Demo Card 2',
          description: 'Another AR-compatible card',
          imageUrl: '/ar-card-2.png',
          thumbnailUrl: '/ar-card-2-thumb.png',
          tags: ['AR', 'interactive'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          effects: ['Refractor'], // Add required effects property
        },
      ];
      
      // Here, in a real application, you'd fetch from Supabase
      // const { data, error } = await supabase
      //   .from('cards')
      //   .select('*')
      //   .eq('ar_enabled', true);
      
      // if (error) throw error;
      
      // Instead of trying to directly convert incompatible types, create new objects with the proper shape
      // if (data) {
      //   const processedCards = data.map(item => ({
      //     id: item.id,
      //     title: item.title,
      //     description: item.description,
      //     imageUrl: item.image_url,
      //     thumbnailUrl: item.thumbnail_url,
      //     tags: item.tags,
      //     collectionId: item.collection_id,
      //     createdAt: item.created_at,
      //     updatedAt: item.updated_at,
      //     userId: item.user_id,
      //     teamId: item.team_id,
      //     isPublic: item.is_public,
      //     designMetadata: item.design_metadata,
      //     effects: [], // Add required property
      //   }));
      //   setCards(processedCards);
      // }
      
      setCards(demoCards);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching AR cards:', error);
      setError(error);
      toast({
        title: 'Failed to load AR cards',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const openViewer = useCallback((cardId: string) => {
    setActiveCardId(cardId);
    setIsViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setIsViewerOpen(false);
    setActiveCardId(null);
  }, []);

  return {
    cards,
    loading,
    error,
    activeCardId,
    isViewerOpen,
    openViewer,
    closeViewer,
    fetchCards,
  };
}
