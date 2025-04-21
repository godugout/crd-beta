
import React, { useState, useEffect, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import CardGallery from '@/components/CardGallery';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { PlusCircle, Info } from 'lucide-react';
import { Card } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCards } from '@/hooks/useCards';
import FullscreenViewer from '@/components/gallery/FullscreenViewer';

const Gallery = () => {
  const { isMobile } = useMobileOptimization();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  
  const { cards, isLoading, fetchCards } = useCards();

  useEffect(() => {
    fetchCards();
    
    const hasSeenTutorial = localStorage.getItem('hasSeenGalleryTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, [fetchCards]);

  const completeTutorial = () => {
    localStorage.setItem('hasSeenGalleryTutorial', 'true');
    setShowTutorial(false);
    
    toast({
      variant: "info",
      title: "Tutorial completed",
      description: "You can access help anytime via the info icon",
    });
  };

  const handleCardClick = (cardId: string) => {
    console.log('Card clicked:', cardId);
    // Use startTransition to avoid the Suspense error
    startTransition(() => {
      setSelectedCardId(cardId);
      setIsFullscreen(true);
    });
    
    const hasSeenViewer = localStorage.getItem('hasSeenViewerTutorial');
    if (!hasSeenViewer) {
      toast({
        variant: "info",
        title: "Tip: Interactive Card Viewer",
        description: "Try dragging the card or using the effect controls for an immersive experience",
      });
    }
  };
  
  const handleCloseFullscreen = () => {
    startTransition(() => {
      setIsFullscreen(false);
      setSelectedCardId(null);
    });
  };
  
  if (isFullscreen && selectedCardId) {
    return (
      <React.Suspense fallback={
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      }>
        <FullscreenViewer 
          cardId={selectedCardId} 
          onClose={handleCloseFullscreen}
        />
      </React.Suspense>
    );
  }
  
  const handleRefresh = async () => {
    startTransition(() => {
      fetchCards();
    });
    
    toast({
      title: "Gallery refreshed",
      description: "Your card collection has been refreshed",
    });
  };
  
  return (
    <PageLayout
      title="Card Gallery"
      onSearch={setSearchQuery}
      searchPlaceholder="Search cards..."
      primaryAction={{
        label: "New Card",
        icon: <PlusCircle className="mr-2 h-5 w-5" />,
        href: "/cards/create"
      }}
      actions={
        <button
          onClick={() => setShowTutorial(true)}
          className="p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Show help"
        >
          <Info size={20} className="text-gray-400" />
        </button>
      }
    >
      <div className="container mx-auto max-w-6xl px-4">        
        <ErrorBoundary>
          {isPending && (
            <div className="w-full py-8 flex justify-center">
              <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
            </div>
          )}
          
          {!isLoading && (!cards || cards.length === 0) && (
            <div className="py-16 text-center">
              <h2 className="text-2xl font-bold mb-4">Your gallery is empty</h2>
              <p className="text-gray-400 mb-8">Create your first card to get started with your collection</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => navigate('/cards/create')}>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Your First Card
                </Button>
                <Button variant="outline" onClick={handleRefresh}>
                  Refresh Gallery
                </Button>
              </div>
            </div>
          )}
          
          {(cards?.length > 0 || isLoading) && (
            <CardGallery 
              viewMode={viewMode} 
              onCardClick={handleCardClick} 
              cards={(cards || []) as Card[]}
              isLoading={isLoading}
              searchQuery={searchQuery}
            />
          )}
        </ErrorBoundary>
      </div>
      
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="bg-gray-900 text-white border border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Welcome to the Card Gallery</DialogTitle>
            <DialogDescription className="text-gray-300">
              Let's explore key features to help you get started
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <PlusCircle className="mr-2 h-4 w-4 text-green-400" />
                Creating Cards
              </h3>
              <p className="text-gray-300 text-sm">
                Click the "New Card" button to create custom digital cards with various effects and designs.
              </p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Info className="mr-2 h-4 w-4 text-blue-400" />
                Viewing Cards
              </h3>
              <p className="text-gray-300 text-sm">
                Click on any card to open it in the immersive viewer. Once open, you can:
              </p>
              <ul className="list-disc pl-5 mt-2 text-gray-300 text-sm">
                <li>Drag the card to rotate it in 3D space</li>
                <li>Apply visual effects using the sidebar</li>
                <li>Save snapshots of your favorite effect combinations</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center"><kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs mr-2">Esc</kbd> Close viewer</div>
                <div className="flex items-center"><kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs mr-2">F</kbd> Flip card</div>
                <div className="flex items-center"><kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs mr-2">E</kbd> Toggle effects panel</div>
                <div className="flex items-center"><kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs mr-2">S</kbd> Take snapshot</div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={completeTutorial}>
              Got it, thanks!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Gallery;
