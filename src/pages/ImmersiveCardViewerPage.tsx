import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCardById } from '@/lib/api/cards';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import KeyboardControls from '@/components/card-viewer/KeyboardControls';
import CardEffectsPanel from '@/components/gallery/viewer-components/CardEffectsPanel';
import { useCardEffects } from '@/hooks/useCardEffects';

const ImmersiveCardViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState({
    Holographic: 0.7,
    Refractor: 0.8,
    Shimmer: 0.6,
    Gold: 0.7,
    Vintage: 0.5
  });

  const { data: card, isLoading, error } = useQuery({
    queryKey: ['card', id],
    queryFn: () => fetchCardById(id as string),
    enabled: !!id
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()) {
        case 'f':
          setIsFlipped(prev => !prev);
          break;
        case 'e':
          setShowEffects(prev => !prev);
          break;
        case 'escape':
          setShowEffects(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEffectToggle = (effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
    );
  };

  const handleEffectIntensityChange = (effect: string, intensity: number) => {
    setEffectIntensities(prev => ({
      ...prev,
      [effect]: intensity
    }));
  };

  if (isLoading) {
    return (
      <PageLayout title="Loading Card..." fullWidth>
        <div className="p-6">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="h-[600px] w-full bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="w-48 h-6 mt-4" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !card) {
    return (
      <PageLayout title="Error" fullWidth>
        <div className="p-6">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="h-[600px] w-full bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Card Not Found</h2>
              <p className="text-gray-400">The card you're looking for doesn't exist or couldn't be loaded.</p>
              <Button className="mt-4" onClick={handleBack}>Return to Collection</Button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`3D View: ${card.title}`} fullWidth className="bg-gray-900">
      <div className="relative min-h-screen">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="absolute top-4 left-4 z-50 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <ImmersiveCardViewer 
            card={card}
            isFlipped={isFlipped}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
          />
        </div>

        {showEffects && (
          <div className="absolute left-4 top-20 bottom-4 w-80 pointer-events-auto">
            <CardEffectsPanel 
              activeEffects={activeEffects}
              onToggleEffect={handleEffectToggle}
              onEffectIntensityChange={handleEffectIntensityChange}
              effectIntensities={effectIntensities}
            />
          </div>
        )}

        <KeyboardControls />
      </div>
    </PageLayout>
  );
};

export default ImmersiveCardViewerPage;
