
import React from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import HeroSection from '@/components/card-showcase/HeroSection';
import SiteFooter from '@/components/card-showcase/SiteFooter';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

const Index = () => {
  const { collections } = useCards();
  const isLoading = false;
  
  return (
    <PageLayout
      title="CardShow - Digital Card Collection"
      description="Create, collect and showcase your trading cards"
    >
      <HeroSection />
      
      <Container className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Collections</h2>
            <p className="text-gray-600 mt-1">Browse and manage your card collections</p>
          </div>
          
          <Link to="/collections/new">
            <Button>Create Collection</Button>
          </Link>
        </div>
        
        <CollectionGrid collections={collections} isLoading={isLoading} />
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Card Detection</h3>
              <p className="text-gray-600 mb-4">Scan and digitize your physical trading cards</p>
              <Link to="/detector" className="text-blue-600 hover:underline">Try it now →</Link>
            </div>
            
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <h3 className="font-semibold text-lg mb-2">AR Viewer</h3>
              <p className="text-gray-600 mb-4">View your cards in augmented reality</p>
              <Link to="/labs" className="text-blue-600 hover:underline">Explore Dugout Labs →</Link>
            </div>
            
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Game Day Mode</h3>
              <p className="text-gray-600 mb-4">Capture and share memories during live games</p>
              <Link to="/features/gameday" className="text-blue-600 hover:underline">Check it out →</Link>
            </div>
          </div>
        </div>
      </Container>
      
      <SiteFooter />
    </PageLayout>
  );
};

export default Index;
