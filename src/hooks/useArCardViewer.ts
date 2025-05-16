import { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

// Import the helper function
import { ensureValidDesignMetadata } from '@/lib/types/cardTypes';

export const useArCardViewer = (cardId?: string) => {
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!cardId) {
      // If no cardId is provided, set a default example card
      const exampleCard: Partial<Card> = {
        id: 'example-card',
        title: 'Example Card',
        description: 'An example card for display',
        imageUrl: '/placeholder-card.png',
        thumbnailUrl: '/placeholder-card.png',
        userId: 'user-1',
        tags: ['example', 'placeholder'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        effects: [],
        // Use the helper function to ensure the designMetadata is valid
        designMetadata: ensureValidDesignMetadata({
          cardStyle: {},
          textStyle: {},
          cardMetadata: {
            category: 'general',
            series: 'base',
            cardType: 'standard'
          },
          marketMetadata: {}
        })
      };
      setCard(exampleCard as Card);
      return;
    }
    
    const fetchCard = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('id', cardId)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          // Adapt the Supabase data to the Card type
          const adaptedCard: Card = {
            id: data.id,
            title: data.title,
            description: data.description || '',
            imageUrl: data.image_url,
            thumbnailUrl: data.thumbnail_url || data.image_url,
            tags: data.tags || [],
            userId: data.creator_id || data.user_id,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            isPublic: data.is_public,
            designMetadata: ensureValidDesignMetadata(data.design_metadata),
            teamId: data.team_id,
            collectionId: data.collection_id,
            effects: data.effects || [],
            player: data.player,
            team: data.team,
            year: data.year,
            artist: data.artist,
            set: data.set,
            rarity: data.rarity,
            cardNumber: data.card_number,
            fabricSwatches: data.fabric_swatches,
            name: data.name,
            jersey: data.jersey,
            seriesId: data.series_id,
            backgroundColor: data.background_color,
            specialEffect: data.special_effect,
            reactions: data.reactions,
            comments: data.comments,
            viewCount: data.view_count,
            ownerId: data.ownerId
          };
          setCard(adaptedCard);
        } else {
          setError('Card not found');
          setCard(null);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the card.');
        setCard(null);
        toast({
          title: 'Error fetching card',
          description: err.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCard();
  }, [cardId, toast]);
  
  return { card, isLoading, error };
};
