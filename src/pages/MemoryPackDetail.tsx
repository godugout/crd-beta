import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCards } from '@/context/CardContext';
import { 
  ChevronRight, 
  Package, 
  Settings, 
  PlusCircle, 
  ArrowLeft, 
  AlertCircle,
  Image,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CardGallery from '@/components/CardGallery';
import FullscreenViewer from '@/components/gallery/FullscreenViewer';
import { toast } from 'sonner';
import { Card, Collection } from '@/lib/schema/types';

const MemoryPackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { collections, cards, isLoading } = useCards();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [isUnwrapped, setIsUnwrapped] = useState(false);
  
  const pack = collections.find(c => c.id === id);
  
  const packCards = cards.filter(card => card.collectionId === id);
  
  console.log("Memory Pack:", pack);
  console.log("Pack cards:", packCards);
  
  useEffect(() => {
    if (!isLoading && !pack) {
      toast.error('Memory Pack not found');
      navigate('/collections');
    }
  }, [pack, isLoading, navigate]);
  
  const cardsWithFixedTypes: Card[] = packCards.map(card => ({
    ...card,
    designMetadata: {
      ...card.designMetadata,
      oaklandMemory: card.designMetadata?.oaklandMemory ? {
        ...card.designMetadata.oaklandMemory,
        title: card.designMetadata.oaklandMemory.title || card.title || '',
        description: card.designMetadata.oaklandMemory.description || card.description || ''
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
  
  const handleUnwrap = () => {
    setIsUnwrapping(true);
    setTimeout(() => {
      setIsUnwrapped(true);
      setIsUnwrapping(false);
    }, 1500);
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
        <div className="flex items-center text-sm text-gray-500 py-4 mt-4">
          <Link to="/" className="hover:text-cardshow-blue">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/collections" className="hover:text-cardshow-blue">Collections</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-cardshow-dark font-medium">
            {pack?.name || 'Memory Pack'}
          </span>
        </div>
        
        {pack ? (
          <>
            {!isUnwrapped ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div 
                  className={`relative w-full max-w-md aspect-[3/4] rounded-xl shadow-xl overflow-hidden ${
                    isUnwrapping ? 'animate-unwrap' : ''
                  }`}
                  style={{
                    backgroundColor: pack.designMetadata?.wrapperColor || '#3b82f6',
                    backgroundImage: pack.designMetadata?.wrapperPattern === 'gradient' 
                      ? `linear-gradient(to right, ${pack.designMetadata?.wrapperColor || '#3b82f6'}, white)` 
                      : undefined
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <Package className="h-16 w-16 text-white mb-4" />
                    
                    <h2 className="text-2xl font-bold text-white text-shadow text-center mb-2">
                      {pack.name}
                    </h2>
                    
                    {pack.description && (
                      <p className="text-white text-shadow text-center mb-6 max-w-xs">
                        {pack.description}
                      </p>
                    )}
                    
                    <div className="flex -space-x-3 mb-6">
                      {packCards.slice(0, 5).map((card: Card) => (
                        <div 
                          key={card.id}
                          className="w-12 h-12 rounded-full border-2 border-white overflow-hidden"
                        >
                          <img 
                            src={card.thumbnailUrl || card.imageUrl} 
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {packCards.length > 5 && (
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-white/30 backdrop-blur-md flex items-center justify-center text-xs text-white font-medium">
                          +{packCards.length - 5}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <span className="text-sm text-white bg-white/20 rounded-full px-3 py-1 backdrop-blur-md">
                        {packCards.length} {packCards.length === 1 ? 'card' : 'cards'}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="font-medium"
                        onClick={handleUnwrap}
                        disabled={isUnwrapping}
                      >
                        {isUnwrapping ? 'Unwrapping...' : 'Unwrap Pack'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/collections')}
                    className="flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Collections
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/packs/${id}/edit`)}
                    className="flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Pack
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="py-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="h-6 w-6 text-cardshow-blue" />
                    <h1 className="text-3xl font-bold text-cardshow-dark">{pack.name}</h1>
                  </div>
                  <p className="text-cardshow-slate">{pack.description}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    {pack.visibility === 'public' ? (
                      <span className="flex items-center text-xs text-gray-500">
                        <Image className="h-3 w-3 mr-1" /> Public
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-gray-500">
                        <Lock className="h-3 w-3 mr-1" /> Private
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-cardshow-slate">
                    {packCards.length} {packCards.length === 1 ? 'card' : 'cards'} in this pack
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/packs/${id}/edit`)}
                      className="flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Pack
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
                
                {packCards.length > 0 ? (
                  <CardGallery 
                    cards={packCards} 
                    viewMode="grid" 
                    onCardClick={handleCardClick} 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-cardshow-neutral rounded-full p-6 mb-4">
                      <PlusCircle className="h-8 w-8 text-cardshow-slate" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No cards in this pack</h3>
                    <p className="text-cardshow-slate mb-6 max-w-md">
                      Add cards to this pack to view them here.
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
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-red-100 rounded-full p-6 mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Memory Pack Not Found</h3>
            <p className="text-cardshow-slate mb-6">
              The memory pack you're looking for doesn't exist or has been deleted.
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

export default MemoryPackDetail;
