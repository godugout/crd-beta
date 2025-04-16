
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/lib/types';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({});

  const card = id ? getCardById(id) : undefined;

  if (!card) {
    return (
      <PageLayout title="Card Not Found">
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

  const handleEffectToggle = (effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
    );
    toast.info(`${effect} effect ${activeEffects.includes(effect) ? 'disabled' : 'enabled'}`);
  };

  const handleEffectIntensityChange = (effect: string, intensity: number) => {
    setEffectIntensities(prev => ({ ...prev, [effect]: intensity }));
  };

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
