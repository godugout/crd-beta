
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

interface ImmersiveCardViewerProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
  lightingSettings?: LightingSettings;
}

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  isFlipped,
  activeEffects = [],
  effectIntensities = {},
  lightingSettings
}) => {
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);
  const [localIsFlipped, setLocalIsFlipped] = useState(isFlipped);
  
  // Update local state when prop changes
  useEffect(() => {
    setLocalIsFlipped(isFlipped);
  }, [isFlipped]);
  
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
            effectIntensities={effectIntensities}
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
      
      {/* Controls overlay - MOVED OUTSIDE of Canvas */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
        <Button 
          className="px-4 py-2 bg-gray-800/70 text-white rounded-full hover:bg-gray-700/90 transition"
          onClick={() => setLocalIsFlipped(!localIsFlipped)}
        >
          {localIsFlipped ? 'Show Front' : 'Show Back'}
        </Button>
      </div>
    </div>
  );
};

export default ImmersiveCardViewer;
