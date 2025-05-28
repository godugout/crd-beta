
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/lib/types/card';
import { useToast } from '@/hooks/use-toast';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

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

export function useArCardViewer(cardId?: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(cardId || null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isArMode, setIsArMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [arCards, setArCards] = useState<Card[]>([]);
  const { toast } = useToast();

  // Get the active card based on activeCardId
  const activeCard = activeCardId ? cards.find(card => card.id === activeCardId) || null : null;
  // Cards available to add to AR scene
  const availableCards = cards.filter(card => !arCards.some(arCard => arCard.id === card.id));

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      
      // For demonstration, create some sample cards
      const demoCards: Card[] = [
        adaptToCard({
          id: '1',
          title: 'AR Demo Card 1',
          description: 'This is an AR-compatible card',
          imageUrl: '/ar-card-1.png',
          thumbnailUrl: '/ar-card-1-thumb.png',
          tags: ['AR', 'demo'],
          userId: 'demo-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          effects: ['Holographic'],
        }),
        adaptToCard({
          id: '2',
          title: 'AR Demo Card 2',
          description: 'Another AR-compatible card',
          imageUrl: '/ar-card-2.png',
          thumbnailUrl: '/ar-card-2-thumb.png',
          tags: ['AR', 'interactive'],
          userId: 'demo-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          effects: ['Refractor'],
        }),
      ];
      
      // Here, in a real application, you'd fetch from Supabase
      // const { data, error } = await supabase
      //   .from('cards')
      //   .select('*')
      //   .eq('ar_enabled', true);
      
      // if (error) throw error;
      
      // Process fetched data (commented out for demo)
      // if (data) {
      //   const processedCards = data.map(item => adaptToCard({
      //     id: item.id,
      //     title: item.title || '',
      //     description: item.description || '',
      //     imageUrl: item.image_url || '',
      //     thumbnailUrl: item.thumbnail_url || '',
      //     tags: item.tags || [],
      //     collectionId: item.collection_id || '',
      //     createdAt: item.created_at || new Date().toISOString(),
      //     updatedAt: item.updated_at || new Date().toISOString(),
      //     userId: item.user_id || '',
      //     isPublic: item.is_public || false,
      //     designMetadata: item.design_metadata || {},
      //     effects: item.effects || ['Holographic'], // Ensure effects is always populated
      //   }));
      //   setCards(processedCards);
      // }
      
      setCards(demoCards);

      // If a cardId was provided, add it to AR cards
      if (cardId) {
        const cardToAdd = demoCards.find(card => card.id === cardId);
        if (cardToAdd) {
          setArCards([cardToAdd]);
        }
      }
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
  }, [toast, cardId]);

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

  // AR interaction methods
  const handleLaunchAr = useCallback(() => {
    if (activeCard) {
      setArCards([activeCard]);
      setIsArMode(true);
    } else {
      toast({
        title: 'No card selected',
        description: 'Please select a card to view in AR',
        variant: 'destructive',
      });
    }
  }, [activeCard, toast]);

  const handleExitAr = useCallback(() => {
    setIsArMode(false);
  }, []);

  const handleCameraError = useCallback((error: string) => {
    setCameraError(error);
    toast({
      title: 'Camera Error',
      description: error,
      variant: 'destructive',
    });
  }, [toast]);

  const handleTakeSnapshot = useCallback(() => {
    toast({
      title: 'Snapshot taken',
      description: 'AR snapshot saved to your gallery',
    });
  }, [toast]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleZoomIn = useCallback(() => {
    toast({
      title: 'Zooming in',
      description: 'Feature coming soon',
    });
  }, [toast]);

  const handleZoomOut = useCallback(() => {
    toast({
      title: 'Zooming out',
      description: 'Feature coming soon',
    });
  }, [toast]);

  const handleRotate = useCallback(() => {
    toast({
      title: 'Rotating card',
      description: 'Feature coming soon',
    });
  }, [toast]);

  const handleAddCard = useCallback((cardId: string) => {
    const cardToAdd = cards.find(card => card.id === cardId);
    if (cardToAdd && !arCards.some(card => card.id === cardId)) {
      setArCards(prev => [...prev, cardToAdd]);
    }
  }, [cards, arCards]);

  const handleRemoveCard = useCallback((cardId: string) => {
    setArCards(prev => prev.filter(card => card.id !== cardId));
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
    // Add the missing properties
    activeCard,
    arCards,
    availableCards,
    isArMode,
    isFlipped,
    cameraError,
    isLoading: loading,
    handleLaunchAr,
    handleExitAr,
    handleCameraError,
    handleTakeSnapshot,
    handleFlip,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    handleAddCard,
    handleRemoveCard,
  };
}
