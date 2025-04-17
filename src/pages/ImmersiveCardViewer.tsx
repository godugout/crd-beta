
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { useCardContext } from '@/context/card/hooks/useCardContext';
import CardViewer from '@/components/card-viewer/CardViewer';
import { Button } from '@/components/ui/button';

const ImmersiveCardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCard } = useCardContext();
  
  // Get the card using the ID from params
  const card = id ? getCard(id) : null;
  
  if (!card) {
    return (
      <PageLayout
        title="Card Not Found"
        description="The requested card could not be found."
      >
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Card Not Found</h1>
          <p className="text-gray-600 mb-8">
            The card you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/cards')}>
            Browse All Cards
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout
      title={`${card.title} | Immersive View`}
      description={card.description || `View ${card.title} in immersive mode.`}
    >
      <div className="fixed inset-0 bg-black z-10">
        <div className="absolute top-4 right-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/cards/${card.id}`)} 
            className="bg-black/50 hover:bg-black/70 text-white border-gray-700"
          >
            Exit Immersive View
          </Button>
        </div>
        
        <div className="h-full flex items-center justify-center">
          <CardViewer
            card={card}
            activeEffects={card.effects || []}
            isFullscreen={true}
            onBack={() => navigate(`/cards/${card.id}`)}
            onClose={() => navigate(`/cards/${card.id}`)}
            onShare={() => {
              if (navigator.share) {
                navigator.share({
                  title: card.title,
                  text: card.description,
                  url: window.location.href,
                }).catch(err => console.error('Error sharing card:', err));
              } else {
                navigator.clipboard.writeText(window.location.href);
                // In a real app, show a toast notification here
                alert('Link copied to clipboard');
              }
            }}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default ImmersiveCardViewer;
