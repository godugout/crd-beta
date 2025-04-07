
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

// Import the refactored components
import HeroSection from '@/components/card-showcase/HeroSection';
import FeaturedCardsSection from '@/components/card-showcase/FeaturedCardsSection';
import CollectionsSection from '@/components/card-showcase/CollectionsSection';
import ArFeaturesSection from '@/components/card-showcase/ArFeaturesSection';
import SiteFooter from '@/components/card-showcase/SiteFooter';

// Define a simpler type for database records to avoid deep type instantiation
interface CardRecord {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  creator_id?: string;
  price?: number;
  edition_size?: number;
  rarity?: string;
  // Optional fields that might not exist in all records
  thumbnail_url?: string | null;
  tags?: string[] | null;
  collection_id?: string | null;
}

interface CollectionRecord {
  id: string;
  title: string;
  description: string | null;
  owner_id?: string;
  created_at: string;
  updated_at: string;
}

const CardShowcase = () => {
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch cards
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
          
        if (cardsError) throw cardsError;
        
        // Fetch collections
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('collections')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (collectionsError) throw collectionsError;
        
        // Type-safe conversion of database records to application types
        const formattedCards: Card[] = (cardsData as CardRecord[]).map(card => ({
          id: card.id,
          title: card.title,
          description: card.description || '',
          imageUrl: card.image_url || '',
          thumbnailUrl: card.thumbnail_url || card.image_url || '',
          tags: card.tags || [],
          createdAt: card.created_at, // Use string directly, not converting to Date
          collectionId: card.collection_id || undefined
        }));
        
        setFeaturedCards(formattedCards);
        setCollections(collectionsData as CollectionRecord[]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleViewCard = (cardId: string) => {
    navigate(`/ar-card-viewer/${cardId}`);
  };

  const handleViewCollection = (collectionId: string) => {
    navigate(`/collections/${collectionId}`);
  };

  const handleCreateCard = () => {
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <HeroSection />
      
      <FeaturedCardsSection 
        isLoading={isLoading}
        featuredCards={featuredCards}
        handleViewCard={handleViewCard}
        handleCreateCard={handleCreateCard}
      />
      
      <CollectionsSection 
        isLoading={isLoading}
        collections={collections}
        handleViewCollection={handleViewCollection}
      />
      
      <ArFeaturesSection />
      
      <SiteFooter />
    </div>
  );
};

export default CardShowcase;
