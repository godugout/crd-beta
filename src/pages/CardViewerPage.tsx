
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/lib/types';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import CardViewer from '@/components/gallery/CardViewer';
import CardEffectsPanel from '@/components/gallery/viewer-components/CardEffectsPanel';
import InfoPanel from '@/components/gallery/viewer-components/InfoPanel';
import KeyboardShortcuts from '@/components/gallery/viewer-components/KeyboardShortcuts';
import ViewerControls from '@/components/gallery/viewer-components/ViewerControls';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import { toast } from 'sonner';

const CardViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, getCardById } = useCards();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({});

  const [card, setCard] = useState<Card | undefined>(undefined);

  // Load the card data
  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);
    
    if (id) {
      try {
        const foundCard = getCardById ? getCardById(id) : cards.find(c => c.id === id);
        
        if (foundCard) {
          console.log("Card found:", foundCard);
          setCard(foundCard);
          
          // Initialize effects if the card has them
          if (foundCard.effects && foundCard.effects.length > 0) {
            setActiveEffects(foundCard.effects);
          }
        } else {
          console.error("Card not found with ID:", id);
          setLoadError("Card not found");
        }
      } catch (error) {
        console.error("Error loading card:", error);
        setLoadError("Failed to load card data");
      }
    } else {
      setLoadError("No card ID provided");
    }
    
    setIsLoading(false);
  }, [id, cards, getCardById]);

  const handleEffectToggle = (effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
    );
    toast.info(`${effect} effect ${activeEffects.includes(effect) ? 'disabled' : 'enabled'}`);
  };

  const handleEffectIntensityChange = (effect: string, intensity: number) => {
    setEffectIntensities(prev => ({ ...prev, [effect]: intensity }));
  };

  // Handle error states
  if (loadError) {
    return (
      <PageLayout title="Card Not Found" description="The card you're looking for doesn't exist.">
        <Container className="py-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="text-center mt-8 p-8 border border-red-200 rounded-lg bg-red-50">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Card</h2>
            <p className="text-muted-foreground mb-4">{loadError}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Container>
      </PageLayout>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <PageLayout title="Loading Card" description="Please wait while we load the card details.">
        <Container className="py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading card details...</p>
          </div>
        </Container>
      </PageLayout>
    );
  }

  // Handle missing card
  if (!card) {
    return (
      <PageLayout title="Card Not Found" description="The card you're looking for doesn't exist.">
        <Container className="py-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
            <p className="text-muted-foreground">The card you're looking for doesn't exist.</p>
          </div>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={card.title} description={card.description}>
      <Container className="py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="relative min-h-[80vh]">
          <CardViewer
            card={card}
            isFlipped={isFlipped}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
          />

          <ViewerControls
            isFlipped={isFlipped}
            isAutoRotating={isAutoRotating}
            showInfo={showInfo}
            onFlipCard={() => setIsFlipped(!isFlipped)}
            onToggleAutoRotation={() => setIsAutoRotating(!isAutoRotating)}
            onToggleInfo={() => setShowInfo(!showInfo)}
            onToggleFullscreen={() => {}}
            onShare={() => {}}
            onClose={() => navigate(-1)}
          />

          <CardEffectsPanel
            activeEffects={activeEffects}
            onToggleEffect={handleEffectToggle}
            effectIntensities={effectIntensities}
            onEffectIntensityChange={handleEffectIntensityChange}
          />

          <InfoPanel card={card} showInfo={showInfo} />
          <KeyboardShortcuts />
        </div>
      </Container>
    </PageLayout>
  );
};

export default CardViewerPage;
