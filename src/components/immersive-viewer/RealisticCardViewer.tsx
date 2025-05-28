
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Card } from '@/lib/types';
import { useCardLighting } from '@/hooks/useCardLighting';
import { CardModel } from '@/components/card-viewer/CardModel';
import EnvironmentRenderer from './EnvironmentRenderer';

interface RealisticCardViewerProps {
  card: Card;
  isCustomizationOpen: boolean;
  onToggleCustomization: () => void;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
  environmentType?: string;
  materialSettings?: any;
  lightingSettings?: any;
}

const RealisticCardViewer: React.FC<RealisticCardViewerProps> = ({
  card,
  isCustomizationOpen,
  onToggleCustomization,
  activeEffects = ['holographic'],
  effectIntensities = { holographic: 0.7, refractor: 0.5, foil: 0.6 },
  environmentType = 'studio',
  materialSettings,
  lightingSettings
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const {
    lightingSettings: defaultLighting,
    updateLightPosition
  } = useCardLighting('studio');

  // Use provided lighting settings or defaults
  const currentLighting = lightingSettings || defaultLighting;

  console.log('RealisticCardViewer: Rendering with card:', {
    id: card.id,
    title: card.title,
    imageUrl: card.imageUrl,
    hasImageUrl: !!card.imageUrl,
    activeEffects,
    environmentType
  });

  // Handle mouse movement for dynamic lighting
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (currentLighting?.useDynamicLighting) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      updateLightPosition(x, y);
    }
  };

  return (
    <div 
      className="w-full h-full relative"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true
        }}
        style={{ 
          width: '100%',
          height: '100%'
        }}
      >
        {/* Environment Scene */}
        <EnvironmentRenderer environmentType={environmentType} />
        
        {/* Lighting Setup */}
        <ambientLight 
          intensity={currentLighting?.ambientLight?.intensity || 0.6} 
          color={currentLighting?.ambientLight?.color || '#f0f0ff'}
        />
        <directionalLight
          position={[
            currentLighting?.primaryLight?.x || 10,
            currentLighting?.primaryLight?.y || 10,
            currentLighting?.primaryLight?.z || 10
          ]}
          intensity={currentLighting?.primaryLight?.intensity || 1.2}
          color={currentLighting?.primaryLight?.color || '#ffffff'}
          castShadow
        />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />

        {/* Card Model */}
        <Suspense fallback={null}>
          <CardModel
            card={card}
            isFlipped={isFlipped}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
            materialSettings={materialSettings}
          />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      {/* Flip Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors"
        >
          {isFlipped ? 'Show Front' : 'Show Back'}
        </button>
      </div>
    </div>
  );
};

export default RealisticCardViewer;
