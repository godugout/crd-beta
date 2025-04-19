
import React, { useRef, useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/lib/types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { DEFAULT_DESIGN_METADATA, FALLBACK_IMAGE_URL } from '@/lib/utils/cardDefaults';
import { LightingSettings } from '@/hooks/useCardLighting';
import Card3DRenderer from '../card-viewer/Card3DRenderer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  
  // Update local state when props change
  useEffect(() => {
    setLocalIsFlipped(isFlipped);
  }, [isFlipped]);
  
  useEffect(() => {
    setLocalEffectIntensities(effectIntensities);
  }, [effectIntensities]);
  
  // Ensure card has proper image URLs before rendering
  if (!card.imageUrl) {
    // Use a fallback image if none is provided
    card = {
      ...card,
      imageUrl: FALLBACK_IMAGE_URL
    };
    console.log("Using fallback image for card:", card.id);
  }

  // Error display as THREE object for within Canvas
  const ErrorDisplay = () => {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  };

  // Handle effect intensity changes
  const handleEffectIntensityChange = (effect: string, value: number) => {
    setLocalEffectIntensities(prev => ({
      ...prev,
      [effect]: value
    }));
    
    if (onEffectIntensityChange) {
      onEffectIntensityChange(effect, value);
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
        
        <Suspense fallback={<ErrorDisplay />}>
          <Card3DRenderer 
            card={card}
            isFlipped={localIsFlipped} 
            activeEffects={activeEffects}
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
      
      {/* Controls overlay - OUTSIDE of Canvas */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
        <Button 
          className="px-4 py-2 bg-gray-800/70 text-white rounded-full hover:bg-gray-700/90 transition"
          onClick={() => setLocalIsFlipped(!localIsFlipped)}
        >
          {localIsFlipped ? 'Show Front' : 'Show Back'}
        </Button>
      </div>

      {/* Effects Panel Toggle Button - OUTSIDE of Canvas */}
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

      {/* Effects Controls Panel - OUTSIDE of Canvas */}
      {showEffectsPanel && (
        <div className="absolute top-0 right-0 h-full w-72 bg-gray-900/90 backdrop-blur-sm text-white p-4 overflow-y-auto z-10">
          <h3 className="text-lg font-semibold mb-4">Effect Controls</h3>
          
          {activeEffects.length === 0 ? (
            <p className="text-gray-400">No active effects</p>
          ) : (
            <div className="space-y-6">
              {activeEffects.map((effect) => (
                <div key={effect} className="space-y-2">
                  <Label className="text-sm font-medium">{effect} Intensity</Label>
                  <div className="flex items-center space-x-2">
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
                  
                  {/* Layer Order Controls */}
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">Layer Order:</span>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        disabled={activeEffects.indexOf(effect) === 0}
                      >
                        ↑
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        disabled={activeEffects.indexOf(effect) === activeEffects.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
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
