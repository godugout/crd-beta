
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

interface CardRecord {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  thumbnail_url?: string | null;
  tags?: string[];
  collection_id?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  is_public?: boolean;
}

export function useArCardViewer(id?: string) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [arCards, setArCards] = useState<Card[]>([]);
  const [availableCards, setAvailableCards] = useState<Card[]>([]);
  const [isArMode, setIsArMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      
      try {
        console.log("Fetching cards from Supabase...");
        const { data: cardsData, error } = await supabase
          .from('cards')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching cards:', error);
          toast.error('Failed to load cards');
          return;
        }
        
        console.log("Cards data received:", cardsData);
        
        // If no cards are found in the database, create some sample cards for demo purposes
        if (!cardsData || cardsData.length === 0) {
          console.log("No cards found in database, using sample cards");
          const sampleCards: Card[] = [
            {
              id: "sample-1",
              title: "Sample Baseball Card",
              description: "This is a sample baseball card for demonstration",
              imageUrl: "/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png",
              thumbnailUrl: "/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png",
              tags: ["baseball", "sample", "demo"],
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: "sample-2",
              title: "Sample Trading Card",
              description: "This is a sample trading card for demonstration",
              imageUrl: "/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png",
              thumbnailUrl: "/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png",
              tags: ["trading", "sample", "demo"],
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          
          setAvailableCards(sampleCards);
          const selectedCard = id ? sampleCards.find(card => card.id === id) : sampleCards[0];
          setActiveCard(selectedCard || sampleCards[0]);
          
          if (selectedCard) {
            setArCards([selectedCard]);
          }
        } else {
          // Format the cards from the database
          const formattedCards: Card[] = (cardsData as CardRecord[]).map(card => ({
            id: card.id,
            title: card.title,
            description: card.description || '',
            imageUrl: card.image_url || '',
            thumbnailUrl: card.thumbnail_url || card.image_url || '',
            tags: card.tags || [],
            createdAt: new Date(card.created_at),
            updatedAt: new Date(card.updated_at),
            collectionId: card.collection_id
          }));
          
          console.log("Formatted cards:", formattedCards);
          setAvailableCards(formattedCards);
          
          const cardById = id 
            ? formattedCards.find(card => card.id === id) 
            : null;
            
          const selectedCard = cardById || formattedCards[0] || null;
          console.log("Selected card:", selectedCard);
          setActiveCard(selectedCard);
          
          if (selectedCard) {
            setArCards([selectedCard]);
          }
        }
      } catch (err) {
        console.error('Error in card fetching process:', err);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCards();
  }, [id]);

  const handleLaunchAr = () => {
    setIsArMode(true);
    if (activeCard && !arCards.some(card => card.id === activeCard.id)) {
      setArCards(prev => [...prev, activeCard]);
    }
    
    document.documentElement.style.setProperty('--shimmer-speed', '3s');
    document.documentElement.style.setProperty('--hologram-intensity', '0.7');
    document.documentElement.style.setProperty('--motion-speed', '1');
    
    toast.info('Mouse Controls Active', {
      description: 'Drag cards to position them. Move mouse quickly to spin cards.'
    });
  };

  const handleExitAr = () => {
    setIsArMode(false);
  };

  const handleCameraError = (message: string) => {
    setCameraError(message);
    setIsArMode(false);
    toast.error('Camera error', { description: message });
  };

  const handleTakeSnapshot = () => {
    toast.success('Snapshot saved', {
      description: 'AR card image has been saved to your gallery'
    });
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 10, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  const handleAddCard = (card: Card) => {
    if (!arCards.some(c => c.id === card.id)) {
      setArCards(prev => [...prev, card]);
    }
  };
  
  const handleRemoveCard = (cardId: string) => {
    if (arCards.length <= 1) {
      toast.error("Can't remove the last card");
      return;
    }
    
    setArCards(prev => prev.filter(card => card.id !== cardId));
  };

  return {
    activeCard,
    arCards,
    availableCards,
    isArMode,
    isFlipped,
    scale,
    rotation,
    cameraError,
    isLoading,
    handleLaunchAr,
    handleExitAr,
    handleCameraError,
    handleTakeSnapshot,
    handleFlip,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    handleAddCard,
    handleRemoveCard
  };
}
