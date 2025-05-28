
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Card } from '@/lib/types';
import { useCardLighting } from '@/hooks/useCardLighting';
import CardModel from '@/components/card-viewer/CardModel';

interface RealisticCardViewerProps {
  card: Card;
  isCustomizationOpen: boolean;
  onToggleCustomization: () => void;
}

const RealisticCardViewer: React.FC<RealisticCardViewerProps> = ({
  card,
  isCustomizationOpen,
  onToggleCustomization
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>(['holographic']);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({
    holographic: 0.7,
    refractor: 0.5,
    foil: 0.6
  });

  const {
    lightingSettings,
    updateLightPosition
  } = useCardLighting('studio');

  console.log('RealisticCardViewer: Rendering with card:', {
    id: card.id,
    title: card.title,
    imageUrl: card.imageUrl,
    hasImageUrl: !!card.imageUrl
  });

  // Handle mouse movement for dynamic lighting
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (lightingSettings.useDynamicLighting) {
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
          alpha: true,
          preserveDrawingBuffer: true
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
      >
        {/* Lighting Setup */}
        <ambientLight 
          intensity={lightingSettings.ambientLight.intensity} 
          color={lightingSettings.ambientLight.color}
        />
        <directionalLight
          position={[
            lightingSettings.primaryLight.x,
            lightingSettings.primaryLight.y,
            lightingSettings.primaryLight.z
          ]}
          intensity={lightingSettings.primaryLight.intensity}
          color={lightingSettings.primaryLight.color}
          castShadow
        />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />

        {/* Environment for reflections */}
        <Environment preset="studio" />

        {/* Card Model */}
        <Suspense fallback={null}>
          <CardModel
            card={card}
            isFlipped={isFlipped}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
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

      {/* Debug Info - Remove this in production */}
      <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-xs">
        <div>Card ID: {card.id}</div>
        <div>Title: {card.title}</div>
        <div>Image: {card.imageUrl ? '✓' : '✗'}</div>
        <div>Effects: {activeEffects.join(', ')}</div>
      </div>

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
