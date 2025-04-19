import React, { useRef, useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/lib/types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import { LightingSettings } from '@/hooks/useCardLighting';
import Card3DRenderer from '../card-viewer/Card3DRenderer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, SunMedium } from 'lucide-react';

const FALLBACK_IMAGE_URL = '/images/card-placeholder.png';
const FALLBACK_BACK_IMAGE_URL = '/images/card-back-placeholder.png';

interface ImmersiveCardViewerProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
  lightingSettings?: LightingSettings;
  onEffectIntensityChange?: (effect: string, value: number) => void;
}

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  isFlipped,
  activeEffects = [],
  effectIntensities = {},
  lightingSettings,
  onEffectIntensityChange
}) => {
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);
  const [localIsFlipped, setLocalIsFlipped] = useState(isFlipped);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [localEffectIntensities, setLocalEffectIntensities] = useState<Record<string, number>>(effectIntensities);
  const [effectsOrder, setEffectsOrder] = useState<string[]>(activeEffects);
  
  const cardWithFallbacks = {
    ...card,
    imageUrl: card.imageUrl || FALLBACK_IMAGE_URL,
    backImageUrl: card.backImageUrl || FALLBACK_BACK_IMAGE_URL
  };

  useEffect(() => {
    setLocalIsFlipped(isFlipped);
  }, [isFlipped]);
  
  useEffect(() => {
    setLocalEffectIntensities(effectIntensities);
  }, [effectIntensities]);
  
  useEffect(() => {
    setEffectsOrder(activeEffects);
  }, [activeEffects]);
  
  const handleEffectIntensityChange = (effect: string, value: number) => {
    setLocalEffectIntensities(prev => ({
      ...prev,
      [effect]: value
    }));
    
    if (onEffectIntensityChange) {
      onEffectIntensityChange(effect, value);
    }
  };

  const moveEffectLayer = (effect: string, direction: 'up' | 'down') => {
    const currentIndex = effectsOrder.indexOf(effect);
    if (
      (direction === 'up' && currentIndex > 0) || 
      (direction === 'down' && currentIndex < effectsOrder.length - 1)
    ) {
      const newEffectsOrder = [...effectsOrder];
      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      [newEffectsOrder[currentIndex], newEffectsOrder[swapIndex]] = 
      [newEffectsOrder[swapIndex], newEffectsOrder[currentIndex]];
      
      setEffectsOrder(newEffectsOrder);
      
      toast({
        title: "Effect Layer Updated",
        description: `${effect} moved ${direction}`,
      });
    }
  };

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: '#111' }}
        shadows
      >
        <ambientLight intensity={lightingSettings?.ambientLight.intensity || 0.7} 
                     color={lightingSettings?.ambientLight.color || '#ffffff'} />
        <spotLight 
          position={[
            lightingSettings?.primaryLight.x || 10,
            lightingSettings?.primaryLight.y || 10,
            lightingSettings?.primaryLight.z || 10
          ]} 
          angle={0.15} 
          penumbra={1} 
          intensity={lightingSettings?.primaryLight.intensity || 1} 
          color={lightingSettings?.primaryLight.color || '#ffffff'}
          castShadow
        />
        
        <Environment preset={(lightingSettings?.environmentType || 'studio') as any} background={false} />
        
        <Suspense fallback={
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2, 2, 0.1]} />
            <meshStandardMaterial color="blue" wireframe />
          </mesh>
        }>
          <Card3DRenderer 
            card={cardWithFallbacks}
            isFlipped={localIsFlipped} 
            activeEffects={effectsOrder}
            effectIntensities={localEffectIntensities}
          />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          autoRotate={lightingSettings?.autoRotate || false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
        <Button 
          className="px-4 py-2 bg-gray-800/70 text-white rounded-full hover:bg-gray-700/90 transition"
          onClick={() => setLocalIsFlipped(!localIsFlipped)}
        >
          {localIsFlipped ? 'Show Front' : 'Show Back'}
        </Button>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white"
          onClick={() => setShowEffectsPanel(!showEffectsPanel)}
        >
          {showEffectsPanel ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {showEffectsPanel && (
        <div className="absolute top-0 right-0 h-full w-72 bg-gray-900/90 backdrop-blur-sm text-white p-4 overflow-y-auto z-10">
          <h3 className="text-lg font-semibold mb-4">Effect Controls</h3>
          
          {activeEffects.length === 0 ? (
            <p className="text-gray-400">No active effects</p>
          ) : (
            <div className="space-y-6">
              {effectsOrder.map((effect) => (
                <div key={effect} className="space-y-2 bg-gray-800/60 p-3 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">{effect}</Label>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 hover:bg-gray-700"
                        onClick={() => moveEffectLayer(effect, 'up')}
                        disabled={effectsOrder.indexOf(effect) === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                        <span className="sr-only">Move layer up</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 hover:bg-gray-700"
                        onClick={() => moveEffectLayer(effect, 'down')}
                        disabled={effectsOrder.indexOf(effect) === effectsOrder.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                        <span className="sr-only">Move layer down</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <SunMedium className="h-3 w-3 text-gray-400" />
                    <Slider
                      value={[localEffectIntensities[effect] || 1.0]}
                      min={0}
                      max={1}
                      step={0.05}
                      onValueChange={(values) => handleEffectIntensityChange(effect, values[0])}
                      className="flex-1"
                    />
                    <span className="text-xs w-8 text-right">
                      {Math.round((localEffectIntensities[effect] || 1) * 100)}%
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-1">
                    {effect === 'Holographic' && 'Rainbow reflection effect with dynamic color shift.'}
                    {effect === 'Refractor' && 'Light refraction with prismatic effect.'}
                    {effect === 'Chrome' && 'Metallic chrome finish with high reflectivity.'}
                    {effect === 'Gold Foil' && 'Golden foil accent with light reflection.'}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    Layer order: {effectsOrder.indexOf(effect) + 1} of {effectsOrder.length}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImmersiveCardViewer;
