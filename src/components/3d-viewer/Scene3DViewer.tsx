
import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Card } from '@/lib/types';
import { Card3DModel } from './Card3DModel';
import { LightingControls } from './LightingControls';
import { EffectsControls } from './EffectsControls';
import { ViewerControls } from './ViewerControls';
import { useCardLighting } from '@/hooks/useCardLighting';
import { motion, AnimatePresence } from 'framer-motion';

interface Scene3DViewerProps {
  card: Card;
  className?: string;
  onBack?: () => void;
}

const Scene3DViewer: React.FC<Scene3DViewerProps> = ({
  card,
  className = '',
  onBack
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeEffects, setActiveEffects] = useState<string[]>(['holographic']);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({
    holographic: 0.7,
    chrome: 0.5,
    foil: 0.6,
    refractor: 0.4,
    prismatic: 0.8
  });
  
  const {
    lightingSettings,
    lightingPreset,
    applyPreset,
    updateLightPosition,
    updatePrimaryLightIntensity,
    updateAmbientLightIntensity,
    toggleDynamicLighting
  } = useCardLighting('studio');

  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const handleActivity = () => resetTimeout();
    
    if (canvasRef.current) {
      canvasRef.current.addEventListener('mousemove', handleActivity);
      canvasRef.current.addEventListener('click', handleActivity);
    }
    
    resetTimeout();

    return () => {
      clearTimeout(timeout);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleActivity);
        canvasRef.current.removeEventListener('click', handleActivity);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (lightingSettings.useDynamicLighting) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      updateLightPosition(x, y);
    }
  };

  const handleEffectToggle = (effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect) 
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
  };

  const handleEffectIntensityChange = (effect: string, intensity: number) => {
    setEffectIntensities(prev => ({ ...prev, [effect]: intensity }));
  };

  return (
    <div 
      ref={canvasRef}
      className={`relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: false,
          preserveDrawingBuffer: true 
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        
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
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#4f46e5" />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#ec4899" />
        
        {/* Environment */}
        <Environment preset="city" background={false} />
        
        {/* Card Model */}
        <Card3DModel
          card={card}
          isFlipped={isFlipped}
          activeEffects={activeEffects}
          effectIntensities={effectIntensities}
        />
        
        {/* Orbit Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          maxPolarAngle={Math.PI * 0.8}
          minPolarAngle={Math.PI * 0.2}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* UI Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 pointer-events-auto">
              <ViewerControls
                card={card}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                onBack={onBack}
                showControls={showControls}
                onToggleControls={() => setShowControls(!showControls)}
              />
            </div>

            {/* Left Panel - Lighting Controls */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
              <LightingControls
                lightingSettings={lightingSettings}
                lightingPreset={lightingPreset}
                onPresetChange={applyPreset}
                onIntensityChange={updatePrimaryLightIntensity}
                onAmbientChange={updateAmbientLightIntensity}
                onToggleDynamic={toggleDynamicLighting}
              />
            </div>

            {/* Right Panel - Effects Controls */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
              <EffectsControls
                activeEffects={activeEffects}
                effectIntensities={effectIntensities}
                onEffectToggle={handleEffectToggle}
                onIntensityChange={handleEffectIntensityChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center pointer-events-none">
        <p>Click and drag to rotate • Scroll to zoom • Move mouse for dynamic lighting</p>
      </div>
    </div>
  );
};

export default Scene3DViewer;
