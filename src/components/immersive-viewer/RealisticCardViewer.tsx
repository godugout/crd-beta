
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
  } = useCardLighting(environmentType as any);

  // Use provided lighting settings or defaults
  const currentLighting = lightingSettings || defaultLighting;

  console.log('RealisticCardViewer: Rendering with settings:', {
    activeEffects,
    effectIntensities,
    environmentType,
    lightingIntensity: currentLighting?.primaryLight?.intensity,
    ambientIntensity: currentLighting?.ambientLight?.intensity
  });

  // Enhanced mouse movement for dynamic lighting
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
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance'
        }}
        shadows
        style={{ 
          width: '100%',
          height: '100%'
        }}
      >
        {/* Environment Scene */}
        <EnvironmentRenderer environmentType={environmentType} />
        
        {/* Primary directional light */}
        <directionalLight
          position={[
            currentLighting?.primaryLight?.x || 10,
            currentLighting?.primaryLight?.y || 10,
            currentLighting?.primaryLight?.z || 10
          ]}
          intensity={currentLighting?.primaryLight?.intensity || 1.2}
          color={currentLighting?.primaryLight?.color || '#ffffff'}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Enhanced Card Model */}
        <Suspense fallback={null}>
          <CardModel
            card={card}
            isFlipped={isFlipped}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
            materialSettings={materialSettings}
          />
        </Suspense>

        {/* Enhanced Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          maxPolarAngle={Math.PI / 1.3}
          minPolarAngle={Math.PI / 6}
          autoRotate={currentLighting?.autoRotate || false}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Enhanced Flip Button */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-6 py-3 bg-gray-900/80 backdrop-blur-sm text-white rounded-full hover:bg-gray-800/90 transition-all duration-200 shadow-lg border border-gray-600/50 hover:border-gray-500"
        >
          <span className="flex items-center gap-2">
            <span>{isFlipped ? 'Show Front' : 'Show Back'}</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300" 
              style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default RealisticCardViewer;
