
import React from 'react';
import Navbar from '@/components/Navbar';
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

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cards, isLoading } = useCardData();
  const { collections } = useCards();
  
  const handleViewCard = (id: string) => {
    navigate(`/card/${id}`);
  };
  
  const handleCreateCard = () => {
    navigate('/card/create');
  };
  
  const handleViewPack = (id: string) => {
    navigate(`/pack/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
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
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default Index;
