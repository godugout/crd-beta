
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  useGLTF, 
  OrbitControls,
  ContactShadows,
  useTexture,
  MeshReflectorMaterial,
  AccumulativeShadows,
  RandomizedLight,
  Stats
} from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '@/lib/types';
import { useCardLighting, LightingSettings } from '@/hooks/useCardLighting';
import { useUserLightingPreferences } from '@/hooks/useUserLightingPreferences';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getEnvironmentMapById } from '@/lib/environment-maps';
import { logRenderingInfo } from '@/utils/debugRenderer';
import ViewerSettings from '@/components/gallery/viewer-components/ViewerSettings';

// Debug component to visualize camera and light positions - MUST BE USED INSIDE CANVAS
const DebugInfo = ({ show = false }) => {
  if (!show) return null;
  
  return <Stats className="top-0 left-0" />;
};

// Physically-based card model with materials
const CardModel = ({ 
  card, 
  isFlipped, 
  lightingSettings,
  materialProps = { roughness: 0.1, metalness: 0.2 }
}) => {
  const { scene } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);
  
  // Load textures using Three.js TextureLoader
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    
    // Load front texture
    const frontTextureUrl = card.imageUrl || '/placeholder-card.jpg';
    console.log(`Loading front texture from: ${frontTextureUrl}`);
    
    textureLoader.load(
      frontTextureUrl,
      (texture) => {
        console.log(`Successfully loaded front texture`);
        setFrontTexture(texture);
      },
      (progress) => {
        console.log(`Loading progress: ${Math.round((progress.loaded / progress.total) * 100)}%`);
      },
      (error) => {
        console.error(`Failed to load texture from: ${frontTextureUrl}`, error);
        setLoadingError(`Front texture loading failed`);
      }
    );
    
    // Load back texture
    const backTextureUrl = '/card-back-texture.jpg';
    
    textureLoader.load(
      backTextureUrl,
      (texture) => {
        setBackTexture(texture);
      },
      undefined,
      (error) => {
        console.error(`Failed to load back texture: ${backTextureUrl}`, error);
        setLoadingError(`Back texture loading failed`);
      }
    );
    
    return () => {
      // Dispose textures on cleanup
      if (frontTexture) frontTexture.dispose();
      if (backTexture) backTexture.dispose();
    };
  }, [card.imageUrl]);
  
  // Create a simple colored material as fallback
  const createFallbackMaterial = (color: string) => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.5,
      metalness: 0.2
    });
  };

  // Animation effect for flipping
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const targetRotation = isFlipped ? Math.PI : 0;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation,
      0.1
    );

    // Subtle floating animation
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
    
    // Log the mesh position and rotation for debugging
    logRenderingInfo("CardModel", {
      visible: true,
      position: {
        y: meshRef.current.position.y,
        z: meshRef.current.position.z
      }
    });
  });
  
  // If there's a loading error, show an error cube
  if (loadingError) {
    return (
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[4, 0.5, 0.1]} />
        <meshStandardMaterial color="red" transparent opacity={0.7} />
      </mesh>
    );
  }
  
  return (
    <group>
      {/* Card mesh - Front Side */}
      <mesh 
        ref={meshRef} 
        castShadow 
        receiveShadow
      >
        {/* Card geometry with proper card proportions (2.5 x 3.5 inch standard) */}
        <planeGeometry args={[2.5, 3.5, 20, 20]} />
        
        {/* Front material */}
        <meshPhysicalMaterial 
          map={frontTexture}
          color={frontTexture ? undefined : "#2a5298"}
          side={THREE.FrontSide}
          roughness={materialProps.roughness || 0.2}
          metalness={materialProps.metalness || 0.8}
          envMapIntensity={lightingSettings.envMapIntensity || 1.5}
          clearcoat={1}
          clearcoatRoughness={0.2}
          reflectivity={0.8}
        />
      </mesh>
      
      {/* Card back side - as a separate mesh */}
      <mesh 
        position={[0, 0, -0.01]}
        rotation={[0, Math.PI, 0]}
        castShadow 
        receiveShadow
      >
        <planeGeometry args={[2.5, 3.5, 20, 20]} />
        
        {/* Back material */}
        <meshPhysicalMaterial 
          map={backTexture}
          color={backTexture ? undefined : "#1a3060"}
          side={THREE.FrontSide}
          roughness={(materialProps.roughness || 0.2) * 1.2}
          metalness={(materialProps.metalness || 0.8) * 0.8}
          envMapIntensity={(lightingSettings.envMapIntensity || 1) * 0.8}
          clearcoat={0.5}
          clearcoatRoughness={0.3}
        />
      </mesh>
    </group>
  );
};

// Photorealistic environment setup
const Environment3D = ({ preset = 'studio' as const }) => {
  // Use an explicit type assertion to ensure preset is one of the valid values
  const validPreset = (preset as "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse");
  
  return (
    <>
      <Environment 
        preset={validPreset} 
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
  const { preferences, savePreferences } = useUserLightingPreferences();
  const {
    lightingSettings,
    lightingPreset,
    updateLightingSetting,
    applyPreset,
    isUserCustomized,
    toggleDynamicLighting
  } = useCardLighting(preferences?.environmentType || 'studio');

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

  return (
    <div className="w-full h-full relative">
      {/* Canvas with WebGL renderer */}
      <Canvas 
        shadows 
        gl={{ 
          antialias: true, 
          alpha: false,
          preserveDrawingBuffer: true
        }}
        className="bg-gray-800 z-0"
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
            card={card}
            isFlipped={isFlipped}
            lightingSettings={lightingSettings}
            materialProps={{
              roughness: 0.15,
              metalness: 0.3
            }}
          />
          <Environment3D preset={lightingSettings.environmentType} />
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

      {/* Controls overlay - MOVED OUTSIDE of Canvas */}
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
            onUpdateSettings={updateLightingSetting}
            onApplyPreset={applyPreset}
            isOpen={showViewerSettings}
          />
        </div>
      )}
    </div>
  );
};

export default RealisticCardViewer;
