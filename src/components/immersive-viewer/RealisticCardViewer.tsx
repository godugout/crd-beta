
import React, { useRef, useState, useEffect, Suspense } from 'react';
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
  RandomizedLight
} from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '@/lib/types';
import { useCardLighting, LightingSettings } from '@/hooks/useCardLighting';
import { useUserLightingPreferences } from '@/hooks/useUserLightingPreferences';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getEnvironmentMapById } from '@/lib/environment-maps';

// Physically-based card model with materials
const CardModel = ({ 
  card, 
  isFlipped, 
  lightingSettings,
  materialProps = { roughness: 0.1, metalness: 0.2 }
}) => {
  const { scene } = useThree();
  const meshRef = useRef();
  const frontTexture = useTexture(card.imageUrl || '/placeholder-card.jpg');
  const backTexture = useTexture('/card-back-texture.jpg');
  
  // Configure PBR materials
  const frontMaterial = new THREE.MeshPhysicalMaterial({
    map: frontTexture,
    roughness: materialProps.roughness,
    metalness: materialProps.metalness,
    envMapIntensity: lightingSettings.envMapIntensity || 1,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
    reflectivity: 0.2,
    side: THREE.FrontSide
  });

  const backMaterial = new THREE.MeshPhysicalMaterial({
    map: backTexture,
    roughness: materialProps.roughness * 1.2,
    metalness: materialProps.metalness * 0.8,
    envMapIntensity: lightingSettings.envMapIntensity || 1,
    clearcoat: 0.05,
    clearcoatRoughness: 0.3,
    reflectivity: 0.1,
    side: THREE.BackSide
  });

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
  });
  
  return (
    <group>
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* Card geometry with proper card proportions (2.5 x 3.5 inch standard) */}
        <planeGeometry args={[2.5, 3.5, 20, 20]} />
        <primitive object={frontMaterial} attach="material-0" />
        <primitive object={backMaterial} attach="material-1" />
      </mesh>
    </group>
  );
};

// Photorealistic environment setup
const Environment3D = ({ preset }) => {
  const environmentMap = getEnvironmentMapById(preset);
  
  return (
    <>
      <Environment preset={preset} background blur={0.6} />
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

  return (
    <div className="w-full h-full relative">
      {/* Canvas with WebGL renderer */}
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.3} />
        <spotLight
          position={[
            lightingSettings.primaryLight.x,
            lightingSettings.primaryLight.y,
            lightingSettings.primaryLight.z
          ]}
          intensity={lightingSettings.primaryLight.intensity}
          color={lightingSettings.primaryLight.color}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <Suspense fallback={null}>
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
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        <Button
          variant="secondary"
          size="lg"
          className="rounded-full shadow-lg bg-black/30 backdrop-blur-md hover:bg-black/50 text-white"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {isFlipped ? 'View Front' : 'View Back'}
        </Button>
      </div>
      
      {/* Customization panel toggle */}
      <div 
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-300",
          isCustomizationOpen ? "right-[380px]" : "right-4"
        )}
      >
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg bg-black/30 backdrop-blur-md hover:bg-black/50 text-white h-10 w-10"
          onClick={onToggleCustomization}
        >
          {isCustomizationOpen ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
    </div>
  );
};

export default RealisticCardViewer;
