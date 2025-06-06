
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import HeroSection from '@/components/card-showcase/HeroSection';
import SiteFooter from '@/components/card-showcase/SiteFooter';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { Container } from '@/components/ui/container';
import CreateCollectionDialog from '@/components/collections/CreateCollectionDialog';
import { PlusCircle, Zap, Camera, Palette } from 'lucide-react';

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
      
      <Container className="py-16">
        {/* Enhanced Collections Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div className="relative">
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Your Collections</h2>
            <p className="text-xl text-[var(--text-secondary)] font-medium">Browse and manage your card collections</p>
            {/* Sharp accent */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] clip-corner-tl opacity-60"></div>
          </div>
          
          <div className="relative">
            <CrdButton 
              onClick={() => setShowCreateDialog(true)}
              variant="spectrum"
              size="lg"
              className="btn-sharp font-bold shadow-[var(--shadow-brand)]"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Collection
            </CrdButton>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--brand-accent)] clip-corner-tr opacity-90"></div>
          </div>
        </div>
        
        <CollectionGrid collections={collections} isLoading={isLoading} />
        
        {/* Enhanced Features Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
              Latest <span className="text-brand-gradient">Features</span>
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Discover powerful tools that bring your cards to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card Detection */}
            <div className="group">
              <div className="bento-card brand-card-primary relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] clip-corner-tr"></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Card Detection</h3>
                  <p className="text-[var(--text-tertiary)] mb-6 leading-relaxed flex-grow">
                    Scan and digitize your physical trading cards with AI-powered detection and enhancement
                  </p>
                  <Link 
                    to="/detector" 
                    className="inline-flex items-center text-[var(--brand-primary)] font-semibold hover:text-[var(--brand-secondary)] transition-colors group-hover:translate-x-2 duration-300"
                  >
                    Try it now →
                  </Link>
                </div>
              </div>
            </div>
            
            {/* AR Viewer */}
            <div className="group">
              <div className="bento-card brand-card-accent relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-warning)] clip-corner-tr"></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-warning)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">AR Viewer</h3>
                  <p className="text-[var(--text-tertiary)] mb-6 leading-relaxed flex-grow">
                    View your cards in augmented reality with stunning 3D effects and realistic lighting
                  </p>
                  <Link 
                    to="/labs" 
                    className="inline-flex items-center text-[var(--brand-accent)] font-semibold hover:text-[var(--brand-warning)] transition-colors group-hover:translate-x-2 duration-300"
                  >
                    Explore Dugout Labs →
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Game Day Mode */}
            <div className="group">
              <div className="bento-card relative overflow-hidden h-full bg-gradient-to-br from-[var(--brand-success)]/10 to-[var(--brand-success)]/5 border border-[var(--brand-success)]/20 hover:border-[var(--brand-success)]/40">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[var(--brand-success)] to-[var(--brand-primary)] clip-corner-tr"></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-success)] to-[var(--brand-primary)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Game Day Mode</h3>
                  <p className="text-[var(--text-tertiary)] mb-6 leading-relaxed flex-grow">
                    Capture and share memories during live games with real-time card creation
                  </p>
                  <Link 
                    to="/features/gameday" 
                    className="inline-flex items-center text-[var(--brand-success)] font-semibold hover:text-[var(--brand-primary)] transition-colors group-hover:translate-x-2 duration-300"
                  >
                    Check it out →
                  </Link>
                </div>
              </div>
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
