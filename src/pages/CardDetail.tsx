
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCardOperations } from '@/hooks/useCardOperations';
import FullscreenViewer from '@/components/gallery/FullscreenViewer';
import { useCardDetail, CardDetailedViewCard } from '@/hooks/useCardDetail';
import { RelatedCards } from '@/components/cards';
import CardDetailedView from '@/components/cards/CardDetailedView';
import { toStandardCard } from '@/lib/utils/cardConverters';
import { ensureCardRarity } from '@/lib/utils/CardRarityUtils';
import { sampleCards } from '@/lib/data/sampleCards';

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cardOperations = useCardOperations();
  const [showViewer, setShowViewer] = useState(false);
  const { resolvedCard, FALLBACK_IMAGE } = useCardDetail(id);
  
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
  
  if (showViewer && resolvedCard) {
    return (
      <FullscreenViewer 
        card={resolvedCard}
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
        
        <CardDetailedView
          card={resolvedCard}
          onView={() => setShowViewer(true)}
          onEdit={() => cardOperations.editCard(resolvedCard.id)}
          onShare={() => cardOperations.shareCard(resolvedCard)}
          onDelete={() => cardOperations.removeCard(resolvedCard.id, () => navigate('/cards'))}
        />
        
        <RelatedCards 
          cards={sampleCards.filter(card => card.id !== resolvedCard?.id).map(card => {
            // Create a complete card with all required properties
            const completeCard = {
              ...card,
              imageUrl: card.imageUrl || FALLBACK_IMAGE,
              thumbnailUrl: card.thumbnailUrl || card.imageUrl || FALLBACK_IMAGE,
              description: card.description || '',
              isFavorite: card.isFavorite ?? false,
              rarity: ensureCardRarity(card.rarity),
              userId: card.userId || 'anonymous',
              createdAt: card.createdAt || new Date().toISOString(),
              updatedAt: card.updatedAt || new Date().toISOString(),
              tags: card.tags || [],
              effects: card.effects || []
            };
            
            return toStandardCard(completeCard) as CardDetailedViewCard;
          })}
          currentCardId={resolvedCard?.id || ''}
          onCardClick={(id) => navigate(`/cards/${id}`)}
          className="mt-16"
        />
      </div>
    </PageLayout>
  );
};

export default CardDetail;
