
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCardById } from '@/lib/api/cards';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import KeyboardControls from '@/components/card-viewer/KeyboardControls';
import CardEffectsPanel from '@/components/gallery/viewer-components/CardEffectsPanel';
import { cn } from '@/lib/utils';
import { useCards } from '@/context/CardContext';
import { getFallbackImageUrl } from '@/lib/utils/imageUtils';

const ImmersiveCardViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [effectIntensities, setEffectIntensities] = useState({
    Holographic: 0.7,
    Refractor: 0.8,
    Shimmer: 0.6,
    Gold: 0.7,
    Vintage: 0.5
  });

  // Get card from context if available
  const { cards, getCardById } = useCards();
  const cardFromContext = getCardById ? getCardById(id || '') : cards.find(c => c.id === id);

  // Use query as backup but use context data if available
  const { data: cardFromQuery, isLoading: isQueryLoading } = useQuery({
    queryKey: ['card', id],
    queryFn: () => fetchCardById(id as string),
    // Skip query if we have the card from context
    enabled: !cardFromContext,
  });

  // Use either the card from context or the one from the query
  const card = cardFromContext || cardFromQuery;
  const isLoading = !card && isQueryLoading;

  // Ensure we have valid image URLs
  const processCardData = () => {
    if (!card) return null;
    
    // Make a copy of the card to avoid mutating the original
    const processedCard = { ...card };
    
    // Ensure imageUrl has a valid fallback
    if (!processedCard.imageUrl) {
      processedCard.imageUrl = getFallbackImageUrl(processedCard.tags, processedCard.title);
      console.log('Using fallback image URL:', processedCard.imageUrl);
    }
    
    return processedCard;
  };

  const processedCard = processCardData();

  if (isLoading || !processedCard) {
    return (
      <PageLayout title="Loading Card..." fullWidth>
        <div className="h-[600px] w-full bg-gray-900 flex items-center justify-center">
          <Skeleton className="w-96 h-[500px] rounded-xl" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`3D View: ${processedCard.title}`} fullWidth className="bg-gray-900">
      <div className="relative min-h-screen">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()} 
          className="absolute top-4 left-4 z-50 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {/* Main 3D Viewer */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ImmersiveCardViewer 
            card={processedCard}
            isFlipped={isFlipped}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
          />
        </div>

        {/* Effects Panel */}
        {showEffects && (
          <div className="absolute left-4 top-20 bottom-4 w-80 pointer-events-auto">
            <CardEffectsPanel 
              activeEffects={activeEffects}
              onToggleEffect={(effect) => {
                setActiveEffects(prev => 
                  prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
                );
              }}
              onEffectIntensityChange={(effect, intensity) => {
                setEffectIntensities(prev => ({ ...prev, [effect]: intensity }));
              }}
              effectIntensities={effectIntensities}
            />
          </div>
        )}

        {/* Keyboard Controls */}
        <KeyboardControls />

        {/* Sticky Info Footer */}
        <div className={cn(
          "fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md text-white transition-all duration-300 border-t border-gray-800",
          showFullInfo ? "h-96" : "h-20"
        )}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{processedCard.title}</h2>
                <p className="text-sm text-gray-400">
                  {processedCard.team ? `${processedCard.team} • ` : ''}
                  {processedCard.year || ''}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullInfo(!showFullInfo)}
                className="text-white"
              >
                {showFullInfo ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Expanded Info */}
            {showFullInfo && (
              <div className="mt-4 space-y-4">
                {processedCard.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400">Description</h3>
                    <p className="mt-1">{processedCard.description}</p>
                  </div>
                )}
                
                {processedCard.stats && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400">Stats</h3>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(processedCard.stats).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-sm text-gray-400">{key}</div>
                          <div className="font-semibold">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ImmersiveCardViewerPage;
