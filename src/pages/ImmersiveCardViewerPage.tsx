import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/lib/types';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import { sampleCards } from '@/lib/data/sampleCards';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import { adaptToCard } from '@/lib/adapters/cardAdapter';
import useCardEffects from '@/hooks/card-effects';
import ViewerSettings from '@/components/gallery/viewer-components/ViewerSettings';
import { useCardLighting } from '@/hooks/useCardLighting';
import { useUserLightingPreferences } from '@/hooks/useUserLightingPreferences';

const FALLBACK_IMAGE_URL = '/images/card-placeholder.png';
const FALLBACK_BACK_IMAGE_URL = '/images/card-back-placeholder.png';

const ImmersiveCardViewerPage: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cards, getCardById } = useCards();
  const { toast } = useToast();
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [viewTab, setViewTab] = useState('effects');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const viewMode = searchParams.get('mode') || 'standard';
  
  const { preferences, savePreferences } = useUserLightingPreferences();
  const {
    lightingSettings,
    updateLightingSetting,
    applyPreset,
    isUserCustomized,
  } = useCardLighting(preferences?.environmentType || 'studio');
  
  const { 
    cardEffects, 
    addEffect, 
    removeEffect, 
    toggleEffect,
    setCardEffects,
    clearEffects,
    activeEffects,
    setActiveEffects
  } = useCardEffects();

  useEffect(() => {
    if (isUserCustomized && lightingSettings) {
      savePreferences(lightingSettings);
    }
  }, [lightingSettings, isUserCustomized, savePreferences]);

  useEffect(() => {
    const loadCard = async () => {
      setIsLoading(true);
      try {
        let foundCard: Card | null = null;
        
        if (id) {
          console.log('Looking for card with ID:', id);
          
          foundCard = sampleCards.find(c => c.id === id) || null;
          
          if (!foundCard && getCardById) {
            foundCard = getCardById(id);
          } else if (!foundCard) {
            foundCard = cards.find(c => c.id === id) || null;
          }
        } else if (cards.length > 0) {
          foundCard = cards[0];
        } else if (sampleCards.length > 0) {
          foundCard = sampleCards[0];
        }
        
        if (foundCard) {
          console.log('Found card:', foundCard.title);
          
          const cardWithDefaults = adaptToCard({
            ...foundCard,
            imageUrl: foundCard.imageUrl || FALLBACK_IMAGE_URL,
            backImageUrl: foundCard.backImageUrl || FALLBACK_BACK_IMAGE_URL,
            thumbnailUrl: foundCard.thumbnailUrl || foundCard.imageUrl || FALLBACK_IMAGE_URL,
            designMetadata: foundCard.designMetadata || DEFAULT_DESIGN_METADATA,
            createdAt: foundCard.createdAt || new Date().toISOString(),
            updatedAt: foundCard.updatedAt || new Date().toISOString(),
            userId: foundCard.userId || 'anonymous',
            effects: foundCard.effects || []
          });
          
          setCard(cardWithDefaults);
          
          if (cardWithDefaults.effects && cardWithDefaults.effects.length > 0) {
            setActiveEffects(cardWithDefaults.effects);
            setCardEffects(cardWithDefaults.id, cardWithDefaults.effects);
          }
        } else {
          console.error('Card not found with ID:', id);
          toast({
            title: "Card not found",
            description: "The requested card could not be found",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error loading card:', error);
        toast({
          title: "Error loading card",
          description: "There was a problem loading the card",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCard();
  }, [id, cards, getCardById, toast, setActiveEffects, setCardEffects]);
  
  const handleEffectToggle = (effect: string) => {
    if (card) {
      toggleEffect(card.id, effect);
      
      if (activeEffects.includes(effect)) {
        setActiveEffects(activeEffects.filter(e => e !== effect));
      } else {
        setActiveEffects([...activeEffects, effect]);
      }
    }
  };
  
  const handleApplyAllEffects = () => {
    if (card) {
      const allEffects = ['Holographic', 'Shimmer', 'Refractor', 'Vintage'];
      setActiveEffects(allEffects);
      setCardEffects(card.id, allEffects);
      toast({
        title: "All effects applied",
        description: "Experience the full power of CRD"
      });
    }
  };
  
  const handleClearEffects = () => {
    if (card) {
      clearEffects(card.id);
      setActiveEffects([]);
    }
  };

  useEffect(() => {
    if (viewTab !== 'view' && !isPanelOpen) {
      setIsPanelOpen(true);
    }
  }, [viewTab, isPanelOpen]);

  const handleUpdateSetting = (path: string, value: any) => {
    const pathParts = path.split('.');
    if (pathParts.length === 2) {
      const [group, property] = pathParts;
      updateLightingSetting({
        [group]: {
          ...lightingSettings[group],
          [property]: value
        }
      });
    } else {
      updateLightingSetting({
        [path]: value
      });
    }
  };

  return (
    <PageLayout 
      title={card?.title ? `Viewing ${card.title}` : "Immersive Card Viewer"} 
      description="Experience cards in stunning 3D"
      className="overflow-x-hidden"
    >
      <div className="relative min-h-[calc(100vh-64px)] bg-gray-900/95">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-black/30 pointer-events-none z-0"
        )}/>
        
        <div className="relative z-10 p-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="text-white" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          
          <div className="flex gap-2">
            <Tabs value={viewTab} onValueChange={setViewTab} className="w-[400px]">
              <TabsList className="grid grid-cols-1 bg-gray-800/50 backdrop-blur">
                <TabsTrigger value="effects">Effects & View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Button 
            variant="ghost" 
            className={cn(
              "text-white transition-colors",
              isPanelOpen ? "text-purple-400" : "text-white"
            )} 
            onClick={() => setIsPanelOpen(!isPanelOpen)}
          >
            <ChevronRight className={cn(
              "h-5 w-5 transition-transform",
              isPanelOpen && "rotate-180"
            )} />
          </Button>
        </div>
        
        <div className="flex relative z-10">
          <div className={cn(
            "flex-1 transition-all duration-300",
            isPanelOpen && "mr-[320px]"
          )}>
            <div className="w-full h-[calc(100vh-130px)] flex items-center justify-center p-4">
              {isLoading || !card ? (
                <div className="w-full max-w-lg h-[500px] rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : (
                <Suspense fallback={
                  <div className="w-full max-w-lg h-[500px] rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-12 w-12 border-4 border-t-blue-500 border-blue-300/30 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading immersive experience...</p>
                    </div>
                  </div>
                }>
                  <div className="w-full h-full max-w-5xl">
                    <ImmersiveCardViewer 
                      card={card}
                      isFlipped={isFlipped}
                      activeEffects={activeEffects}
                      lightingSettings={lightingSettings}
                    />
                  </div>
                </Suspense>
              )}
            </div>
          </div>
          
          <div className={cn(
            "fixed right-0 top-[64px] bottom-0 w-[320px] bg-gray-900/95 backdrop-blur-lg border-l border-gray-800 transition-all duration-300 overflow-y-auto",
            isPanelOpen ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="p-6">
              <Tabs value={viewTab} className="w-full">
                <TabsContent value="effects" className="mt-0">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Card Effects</h3>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={handleClearEffects}
                      >
                        Clear
                      </Button>
                      <Button 
                        size="sm" 
                        variant="default" 
                        onClick={handleApplyAllEffects}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Apply All
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {['Holographic', 'Shimmer', 'Refractor', 'Vintage'].map((effect) => (
                      <div 
                        key={effect} 
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all",
                          activeEffects.includes(effect) 
                            ? "bg-purple-900/40 border-purple-500/50" 
                            : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50"
                        )}
                        onClick={() => handleEffectToggle(effect)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-white">{effect}</h4>
                            <p className="text-xs text-gray-400">{getEffectDescription(effect)}</p>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2",
                            activeEffects.includes(effect) 
                              ? "border-purple-500 bg-purple-500/50" 
                              : "border-gray-600"
                          )}>
                            {activeEffects.includes(effect) && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 border-t border-gray-800 pt-6">
                    <ViewerSettings
                      settings={lightingSettings}
                      onUpdateSettings={handleUpdateSetting}
                      onApplyPreset={applyPreset}
                      isOpen={true}
                    />
                    
                    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium text-white mb-2">Card Position</h3>
                      <Button 
                        className="w-full"
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        {isFlipped ? "Show Front" : "Show Back"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

function getEffectDescription(effect: string): string {
  switch (effect) {
    case 'Holographic':
      return 'Rainbow prism effect that shifts as the card moves';
    case 'Shimmer':
      return 'Subtle metallic shimmer across the card surface';
    case 'Refractor':
      return 'Light-refracting pattern that creates a 3D depth effect';
    case 'Vintage':
      return 'Aged patina with subtle texture and color shifting';
    default:
      return 'Special visual effect';
  }
}

export default ImmersiveCardViewerPage;
