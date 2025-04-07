
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/card-showcase/HeroSection';
import FeaturedCardsSection from '../components/card-showcase/FeaturedCardsSection';
import CollectionsSection from '../components/card-showcase/CollectionsSection';
import MemoryPacksSection from '../components/card-showcase/MemoryPacksSection';
import ArFeaturesSection from '../components/card-showcase/ArFeaturesSection';
import SiteFooter from '../components/card-showcase/SiteFooter';
import { useCards } from '../context/CardContext';
import { Card, Collection } from '../lib/types';

// Define the props types to match the component expectations
interface FeaturedCardsSectionProps {
  cards: Card[];
  isLoading: boolean;
}

// Define the props types for CollectionSection
interface CollectionsSectionProps {
  collections: Collection[];
  isLoading: boolean;
  handleViewCollection: (id: string) => void;
}

const Index = () => {
  const { cards, collections, isLoading, refreshCards } = useCards();
  const navigate = useNavigate();

  // Find memory packs (collections with packType === 'memory-pack')
  const memoryPacks = collections.filter(collection => 
    collection.designMetadata?.packType === 'memory-pack'
  );
  
  // Find standard collections (those without packType or packType !== 'memory-pack')
  const standardCollections = collections.filter(collection => 
    !collection.designMetadata?.packType || collection.designMetadata?.packType !== 'memory-pack'
  );
  
  useEffect(() => {
    refreshCards();
  }, [refreshCards]);

  const handleViewCollection = (collectionId: string) => {
    navigate(`/collections/${collectionId}`);
  };
  
  const handleViewPack = (packId: string) => {
    navigate(`/packs/${packId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturedCardsSection cards={cards} isLoading={isLoading} />
      <CollectionsSection 
        collections={standardCollections} 
        isLoading={isLoading} 
        handleViewCollection={handleViewCollection} 
      />
      <MemoryPacksSection 
        packs={memoryPacks} 
        isLoading={isLoading} 
        handleViewPack={handleViewPack} 
      />
      <ArFeaturesSection />
      <SiteFooter />
    </div>
  );
};

export default Index;
