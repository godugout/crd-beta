import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBaseballCard } from '@/components/baseball/hooks/useBaseballCard';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import { adaptToCard } from '@/lib/adapters/cardAdapter';
import { Card } from '@/lib/types';
import { LoadingState } from '@/components/ui/loading-state';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollableGallery from '@/components/immersive-viewer/ScrollableGallery';
import CustomizationPanel from '@/components/immersive-viewer/CustomizationPanel';
import { useCardLighting, DEFAULT_LIGHTING } from '@/hooks/useCardLighting';

const ImmersiveBaseballViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cardData, allCards, isLoading, error } = useBaseballCard();
  const [card, setCard] = useState<Card | null>(null);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({
    Holographic: 0.7,
    Shimmer: 0.5,
    Refractor: 0.6,
    Vintage: 0.4
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const { lightingSettings, updateLightingSetting } = useCardLighting('studio');

  const [materialSettings, setMaterialSettings] = useState({
    roughness: 0.15,
    metalness: 0.3,
    reflectivity: 0.2,
    clearcoat: 0.1,
    envMapIntensity: 1.0
  });

  useEffect(() => {
    if (isLoading || !cardData) return;
    
    console.log("ImmersiveBaseballViewer: Converting baseball card to standard card format", cardData);
    
    const formattedCard = adaptToCard({
      id: cardData.id,
      title: cardData.title,
      description: `${cardData.year} ${cardData.player} - ${cardData.team}`,
      imageUrl: cardData.imageUrl,
      backImageUrl: cardData.backImageUrl,
      player: cardData.player,
      team: cardData.team,
      year: cardData.year,
      effects: cardData.effects || [],
      userId: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    setCard(formattedCard);
    
    setActiveEffects(cardData.effects || ['Holographic']);
    
    toast.success("Card loaded successfully");
  }, [cardData, isLoading]);

  const handleCardSelect = (cardId: string) => {
    navigate(`/baseball-card-viewer/${cardId}`);
  };
  
  const handleUpdateMaterial = (settings: Partial<typeof materialSettings>) => {
    setMaterialSettings(prev => ({ ...prev, ...settings }));
    
    const updatedEffectIntensities = { ...effectIntensities };
    if (settings.roughness !== undefined) {
      updatedEffectIntensities.Shimmer = 1 - settings.roughness;
    }
    if (settings.metalness !== undefined) {
      updatedEffectIntensities.Chrome = settings.metalness;
    }
    if (settings.reflectivity !== undefined) {
      updatedEffectIntensities.Holographic = settings.reflectivity;
    }
    if (settings.clearcoat !== undefined) {
      updatedEffectIntensities.Refractor = settings.clearcoat;
    }
    
    setEffectIntensities(updatedEffectIntensities);
  };

  if (isLoading) {
    return <LoadingState size="lg" text="Loading card..." />;
  }

  if (error || !card) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
        <div className="text-center max-w-md p-6 bg-gray-800/50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
          <p className="mb-6">{error || "Unable to load the baseball card"}</p>
          <button
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => navigate('/cards')}
          >
            Go to Card Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      <div className="relative h-full w-full">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 bg-gray-900/50 hover:bg-gray-900/70"
          onClick={() => setIsPanelOpen(true)}
        >
          <Settings className="h-5 w-5" />
        </Button>

        <ImmersiveCardViewer 
          card={card}
          activeEffects={activeEffects}
          effectIntensities={effectIntensities}
        />
        
        <CustomizationPanel
          card={card}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          lightingSettings={lightingSettings}
          onUpdateLighting={updateLightingSetting}
          materialSettings={materialSettings}
          onUpdateMaterial={handleUpdateMaterial}
        />
        
        <ScrollableGallery 
          cards={allCards.map(baseballCard => adaptToCard({
            id: baseballCard.id,
            title: baseballCard.title,
            imageUrl: baseballCard.imageUrl,
            userId: 'system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            effects: baseballCard.effects || []
          }))}
          currentCardId={card.id}
          onCardClick={handleCardSelect}
        />
      </div>
    </div>
  );
};

export default ImmersiveBaseballViewer;
