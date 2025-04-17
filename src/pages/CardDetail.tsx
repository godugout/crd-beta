import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { useCards } from '@/hooks/useCards';
import { ArrowLeft } from 'lucide-react';
import { useCardOperations } from '@/hooks/useCardOperations';
import FullscreenViewer from '@/components/gallery/FullscreenViewer';
import { Card, CardRarity } from '@/lib/types';
import { sampleCards } from '@/lib/data/sampleCards';
import { toast } from '@/hooks/use-toast';
import { adaptToCard } from '@/lib/adapters/typeAdapters';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

interface CardDetailedProps {
  card: Card;
  onEdit: () => void;
  onShare: () => void;
  onDelete: () => void;
  onView: () => void;
}

const CardDetailed: React.FC<CardDetailedProps> = ({ card, onEdit, onShare, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 lg:w-2/5">
          <div className="aspect-[2.5/3.5] relative rounded-lg overflow-hidden">
            <img 
              src={card.imageUrl} 
              alt={card.title} 
              className="w-full h-full object-cover cursor-pointer"
              onClick={onView}
            />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-700 mb-6">{card.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {card.player && <div><span className="font-medium">Player:</span> {card.player}</div>}
            {card.team && <div><span className="font-medium">Team:</span> {card.team}</div>}
            {card.year && <div><span className="font-medium">Year:</span> {card.year}</div>}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {card.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <Button onClick={onEdit}>Edit Card</Button>
            <Button variant="outline" onClick={onShare}>Share Card</Button>
            <Button variant="destructive" onClick={onDelete}>Delete Card</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RelatedCardsProps {
  cards: Card[];
  currentCardId: string;
  onCardClick: (id: string) => void;
  className?: string;
}

const RelatedCards: React.FC<RelatedCardsProps> = ({ cards, currentCardId, onCardClick, className }) => {
  const processedCards = cards.map(card => ({
    ...card,
    isFavorite: card.isFavorite ?? false,
    description: card.description || ''
  }));
  
  const filteredCards = processedCards
    .filter(card => card.id !== currentCardId)
    .slice(0, 4);
  
  if (filteredCards.length === 0) return null;
  
  return (
    <div className={className}>
      <h3 className="text-xl font-bold mb-4">Related Cards</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredCards.map(card => (
          <div 
            key={card.id}
            className="cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            onClick={() => onCardClick(card.id)}
          >
            <img 
              src={card.thumbnailUrl || card.imageUrl} 
              alt={card.title} 
              className="w-full aspect-[2.5/3.5] object-cover"
              onError={(e) => {
                e.currentTarget.src = '/card-placeholder.jpg';
              }}
            />
            <div className="p-2">
              <p className="font-medium truncate">{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    
    import('@/lib/adapters/typeAdapters').then(({ adaptToCard }) => {
      let foundCard = sampleCards.find(c => c.id === id);
      
      if (!foundCard) {
        console.log('CardDetail: Card not found in sampleCards, checking context for ID:', id);
        foundCard = getCard ? getCard(id) : cards.find(c => c.id === id);
      }
      
      if (foundCard) {
        console.log('CardDetail: Found card:', foundCard.title, 'with imageUrl:', foundCard.imageUrl);
        
        const processedCard = adaptToCard({
          ...foundCard,
          imageUrl: foundCard.imageUrl || FALLBACK_IMAGE,
          thumbnailUrl: foundCard.thumbnailUrl || foundCard.imageUrl || FALLBACK_IMAGE,
          description: foundCard.description || '',
          isFavorite: foundCard.isFavorite ?? false,
          rarity: foundCard.rarity || CardRarity.COMMON
        });
        
        setResolvedCard(processedCard);
        
        if (processedCard.imageUrl && processedCard.imageUrl !== FALLBACK_IMAGE) {
          const img = new Image();
          img.onerror = () => {
            console.error('CardDetail: Image failed to preload:', processedCard.imageUrl);
            setResolvedCard(prev => prev ? adaptToCard({ 
              ...prev, 
              imageUrl: FALLBACK_IMAGE,
              thumbnailUrl: FALLBACK_IMAGE,
              description: prev.description || ''
            }) : null);
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
    });
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
        
        {resolvedCard && (
          <CardDetailed 
            card={resolvedCard}
            onView={() => setShowViewer(true)}
            onEdit={() => cardOperations.editCard(resolvedCard.id)}
            onShare={() => cardOperations.shareCard(resolvedCard)}
            onDelete={() => cardOperations.removeCard(resolvedCard.id, () => navigate('/cards'))}
          />
        )}
        
        <RelatedCards 
          cards={sampleCards.filter(card => card.id !== resolvedCard?.id).map(card => adaptToCard(card))}
          currentCardId={resolvedCard?.id || ''}
          onCardClick={(id) => navigate(`/cards/${id}`)}
          className="mt-16"
        />
      </div>
    </PageLayout>
  );
};

export default CardDetail;
