
import React, { Suspense, useEffect, useState, useRef } from 'react';
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
  const [dynamicLightPosition, setDynamicLightPosition] = useState({ x: 10, y: 10, z: 10 });
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    lightingSettings: defaultLighting,
    updateLightPosition
  } = useCardLighting(environmentType as any);

  // Use provided lighting settings or defaults
  const currentLighting = lightingSettings || defaultLighting;

  console.log('RealisticCardViewer: Current lighting settings:', currentLighting);

  // Enhanced mouse movement for dynamic lighting
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (currentLighting?.useDynamicLighting && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      
      // Convert normalized coordinates to light position with more dramatic range
      const lightX = (x - 0.5) * 40;
      const lightY = (0.5 - y) * 40;
      const lightZ = 15;
      
      setDynamicLightPosition({ x: lightX, y: lightY, z: lightZ });
      updateLightPosition(x, y);
    }
  };

  // Use dynamic light position when dynamic lighting is enabled
  const finalLightPosition = currentLighting?.useDynamicLighting 
    ? dynamicLightPosition 
    : {
        x: currentLighting?.primaryLight?.x || 10,
        y: currentLighting?.primaryLight?.y || 10,
        z: currentLighting?.primaryLight?.z || 10
      };

  const secondaryLightPosition = {
    x: currentLighting?.secondaryLight?.x || -6,
    y: currentLighting?.secondaryLight?.y || 8,
    z: currentLighting?.secondaryLight?.z || 10
  };

  const fillLightPosition = {
    x: currentLighting?.fillLight?.x || 0,
    y: currentLighting?.fillLight?.y || -5,
    z: currentLighting?.fillLight?.z || 8
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
      onPointerMove={handlePointerMove}
      style={{ backgroundColor: currentLighting?.backgroundColor || '#1a1a1a' }}
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
        
        {/* Primary directional light with dramatic positioning */}
        <directionalLight
          position={[finalLightPosition.x, finalLightPosition.y, finalLightPosition.z]}
          intensity={currentLighting?.primaryLight?.intensity || 2.2}
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

        {/* Secondary light for fill lighting */}
        {currentLighting?.secondaryLight && (
          <directionalLight
            position={[secondaryLightPosition.x, secondaryLightPosition.y, secondaryLightPosition.z]}
            intensity={currentLighting.secondaryLight.intensity}
            color={currentLighting.secondaryLight.color}
          />
        )}

        {/* Fill light from below for gallery/studio setups */}
        {currentLighting?.fillLight && (
          <pointLight
            position={[fillLightPosition.x, fillLightPosition.y, fillLightPosition.z]}
            intensity={currentLighting.fillLight.intensity}
            color={currentLighting.fillLight.color}
            distance={20}
            decay={2}
          />
        )}

        {/* Ambient light with proper intensity */}
        <ambientLight
          intensity={currentLighting?.ambientLight?.intensity || 0.4}
          color={currentLighting?.ambientLight?.color || '#f0f0ff'}
        />

        {/* Enhanced Card Model */}
        <Suspense fallback={null}>
          <CardModel
            card={card}
            isFlipped={isFlipped}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
            materialSettings={materialSettings}
            lightPosition={finalLightPosition}
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

      {/* Dynamic lighting indicator */}
      {currentLighting?.useDynamicLighting && (
        <div className="absolute top-4 right-4 z-10">
          <div className="px-3 py-1 bg-blue-600/80 backdrop-blur-sm text-white text-xs rounded-full">
            Dynamic Lighting: ON
          </div>
        </div>
      )}

      {/* Lighting preset indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="px-3 py-1 bg-gray-900/80 backdrop-blur-sm text-white text-xs rounded-full capitalize">
          {currentLighting?.environmentType || environmentType} Lighting
        </div>
      </div>
    </div>
  );
};

export default RealisticCardViewer;
