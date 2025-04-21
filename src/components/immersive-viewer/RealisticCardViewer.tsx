import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  OrbitControls,
  ContactShadows,
  MeshReflectorMaterial,
  AccumulativeShadows,
  RandomizedLight,
  Stats
} from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '@/lib/types';
import { useCardLighting } from '@/hooks/useCardLighting';
import { useUserLightingPreferences } from '@/hooks/useUserLightingPreferences';
import { ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mapLightingPresetToEnvironment, ValidEnvironmentPreset } from '@/utils/environmentPresets';
import { logRenderingInfo } from '@/utils/debugRenderer';
import ViewerSettings from '@/components/gallery/viewer-components/ViewerSettings';
import CardModel from '@/components/card-viewer/CardModel';

// Fallback image URLs - updated with correct paths
const FALLBACK_IMAGE_URL = '/images/card-placeholder.png';
const FALLBACK_BACK_IMAGE_URL = '/images/card-back-placeholder.png';

// Debug component to visualize camera and light positions - MUST BE USED INSIDE CANVAS
const DebugInfo = ({ show = false }) => {
  if (!show) return null;
  
  return <Stats className="top-0 left-0" />;
};

// Photorealistic environment setup
const Environment3D = ({ preset = 'studio' }) => {
  // Map the custom preset to a valid @react-three/drei environment preset
  const environmentPreset = mapLightingPresetToEnvironment(preset) as ValidEnvironmentPreset;
  
  return (
    <>
      <Environment 
        preset={environmentPreset}
        background={false} 
        blur={0.6} 
      />
      
      <AccumulativeShadows temporal frames={30} alphaTest={0.85} opacity={0.75}>
        <RandomizedLight amount={8} radius={10} intensity={0.8} position={[5, 5, -10]} />
      </AccumulativeShadows>
      
      <ContactShadows 
        opacity={0.5}
        scale={10}
        blur={2}
        far={10}
        resolution={256}
        color="#000000"
      />
      
      {/* Reflective surface/table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={0.8}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#101010"
          metalness={0.6}
          mirror={0.75}
        />
      </mesh>
    </>
  );
};

interface RealisticCardViewerProps {
  card: Card;
  isCustomizationOpen?: boolean;
  onToggleCustomization?: () => void;
}

const RealisticCardViewer: React.FC<RealisticCardViewerProps> = ({ 
  card,
  isCustomizationOpen = false,
  onToggleCustomization
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [showViewerSettings, setShowViewerSettings] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const { preferences, savePreferences } = useUserLightingPreferences();
  const {
    lightingSettings,
    updateLightingSetting,
    applyPreset,
    isUserCustomized,
    toggleDynamicLighting
  } = useCardLighting(preferences?.environmentType || 'studio');
  
  // Card with fallback images - use updated fallback paths
  const cardWithFallback = {
    ...card,
    imageUrl: card.imageUrl || FALLBACK_IMAGE_URL,
    backImageUrl: card.backImageUrl || FALLBACK_BACK_IMAGE_URL
  };

  // Save user preferences when they change
  useEffect(() => {
    if (isUserCustomized && lightingSettings) {
      savePreferences(lightingSettings);
    }
  }, [lightingSettings, isUserCustomized, savePreferences]);
  
  // Toggle debug mode with Shift+D keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'D') {
        setIsDebugMode(prev => !prev);
        console.log("Debug mode:", !isDebugMode);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDebugMode]);

  // Setup effects from card data
  useEffect(() => {
    if (card && card.effects) {
      setActiveEffects(card.effects);
    }
  }, [card]);

  // Get effect intensities (can be expanded to use card data if available)
  const effectIntensities = {
    Holographic: 0.7,
    Shimmer: 0.8,
    Refractor: 0.6,
    Vintage: 0.7
  };
  
  // Clean up WebGL resources on unmount
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        const gl = canvasRef.current.getContext('webgl2') || canvasRef.current.getContext('webgl');
        if (gl) {
          const loseContext = gl.getExtension('WEBGL_lose_context');
          if (loseContext) loseContext.loseContext();
        }
      }
    };
  }, []);

  // Get the environment preset as a valid type
  const envPreset = mapLightingPresetToEnvironment(lightingSettings.environmentType) as ValidEnvironmentPreset;

  // Adapter function to make updateLightingSetting compatible with ViewerSettings
  const handleUpdateSetting = (path: string, value: any) => {
    const pathParts = path.split('.');
    if (pathParts.length === 2) {
      const [group, property] = pathParts;
      updateLightingSetting({
        [group]: {
          ...lightingSettings[group],
          [property]: value
        }
      });
    } else {
      updateLightingSetting({
        [path]: value
      });
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Canvas with WebGL renderer */}
      <Canvas 
        ref={canvasRef}
        shadows 
        gl={{ 
          antialias: true, 
          alpha: false,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        }}
        className="bg-gray-800 z-0"
        dpr={[1, 1.5]} // Reduce resolution for better performance
      >
        <color attach="background" args={["#0f172a"]} />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        
        <ambientLight intensity={0.7} />
        <spotLight
          position={[
            lightingSettings.primaryLight.x,
            lightingSettings.primaryLight.y,
            lightingSettings.primaryLight.z
          ]}
          intensity={lightingSettings.primaryLight.intensity * 1.5}
          color={lightingSettings.primaryLight.color}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        <Suspense fallback={
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="purple" />
          </mesh>
        }>
          <CardModel 
            imageUrl={cardWithFallback.imageUrl}
            backImageUrl={cardWithFallback.backImageUrl}
            isFlipped={isFlipped}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
          />
          
          <Environment 
            preset={envPreset} 
            background={false}
            blur={0.6}
          />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          minDistance={4}
          maxDistance={10}
          autoRotate={!isCustomizationOpen && lightingSettings.autoRotate}
          autoRotateSpeed={0.5}
        />
        
        <DebugInfo show={isDebugMode} />
      </Canvas>

      {/* Controls overlay - OUTSIDE of Canvas */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        <Button
          variant="secondary"
          size="lg"
          className="rounded-full shadow-lg bg-black/50 backdrop-blur-md hover:bg-black/70 text-white"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {isFlipped ? 'View Front' : 'View Back'}
        </Button>
      </div>
      
      {/* Customization panel toggle - OUTSIDE of Canvas */}
      <div 
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-300",
          isCustomizationOpen ? "right-[380px]" : "right-4"
        )}
      >
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg bg-black/50 backdrop-blur-md hover:bg-black/70 text-white h-10 w-10"
          onClick={onToggleCustomization}
        >
          {isCustomizationOpen ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      
      {/* Debug indicator - OUTSIDE of Canvas */}
      {isDebugMode && (
        <div className="absolute top-2 left-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded z-50">
          Debug Mode
        </div>
      )}
      
      {/* Card title overlay - OUTSIDE of Canvas */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10">
        {card.title || 'Untitled Card'}
      </div>

      {/* Settings button - OUTSIDE of Canvas */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white bg-black/50 backdrop-blur-sm hover:bg-black/70 z-20"
        onClick={() => setShowViewerSettings(!showViewerSettings)}
      >
        <Eye className="h-5 w-5" />
      </Button>

      {/* Viewer settings - OUTSIDE of Canvas */}
      {showViewerSettings && (
        <div className="absolute top-16 right-4 w-72 bg-black/60 backdrop-blur-md p-4 rounded-lg z-20">
          <ViewerSettings
            settings={lightingSettings}
            onUpdateSettings={handleUpdateSetting}
            onApplyPreset={applyPreset}
            isOpen={showViewerSettings}
          />
        </div>
      )}
    </div>
  );
};

export default RealisticCardViewer;
