
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PageLayout from '@/components/navigation/PageLayout';
import ImmersiveCardViewer from '@/components/immersive-viewer/ImmersiveCardViewer';
import CardDetailPanel from '@/components/card-detail/CardDetailPanel';
import { Card } from '@/lib/types';
import { useCards } from '@/context/CardContext';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import useEffectsManager from '@/hooks/card-effects/useEffectsManager';

const ImmersiveCardViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards } = useCards();
  const [card, setCard] = useState<Card | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile } = useMobileOptimization();
  const { availableEffects, toggleEffect, activeEffects, effectIntensities, adjustEffectIntensity } = useEffectsManager();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id && cards.length > 0) {
      const foundCard = cards.find(c => c.id === id);
      if (foundCard) {
        setCard(foundCard);
      } else {
        // Card not found
        toast.error('Card not found');
      }
      setIsLoading(false);
    }
  }, [id, cards]);

  const handleShare = () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: card?.title || 'Check out this card!',
        text: card?.description || 'I found this awesome digital trading card',
        url: shareUrl,
      }).catch((error) => {
        console.error('Error sharing:', error);
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback to clipboard
      copyToClipboard(shareUrl);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Link copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy link');
      });
  };
  
  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites');
  };
  
  const handleDownload = () => {
    // In a real app, this would download an image of the card
    toast.success('Downloading card...');
    
    // This would normally generate an image and trigger a download
    setTimeout(() => {
      toast.success('Card downloaded successfully');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!card) {
    return (
      <PageLayout
        title="Card Not Found"
        description="We couldn't find the card you're looking for."
      >
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => navigate('/cards')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>
          
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
            <p className="text-gray-600 mb-8">
              The card you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/cards')}>
              Browse Cards
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={card.title}
      description={card.description}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLike}
              className={liked ? "text-red-500" : ""}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 h-[70vh] md:h-[80vh]">
            <div className="w-full h-full rounded-lg overflow-hidden bg-black">
              <ImmersiveCardViewer 
                card={card}
                activeEffects={activeEffects}
                effectIntensities={effectIntensities}
              />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <CardDetailPanel 
              card={card}
              availableEffects={availableEffects}
              activeEffects={activeEffects}
              onToggleEffect={toggleEffect}
              effectIntensities={effectIntensities}
              onAdjustIntensity={adjustEffectIntensity}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ImmersiveCardViewerPage;
