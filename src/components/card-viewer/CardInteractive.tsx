import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useCardLighting, LightingPreset } from '@/hooks/useCardLighting';
import CardLighting from './CardLighting';
import LightingControls from './LightingControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoveHorizontal, Lightbulb, Settings } from 'lucide-react';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';
import { useUserLightingPreferences } from '@/hooks/useUserLightingPreferences';
import CardModel from './CardModel';
import { Button } from '@/components/ui/button';

interface CardInteractiveProps {
  card: Card;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  isFlipped: boolean;
  onFlip: () => void;
}

const CardInteractive: React.FC<CardInteractiveProps> = ({
  card,
  activeEffects,
  effectIntensities,
  isFlipped,
  onFlip
}) => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetect();
  const [showControls, setShowControls] = useState(!isMobile);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTab, setCurrentTab] = useState<'view' | 'lighting'>('view');

  const {
    lightingSettings,
    lightingPreset,
    applyPreset,
    updateLightingSetting,
    updateLightPosition,
    toggleDynamicLighting,
    isUserCustomized
  } = useCardLighting('display_case');
  
  const {
    preferences: savedUserSettings,
    isLoading: isLoadingPreferences,
    savePreferences
  } = useUserLightingPreferences();
  
  useEffect(() => {
    if (savedUserSettings && !isLoadingPreferences) {
      updateLightingSetting({
        primaryLight: savedUserSettings.primaryLight,
        ambientLight: savedUserSettings.ambientLight,
        environmentType: savedUserSettings.environmentType,
        envMapIntensity: savedUserSettings.envMapIntensity,
        useDynamicLighting: savedUserSettings.useDynamicLighting
      });
    }
  }, [savedUserSettings, isLoadingPreferences, updateLightingSetting]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!lightingSettings.useDynamicLighting) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    updateLightPosition(x, y);
  };
  
  const handlePresetChange = (preset: LightingPreset) => {
    applyPreset(preset);
  };
  
  const handleSaveSettings = () => {
    savePreferences(lightingSettings);
  };

  const getOptimizedLighting = () => {
    if (isMobile) {
      return {
        ...lightingSettings,
        envMapIntensity: lightingSettings.envMapIntensity * 0.7,
      };
    }
    return lightingSettings;
  };
  
  const optimizedSettings = getOptimizedLighting();

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs 
        defaultValue="view" 
        value={currentTab} 
        onValueChange={(value) => setCurrentTab(value as 'view' | 'lighting')}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="view">
              <MoveHorizontal className="w-4 h-4 mr-2" />
              View Card
            </TabsTrigger>
            <TabsTrigger value="lighting">
              <Lightbulb className="w-4 h-4 mr-2" />
              Lighting
            </TabsTrigger>
          </TabsList>
          
          {isUserCustomized && (
            <Button size="sm" variant="outline" onClick={handleSaveSettings}>
              <Settings className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          )}
        </div>
        
        <TabsContent value="view" className="mt-0">
          <div 
            className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-900"
            onMouseMove={handleMouseMove}
          >
            <Canvas
              ref={canvasRef}
              shadows
              dpr={[1, isMobile ? 1.5 : 2]}
              performance={{ min: 0.5 }}
              gl={{ preserveDrawingBuffer: true }}
            >
              <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
              
              <CardLighting 
                settings={optimizedSettings}
                debug={false}
              />
              
              <CardModel 
                imageUrl={card.imageUrl || '/placeholder-card.jpg'}
                backImageUrl={card.backImageUrl || '/card-back-texture.jpg'}
                isFlipped={isFlipped} 
                activeEffects={activeEffects}
                effectIntensities={{}}
              />
              
              <OrbitControls
                enablePan={!isMobile}
                enableZoom={true}
                minDistance={3}
                maxDistance={8}
                maxPolarAngle={Math.PI * 0.65}
                minPolarAngle={Math.PI * 0.25}
              />
            </Canvas>
            
            <button
              className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg transition-all"
              onClick={onFlip}
              aria-label={isFlipped ? "Show front of card" : "Show back of card"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m17 3-5 5-5-5" />
                <path d="m17 21-5-5-5 5" />
                <path d="M4 12h16" />
              </svg>
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="lighting" className="mt-0">
          <LightingControls
            settings={lightingSettings}
            onUpdateSettings={(settings) => updateLightingSetting(settings)}
            onApplyPreset={handlePresetChange}
            onToggleDynamicLighting={toggleDynamicLighting}
            isUserCustomized={isUserCustomized}
          />
          
          <div className="mt-4 rounded-lg overflow-hidden bg-gray-900 aspect-video">
            <Canvas
              shadows
              dpr={[1, isMobile ? 1.5 : 2]}
              performance={{ min: 0.5 }}
            >
              <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
              
              <CardLighting 
                settings={optimizedSettings}
                debug={true}
              />
              
              <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[1, 1.4, 0.05]} />
                <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.2} />
              </mesh>
              
              <mesh position={[0, -1, 0]} rotation={[-Math.PI * 0.5, 0, 0]} receiveShadow>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#303030" metalness={0.2} roughness={0.8} />
              </mesh>
              
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                autoRotate
                autoRotateSpeed={1}
              />
            </Canvas>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardInteractive;
