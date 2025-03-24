import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { ChevronRight, FolderOpen, Settings, PlusCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CardGallery from '@/components/CardGallery';
import FullscreenViewer from '@/components/gallery/FullscreenViewer';
import { toast } from 'sonner';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { collections, cards, isLoading } = useCards();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Find the collection by ID
  const collection = collections.find(c => c.id === id);
  
  // Get cards that belong to this collection
  const collectionCards = cards.filter(card => card.collectionId === id);
  
  // Debug logging
  console.log("Collection:", collection);
  console.log("Collection cards:", collectionCards);
  
  useEffect(() => {
    if (!isLoading && !collection) {
      toast.error('Collection not found');
      navigate('/collections');
    }
  }, [collection, isLoading, navigate]);
  
  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsFullscreen(true);
  };
  
  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };
  
  if (isFullscreen && selectedCardId) {
    return (
      <FullscreenViewer 
        cardId={selectedCardId} 
        onClose={handleCloseFullscreen}
      />
    );
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 pt-20">
          <div className="animate-pulse mt-8">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-100 rounded mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto max-w-6xl px-4 pt-16 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 py-4 mt-4">
          <Link to="/" className="hover:text-cardshow-blue">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/collections" className="hover:text-cardshow-blue">Collections</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-cardshow-dark font-medium">
            {collection?.name || 'Collection Details'}
          </span>
        </div>
        
        {collection ? (
          <>
            <div className="py-6">
              <div className="flex items-center gap-3 mb-2">
                <FolderOpen className="h-6 w-6 text-cardshow-blue" />
                <h1 className="text-3xl font-bold text-cardshow-dark">{collection.name}</h1>
              </div>
              <p className="text-cardshow-slate">{collection.description}</p>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-cardshow-slate">
                {collectionCards.length} {collectionCards.length === 1 ? 'card' : 'cards'} in collection
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/collections/${id}/edit`)}
                  className="flex items-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Collection
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/editor', { state: { collectionId: id } })}
                  className="flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </div>
            
            {/* Display cards */}
            {collectionCards.length > 0 ? (
              <CardGallery 
                cards={collectionCards} 
                viewMode={viewMode} 
                onCardClick={handleCardClick} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-cardshow-neutral rounded-full p-6 mb-4">
                  <PlusCircle className="h-8 w-8 text-cardshow-slate" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No cards in this collection</h3>
                <p className="text-cardshow-slate mb-6 max-w-md">
                  Add cards to this collection to view them here.
                </p>
                <Button
                  onClick={() => navigate('/editor', { state: { collectionId: id } })}
                  className="flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Your First Card
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-red-100 rounded-full p-6 mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Collection Not Found</h3>
            <p className="text-cardshow-slate mb-6">
              The collection you're looking for doesn't exist or has been deleted.
            </p>
            <Button
              onClick={() => navigate('/collections')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CollectionDetail;
