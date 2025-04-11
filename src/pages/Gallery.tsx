
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import CardGallery from '@/components/CardGallery';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import useGalleryCards from '@/components/gallery/useGalleryCards';
import FullscreenViewer from '@/components/gallery/FullscreenViewer';
import { PlusCircle } from 'lucide-react';

const Gallery = () => {
  const { isMobile } = useMobileOptimization();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const {
    displayCards,
    isLoading
  } = useGalleryCards();

  const handleCardClick = (cardId: string) => {
    console.log('Card clicked:', cardId);
    setSelectedCardId(cardId);
    setIsFullscreen(true);
  };
  
  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setSelectedCardId(null);
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
      onSearch={setSearchQuery}
      searchPlaceholder="Search cards..."
      primaryAction={{
        label: "New Card",
        icon: <PlusCircle className="mr-2 h-5 w-5" />,
        href: "/cards/create"
      }}
    >
      <div className="container mx-auto max-w-6xl px-4">        
        <ErrorBoundary>
          <CardGallery 
            viewMode={viewMode} 
            onCardClick={handleCardClick} 
            cards={displayCards}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        </ErrorBoundary>
      </div>
    </PageLayout>
  );
};

export default Gallery;
