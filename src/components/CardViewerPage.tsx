
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/hooks/useCards';
import CardViewer from '@/components/card-viewer/CardViewer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';
import { toast } from 'sonner';
import { adaptToCard } from '@/lib/adapters/typeAdapters';

const CardViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const { cards, getCardById } = useCards();
  const [fullscreen, setFullscreen] = useState(false);
  const navigate = useNavigate();
  
  const card = id ? getCardById(id) : undefined;
  const cardIndex = card ? cards.findIndex(c => c.id === card.id) : -1;
  
  // Helper to safely extract properties from designMetadata
  const getCardProperty = (property: string, fallback: string = ''): string => {
    if (!card) return fallback;
    if (card[property as keyof typeof card]) return card[property as keyof typeof card] as string;
    if (card.designMetadata?.[property]) return card.designMetadata[property] as string;
    return fallback;
  };
  
  // Safely extract properties for display
  const cardPlayer = getCardProperty('player', '');
  const cardTeam = getCardProperty('team', '');
  const cardYear = getCardProperty('year', '');
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      } else if (e.key === 'ArrowLeft' && cardIndex > 0) {
        navigate(`/view/${cards[cardIndex - 1].id}`);
      } else if (e.key === 'ArrowRight' && cardIndex < cards.length - 1) {
        navigate(`/view/${cards[cardIndex + 1].id}`);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen, cardIndex, cards, navigate]);
  
  if (!card) {
    return (
      <PageLayout
        title="Card Not Found"
        description="The card you're looking for doesn't exist."
      >
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
          <p className="text-gray-500 mb-6">The card you're looking for may have been removed or doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Back to Collection</Button>
        </div>
      </PageLayout>
    );
  }
  
  const navigateToCard = (direction: 'next' | 'prev') => {
    if (direction === 'prev' && cardIndex > 0) {
      navigate(`/view/${cards[cardIndex - 1].id}`);
    } else if (direction === 'next' && cardIndex < cards.length - 1) {
      navigate(`/view/${cards[cardIndex + 1].id}`);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description || `Check out this ${card.title} card!`,
        url: window.location.href
      }).then(() => {
        toast.success('Card shared successfully!');
      }).catch((error) => {
        console.error('Error sharing card:', error);
        navigator.clipboard.writeText(window.location.href)
          .then(() => toast.success('Link copied to clipboard'))
          .catch(() => toast.error('Failed to copy link'));
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };
  
  const handleCapture = () => {
    // Future implementation for saving card image
    toast.info('Card snapshot feature coming soon');
  };
  
  const processedCard = adaptToCard(card);
  
  return (
    <>
      <PageLayout
        title={card.title}
        description={card.description || "Viewing card details"}
        className={fullscreen ? 'hidden' : ''}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="w-full md:w-2/3 mx-auto md:mx-0 max-w-xl relative">
              <CardViewer 
                card={processedCard}
                isFlipped={false}
                activeEffects={processedCard.effects || []}
                onShare={handleShare}
                onCapture={handleCapture}
                onBack={() => navigate('/')}
                isFullscreen={false}
                onClose={() => {}}
              />
            </div>
            
            <div className="w-full md:w-1/3 space-y-6">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">{card.title}</h2>
                
                {card.description && <p className="text-gray-300 mb-4">{card.description}</p>}
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {cardPlayer && (
                    <div>
                      <p className="text-sm text-gray-500">Player</p>
                      <p className="font-medium">{cardPlayer}</p>
                    </div>
                  )}
                  
                  {cardTeam && (
                    <div>
                      <p className="text-sm text-gray-500">Team</p>
                      <p className="font-medium">{cardTeam}</p>
                    </div>
                  )}
                  
                  {cardYear && (
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">{cardYear}</p>
                    </div>
                  )}
                </div>
                
                {card.tags && card.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigateToCard('prev')}
                  disabled={cardIndex <= 0}
                >
                  <ChevronLeft className="mr-2" size={16} />
                  Previous Card
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigateToCard('next')}
                  disabled={cardIndex >= cards.length - 1}
                >
                  Next Card
                  <ChevronRight className="ml-2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
      
      {fullscreen && processedCard && (
        <div className="fixed inset-0 z-50 bg-black">
          <CardViewer
            card={processedCard}
            isFlipped={false}
            activeEffects={processedCard.effects || []}
            isFullscreen={true}
            onShare={handleShare}
            onCapture={handleCapture}
            onClose={() => setFullscreen(false)}
          />
        </div>
      )}
    </>
  );
};

export default CardViewerPage;
