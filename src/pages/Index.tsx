
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import HeroSection from '@/components/card-showcase/HeroSection';
import SiteFooter from '@/components/card-showcase/SiteFooter';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import CreateCollectionDialog from '@/components/collections/CreateCollectionDialog';
import { PlusCircle } from 'lucide-react';

const Index = () => {
  const { collections } = useCards();
  const isLoading = false;
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  return (
    <PageLayout
      title="CardShow - CRD Collection"
      description="Cards Rendered Digitally™ - Create, collect and showcase your trading cards"
      fullWidth={true}
      hideBreadcrumbs={true}
    >
      <HeroSection />
      
      <Container className="py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Collections</h2>
            <p className="text-gray-600 mt-1">Browse and manage your card collections</p>
          </div>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </div>
        
        <CollectionGrid collections={collections} isLoading={isLoading} />
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Features</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      
      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      
      <SiteFooter />
    </PageLayout>
  );
};

export default Index;
