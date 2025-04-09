
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import CardGallery from '@/components/CardGallery';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import GalleryHeader from '@/components/gallery/GalleryHeader';
import BaseballBanner from '@/components/gallery/BaseballBanner';
import ViewModeSelector from '@/components/gallery/ViewModeSelector';
import useGalleryCards from '@/components/gallery/useGalleryCards';
import FullscreenViewer from '@/components/gallery/FullscreenViewer';

const Gallery = () => {
  const { isMobile } = useMobileOptimization();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const {
    displayCards,
    hasBaseballCards,
    sortOrder,
    setSortOrder
  } = useGalleryCards();

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
        <GalleryHeader />
        <BaseballBanner isVisible={hasBaseballCards} />
        
        <ErrorBoundary>
          <ViewModeSelector 
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
          
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
