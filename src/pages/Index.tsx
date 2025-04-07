
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

const Index = () => {
  const { user } = useAuth();
  const { cards, isLoading } = useCardData();
  const { collections } = useCards();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Featured Cards */}
        <FeaturedCardsSection 
          title="Featured Cards" 
          cardsData={cards.slice(0, 6)}
          isLoading={isLoading}
        />
        
        {/* Collections */}
        <CollectionsSection 
          collections={collections}
        />
        
        {/* Memory Packs */}
        <MemoryPacksSection 
          isLoading={isLoading}
          packs={[]}
          handleViewPack={() => {}}
        />
        
        {/* AR Features */}
        <ArFeaturesSection />
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default Index;
