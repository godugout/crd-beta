import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { ArrowLeft } from 'lucide-react';
import CardDetailed from '@/components/cards/CardDetailed';
import RelatedCards from '@/components/cards/RelatedCards';
import { useCardOperations } from '@/hooks/useCardOperations';
import FullscreenViewer from '@/components/gallery/FullscreenViewer';
import { Card } from '@/lib/types';
import { sampleCards } from '@/lib/data/sampleCards';
import { toast } from '@/hooks/use-toast';
import { adaptToCard } from '@/lib/adapters/cardAdapter';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import { DetailedViewCard, ensureDetailedViewCard } from '@/types/detailedCardTypes';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards, getCard } = useCards();
  const cardOperations = useCardOperations();
  const [showViewer, setShowViewer] = useState(false);
  const [resolvedCard, setResolvedCard] = useState<Card | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!id) {
      console.error('CardDetail: No ID provided in URL params');
      return;
    }
    
    console.log('CardDetail: Rendering for ID:', id);
    
    let foundCard = sampleCards.find(c => c.id === id);
    
    if (!foundCard) {
      console.log('CardDetail: Card not found in sampleCards, checking context for ID:', id);
      foundCard = getCard ? getCard(id) : cards.find(c => c.id === id);
    }
    
    if (foundCard) {
      console.log('CardDetail: Found card:', foundCard.title, 'with imageUrl:', foundCard.imageUrl);
      
      const processedCard = ensureDetailedViewCard(adaptToCard({
        ...foundCard,
        imageUrl: foundCard.imageUrl || FALLBACK_IMAGE,
        thumbnailUrl: foundCard.thumbnailUrl || foundCard.imageUrl || FALLBACK_IMAGE,
        designMetadata: foundCard.designMetadata || DEFAULT_DESIGN_METADATA,
        createdAt: foundCard.createdAt || new Date().toISOString(),
        updatedAt: foundCard.updatedAt || new Date().toISOString(),
        userId: foundCard.userId || 'anonymous',
        effects: foundCard.effects || []
      }));
      
      setResolvedCard(processedCard);
      
      if (processedCard.imageUrl && processedCard.imageUrl !== FALLBACK_IMAGE) {
        const img = new Image();
        img.onerror = () => {
          console.error('CardDetail: Image failed to preload:', processedCard.imageUrl);
          setResolvedCard(prev => prev ? ensureDetailedViewCard(adaptToCard({ 
            ...prev, 
            imageUrl: FALLBACK_IMAGE,
            thumbnailUrl: FALLBACK_IMAGE 
          })) : null);
        };
        img.src = processedCard.imageUrl;
      }
    } else {
      console.error('CardDetail: Card not found at all for ID:', id);
      toast({
        title: "Card not found",
        description: "The requested card could not be found",
        variant: "destructive"
      });
    }
  }, [id, cards, getCard]);
  
  if (!resolvedCard) {
    return (
      <PageLayout
        title="Card Not Found"
        description="The requested card could not be found"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Card Not Found</h1>
            <p className="text-gray-600 mb-8">
              The card you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/cards')}>
              Browse All Cards
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  const handleDeleteSuccess = () => {
    navigate('/cards');
  };

  if (showViewer && isLoaded) {
    return (
      <FullscreenViewer 
        cardId={id || ''} 
        onClose={() => setShowViewer(false)} 
      />
    );
  }
  
  return (
    <PageLayout
      title={resolvedCard?.title || "Card Detail"}
      description={resolvedCard?.description || "View card details"}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
        
        <CardDetailed 
          card={resolvedCard}
          onView={() => setShowViewer(true)}
          onEdit={cardOperations.editCard}
          onShare={() => cardOperations.shareCard(resolvedCard)}
          onDelete={(id) => cardOperations.removeCard(id, handleDeleteSuccess)}
        />
        
        <RelatedCards 
          cards={sampleCards.filter(card => card.id !== resolvedCard.id)}
          currentCardId={resolvedCard.id}
          onCardClick={(id) => navigate(`/cards/${id}`)}
          className="mt-16"
        />
      </div>
    </PageLayout>
  );
};

export default CardDetail;
