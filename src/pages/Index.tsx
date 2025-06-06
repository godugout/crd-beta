import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import OaklandHeroSection from '@/components/oakland/OaklandHeroSection';
import SiteFooter from '@/components/card-showcase/SiteFooter';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import CreateCollectionDialog from '@/components/collections/CreateCollectionDialog';
import { PlusCircle, Camera, Users, Timeline } from 'lucide-react';

const Index = () => {
  const { collections } = useCards();
  const isLoading = false;
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  return (
    <PageLayout
      title="OAK.FAN - Preserve Your Oakland Sports Story"
      description="Digital memory preservation for Oakland sports fans"
      fullWidth={true}
      hideBreadcrumbs={true}
    >
      <OaklandHeroSection />
      
      {/* Oakland Sports Eras Section */}
      <Container className="py-16 bg-gradient-to-b from-[#006341]/5 to-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#003831] mb-4">Oakland Sports Legacy</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From the Dynasty years to the Moneyball era, Oakland has a rich sports history. 
            Your memories are part of that story.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border-l-4 border-[#EFB21E]">
            <h3 className="font-bold text-lg text-[#003831] mb-2">Dynasty Era</h3>
            <p className="text-gray-600 text-sm">
              1972-1974 Three-peat World Series champions
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border-l-4 border-[#EFB21E]">
            <h3 className="font-bold text-lg text-[#003831] mb-2">Bash Brothers</h3>
            <p className="text-gray-600 text-sm">
              1988-1990 Canseco & McGwire era
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border-l-4 border-[#EFB21E]">
            <h3 className="font-bold text-lg text-[#003831] mb-2">Moneyball</h3>
            <p className="text-gray-600 text-sm">
              2002-2006 Billy Beane's revolutionary approach
            </p>
          </div>
        </div>
      </Container>
      
      {/* Your Collections - Keep for existing users */}
      <Container className="py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Memory Collections</h2>
            <p className="text-gray-600 mt-1">Organize your Oakland sports memories</p>
          </div>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </div>
        
        <CollectionGrid collections={collections} isLoading={isLoading} />
        
        {/* Future Features Preview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Coming Soon</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6 bg-white shadow-sm opacity-75">
              <div className="h-12 w-12 bg-[#006341]/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#006341]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community Gallery</h3>
              <p className="text-gray-600 mb-4">Browse and discover other Oakland fans' memories</p>
              <span className="text-[#006341] text-sm font-medium">Coming Soon</span>
            </div>
            
            <div className="border rounded-lg p-6 bg-white shadow-sm opacity-75">
              <div className="h-12 w-12 bg-[#006341]/10 rounded-full flex items-center justify-center mb-4">
                <Timeline className="h-6 w-6 text-[#006341]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Oakland Timeline</h3>
              <p className="text-gray-600 mb-4">Connect your memories to historic Oakland sports moments</p>
              <span className="text-[#006341] text-sm font-medium">Coming Soon</span>
            </div>
            
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="h-12 w-12 bg-[#006341]/10 rounded-full flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-[#006341]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Memory Enhancement</h3>
              <p className="text-gray-600 mb-4">Add vintage effects and visual enhancements to your photos</p>
              <Link to="/oakland/create" className="text-[#006341] hover:underline">Try it now →</Link>
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
