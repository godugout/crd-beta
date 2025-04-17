
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/lib/types';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LIGHTING_PRESETS } from '@/hooks/useCardLighting';
import Card3DRenderer from '@/components/card-viewer/Card3DRenderer';
import LightingControls from '@/components/card-viewer/LightingControls';
import { LoadingState } from '@/components/ui/loading-state';
import { ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react';

const CardViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cards, collections, getCardById } = useCards();
  const [selectedLightingPreset, setSelectedLightingPreset] = useState<keyof typeof LIGHTING_PRESETS>('display_case');
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);

  // Find the card by ID
  const card = getCardById(id || '');
  
  // Find which collection this card belongs to
  const parentCollection = collections.find(c => {
    return c.cards?.some(cardInCollection => cardInCollection.id === id);
  });
  
  // Find cards in the same collection for navigation
  const cardsInSameCollection = parentCollection?.cards || [];
  const currentCardIndex = cardsInSameCollection.findIndex(c => c.id === id);
  
  // Navigation functions
  const goToPreviousCard = () => {
    if (!parentCollection || currentCardIndex <= 0) return;
    const prevCard = cardsInSameCollection[currentCardIndex - 1];
    if (prevCard) {
      window.location.href = `/cards/${prevCard.id}`;
    }
  };
  
  const goToNextCard = () => {
    if (!parentCollection || currentCardIndex === -1 || currentCardIndex >= cardsInSameCollection.length - 1) return;
    const nextCard = cardsInSameCollection[currentCardIndex + 1];
    if (nextCard) {
      window.location.href = `/cards/${nextCard.id}`;
    }
  };
  
  // Functions for card effects
  const toggleEffect = (effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
    );
  };
  
  // Export card image
  const exportCardImage = () => {
    // This is a placeholder for export functionality
    alert('Export functionality will be implemented in a future update');
  };
  
  // Share card
  const shareCard = () => {
    // This is a placeholder for share functionality
    if (navigator.share) {
      navigator.share({
        title: card?.title || 'Check out this card',
        text: card?.description || 'Take a look at this awesome card',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };
  
  if (!card) {
    return (
      <PageLayout title="Card Viewer" description="View card details">
        <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <LoadingState size="lg" text="Loading card..." />
        </div>
      </PageLayout>
    );
  }

  const availableEffects = ['Holographic', 'Chrome', 'Refractor', 'Vintage'];

  return (
    <PageLayout 
      title={`${card.title} | Card Viewer`} 
      description={card.description || 'View card details'}
    >
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: Card viewer */}
          <div className="w-full lg:w-2/3">
            <div className="relative">
              <div className="aspect-[3/4] w-full max-w-[500px] mx-auto">
                <Card3DRenderer 
                  card={card} 
                  isFlipped={isFlipped} 
                  activeEffects={activeEffects} 
                  lightingPreset={selectedLightingPreset} 
                  className="w-full h-full"
                />
              </div>
              
              {/* Navigation arrows if there's a collection */}
              {parentCollection && (
                <>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                    onClick={goToPreviousCard}
                    disabled={currentCardIndex <= 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    onClick={goToNextCard}
                    disabled={currentCardIndex === -1 || currentCardIndex >= cardsInSameCollection.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Card controls */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <Button 
                variant={isFlipped ? "default" : "outline"}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {isFlipped ? "Show Front" : "Show Back"}
              </Button>
              
              <Button variant="outline" onClick={exportCardImage}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button variant="outline" onClick={shareCard}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            {/* Effect toggles */}
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Card Effects</h3>
              <div className="flex flex-wrap gap-2">
                {availableEffects.map(effect => (
                  <Button 
                    key={effect}
                    variant={activeEffects.includes(effect) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleEffect(effect)}
                  >
                    {effect}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column: Card details and lighting controls */}
          <div className="w-full lg:w-1/3">
            <Tabs defaultValue="details">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="details" className="flex-1">Card Details</TabsTrigger>
                <TabsTrigger value="lighting" className="flex-1">Lighting</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="bg-background p-4 rounded-lg border">
                  <h2 className="text-xl font-bold">{card.title}</h2>
                  <p className="text-muted-foreground mt-1">{card.description}</p>
                  
                  {card.designMetadata && (
                    <div className="mt-4 space-y-3">
                      {card.designMetadata.player && (
                        <div>
                          <span className="font-medium">Player:</span> {card.designMetadata.player}
                        </div>
                      )}
                      {card.designMetadata.team && (
                        <div>
                          <span className="font-medium">Team:</span> {card.designMetadata.team}
                        </div>
                      )}
                      {card.designMetadata.year && (
                        <div>
                          <span className="font-medium">Year:</span> {card.designMetadata.year}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h3 className="font-medium">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {card.tags?.map((tag, index) => (
                        <div key={index} className="bg-muted text-muted-foreground px-2 py-1 text-xs rounded-md">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {parentCollection && (
                  <div className="bg-background p-4 rounded-lg border">
                    <h3 className="font-medium">From Collection</h3>
                    <div className="mt-2">
                      <a 
                        href={`/collections/${parentCollection.id}`} 
                        className="text-primary hover:underline"
                      >
                        {parentCollection.name || parentCollection.title}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        {parentCollection.description}
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="lighting">
                <LightingControls 
                  preset={selectedLightingPreset} 
                  onPresetChange={setSelectedLightingPreset}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardViewerPage;
