
import React from 'react';
import HeroSection from '@/components/card-showcase/HeroSection';
import FeaturedCardsSection from '@/components/card-showcase/FeaturedCardsSection';
import CollectionsSection from '@/components/card-showcase/CollectionsSection';
import ArFeaturesSection from '@/components/card-showcase/ArFeaturesSection';
import MemoryPacksSection from '@/components/card-showcase/MemoryPacksSection';
import SiteFooter from '@/components/card-showcase/SiteFooter';
import { useCards } from '@/context/CardContext';
import { useAuth } from '@/context/auth/useAuth';
import { useCardData } from '@/components/gallery/useCardData';
import { useNavigate } from 'react-router-dom';
import MetaTags from '@/components/shared/MetaTags';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cards, isLoading } = useCardData();
  const { collections } = useCards();
  
  const handleViewCard = (id: string) => {
    navigate(`/cards/${id}`);
  };
  
  const handleCreateCard = () => {
    navigate('/cards/create');
  };
  
  const handleViewPack = (id: string) => {
    navigate(`/packs/${id}`);
  };

  return (
    <>
      <MetaTags 
        title="Home" 
        description="Create, collect, and share digital trading cards with CardShow."
      />
      
      <div className="flex flex-col">
        <HeroSection />
        
        {/* Featured Cards */}
        <FeaturedCardsSection 
          isLoading={isLoading}
          featuredCards={cards.slice(0, 6)}
          handleViewCard={handleViewCard}
          handleCreateCard={handleCreateCard}
        />
        
        {/* Collections */}
        <CollectionsSection 
          collections={collections}
          isLoading={false}
        />
        
        {/* Memory Packs */}
        <MemoryPacksSection 
          isLoading={isLoading}
          packs={[]}
          handleViewPack={handleViewPack}
        />
        
        {/* AR Features */}
        <ArFeaturesSection />
      </div>
      
      <SiteFooter />
    </>
  );
};

export default Index;
