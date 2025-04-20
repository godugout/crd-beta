
import React, { useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import { useParams, Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import OptimizedCardRenderer from '@/components/card-viewer/OptimizedCardRenderer';
import { useOptimizedCardEffects } from '@/hooks/useOptimizedCardEffects';
import { ChevronLeft, Lightbulb, Zap, ChevronsUp, ChevronsDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ImmersiveCardViewer = ({ card: initialCard }: { card?: Card }) => {
  const { id } = useParams();
  const { getCardById } = useCards();
  const [card, setCard] = useState<Card | undefined>(initialCard);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const { toast } = useToast();
  const { 
    activeEffects, 
    settings, 
    toggleEffect, 
    setEffectIntensity,
    devicePerformance,
    optimizeForPerformance 
  } = useOptimizedCardEffects(card?.effects || []);
  
  useEffect(() => {
    if (id) {
      const foundCard = getCardById(id);
      if (foundCard) {
        console.log("Found card in context:", foundCard);
        setCard(foundCard);
      } else {
        console.warn("Card not found in context:", id);
      }
    }
  }, [id, getCardById]);

  if (!card) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
        <p className="text-gray-400 mb-6">The card you're looking for may have been removed or doesn't exist.</p>
        <Button variant="outline" asChild>
          <Link to="/collections">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Link>
        </Button>
      </div>
    );
  }

  const handleFlipCard = () => {
    setIsFlipped(prev => !prev);
  };

  // Extract stats from designMetadata if available
  const cardStats = card.designMetadata?.stats || {};

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Card display area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          {/* Performance-optimized ambient lighting effects */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent to-black/30 opacity-70"></div>
          <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full blur-[120px] bg-blue-500/10"></div>
          <div className="absolute bottom-[10%] left-[20%] w-[250px] h-[250px] rounded-full blur-[100px] bg-purple-500/10"></div>
          
          {/* Simplified light beams (conditional based on performance) */}
          {devicePerformance !== 'low' && (
            <>
              <div className="absolute top-[5%] left-[30%] w-[3px] h-[150px] bg-gradient-to-b from-white/5 to-transparent transform rotate-[20deg]"></div>
              <div className="absolute top-[10%] left-[40%] w-[2px] h-[100px] bg-gradient-to-b from-white/3 to-transparent transform rotate-[15deg]"></div>
              <div className="absolute top-[8%] left-[55%] w-[4px] h-[200px] bg-gradient-to-b from-white/4 to-transparent transform rotate-[25deg]"></div>
            </>
          )}
        </div>
        
        <div className="w-full max-w-lg h-full max-h-[70vh] flex items-center justify-center">
          <OptimizedCardRenderer 
            card={card}
            isFlipped={isFlipped}
            activeEffects={activeEffects}
            effectIntensities={settings.effectIntensities}
          />
        </div>
      </div>
      
      {/* Controls panel - collapsible */}
      <div 
        className={`bg-black/50 backdrop-blur-md border-t border-white/10 transition-all duration-300 ease-in-out ${
          showControls ? 'max-h-[300px]' : 'max-h-14'
        } overflow-hidden`}
      >
        <div 
          className="p-4 flex justify-between items-center cursor-pointer"
          onClick={() => setShowControls(prev => !prev)}
        >
          <h3 className="font-medium text-lg flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            Card Controls
          </h3>
          <Button variant="ghost" size="sm">
            {showControls ? (
              <ChevronsDown className="h-5 w-5" />
            ) : (
              <ChevronsUp className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <div className="px-4 pb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
                Visual Effects
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="flipswitch" className="text-sm">Flip Card</Label>
                  <Switch 
                    id="flipswitch" 
                    checked={isFlipped} 
                    onCheckedChange={handleFlipCard} 
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Holographic', 'Refractor', 'Shimmer', 'Gold Foil'].map(effect => (
                    <Button
                      key={effect}
                      size="sm"
                      variant={activeEffects.includes(effect) ? "default" : "outline"}
                      onClick={() => toggleEffect(effect)}
                    >
                      {effect}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Effect Intensity</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="effect-intensity" className="text-sm">Effect Strength</Label>
                    <span className="text-xs text-gray-400">
                      {Math.round(settings.effectIntensities.Holographic * 100)}%
                    </span>
                  </div>
                  <Slider
                    id="effect-intensity"
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    value={[settings.effectIntensities.Holographic]}
                    onValueChange={(value) => {
                      setEffectIntensity('Holographic', value[0]);
                      // Update all effect intensities proportionally
                      Object.keys(settings.effectIntensities).forEach(key => {
                        setEffectIntensity(key, value[0]);
                      });
                    }}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Label htmlFor="animations-toggle" className="text-sm">Enable Animations</Label>
                  <Switch 
                    id="animations-toggle" 
                    checked={settings.animationEnabled} 
                    onCheckedChange={(checked) => {
                      // Use optimizeForPerformance instead of setSettings
                      if (!checked) {
                        optimizeForPerformance();
                      }
                    }}
                    disabled={devicePerformance === 'low'}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Card Information */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <h3 className="font-semibold">{card.title}</h3>
            {card.description && <p className="text-sm mt-1 text-gray-300">{card.description}</p>}
            
            {/* Display card stats if available */}
            {Object.keys(cardStats).length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {Object.entries(cardStats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs text-gray-400">{key}</p>
                    <p className="font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Back button */}
      <Link 
        to="/collections"
        className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm p-2 rounded-full hover:bg-black/60 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default ImmersiveCardViewer;
