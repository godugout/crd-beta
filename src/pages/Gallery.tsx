import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import CardGallery from '@/components/CardGallery';
import { ChevronRight, Grid3X3, LayoutList, Tv2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCardData } from '@/hooks/useCardData';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FullscreenViewer from '@/components/gallery/FullscreenViewer';
import { Card } from '@/lib/types'; // Import from correct location

const Gallery = () => {
  const { isMobile } = useMobileOptimization();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('newest');
  
  const { 
    cards, 
    isLoading, 
    error, 
    refetch 
  } = useCardData({
    sort: (a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    },
    deps: [sortOrder]
  });
  
  const hasBaseballCards = cards.some(card => 
    card.tags?.some(tag => ['baseball', 'vintage'].includes(tag.toLowerCase()))
  );

  // Ensure consistent Card type
  const displayCards: Card[] = cards.map(card => ({
    ...card,
    designMetadata: {
      ...card.designMetadata,
      oaklandMemory: card.designMetadata?.oaklandMemory ? {
        ...card.designMetadata.oaklandMemory,
        title: card.title || '',
        description: card.description || ''
      } : undefined
    }
  }));

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsFullscreen(true);
  };
  
  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };
  
  const handleSortChange = (order: string) => {
    setSortOrder(order);
  };
  
  if (isFullscreen && selectedCardId) {
    return (
      <FullscreenViewer 
        cardId={selectedCardId} 
        onClose={handleCloseFullscreen}
      />
    );
  }
  
  return (
    <PageLayout
      title="Card Gallery"
      description="Browse your digital cards and collections"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center text-sm text-gray-500 py-4">
          <Link to="/" className="hover:text-cardshow-blue">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-cardshow-dark font-medium">Gallery</span>
        </div>
        
        <div className="py-6">
          <div className="flex items-center gap-3 mb-2">
            <Grid3X3 className="h-6 w-6 text-cardshow-blue" />
            <h1 className="text-3xl font-bold text-cardshow-dark">Your Card Gallery</h1>
          </div>
          <p className="text-cardshow-slate">
            Browse, search, and manage your digital card collection
          </p>
        </div>
        
        {hasBaseballCards && (
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg overflow-hidden shadow-lg">
            <div className="p-6 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-white text-xl font-bold mb-2 flex items-center">
                  <Tv2 className="mr-2 h-5 w-5" />
                  ESPN-Style Baseball Card Viewer
                </h2>
                <p className="text-blue-100">
                  Experience your vintage baseball cards in 3D with our immersive viewer featuring statistics and professional graphics
                </p>
              </div>
              <Button 
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => window.location.href = '/baseball-card-viewer'}
              >
                Launch Immersive Viewer
              </Button>
            </div>
          </div>
        )}
        
        <ErrorBoundary>
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center"
              >
                <LayoutList className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  {sortOrder === 'newest' && 'Newest First'}
                  {sortOrder === 'oldest' && 'Oldest First'}
                  {sortOrder === 'az' && 'A-Z'}
                  {sortOrder === 'za' && 'Z-A'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('newest')}
                  >
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('oldest')}
                  >
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('az')}
                  >
                    Alphabetical (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('za')}
                  >
                    Alphabetical (Z-A)
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <CardGallery 
            viewMode={viewMode} 
            onCardClick={handleCardClick} 
            cards={displayCards} 
          />
        </ErrorBoundary>
      </div>
    </PageLayout>
  );
};

export default Gallery;
