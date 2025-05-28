
import React, { useEffect, useState } from 'react';
import { StadiumEnvironment } from './environments/StadiumEnvironment';
import { GalleryEnvironment } from './environments/GalleryEnvironment';
import { CosmicEnvironment } from './environments/CosmicEnvironment';
import { UnderwaterEnvironment } from './environments/UnderwaterEnvironment';
import { StudioEnvironment } from './environments/StudioEnvironment';
import { NightSkyEnvironment } from './environments/NightSkyEnvironment';
import { RetroArcadeEnvironment } from './environments/RetroArcadeEnvironment';
import { ForestEnvironment } from './environments/ForestEnvironment';
import { Environment } from '@react-three/drei';
import { hdrImageCache } from '@/services/hdrImageCache';
import * as THREE from 'three';

interface EnvironmentRendererProps {
  environmentType: string;
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ environmentType }) => {
  const [cachedTexture, setCachedTexture] = useState<THREE.DataTexture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  console.log('EnvironmentRenderer: Rendering environment type:', environmentType);

  // Preload and cache the HDR texture for the current environment
  useEffect(() => {
    let isMounted = true;
    
    const loadEnvironmentTexture = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        console.log(`EnvironmentRenderer: Loading HDR for ${environmentType}`);
        
        const texture = await hdrImageCache.getTexture(environmentType);
        
        if (isMounted && texture) {
          setCachedTexture(texture);
          console.log(`EnvironmentRenderer: HDR texture loaded for ${environmentType}`);
        }
      } catch (error) {
        console.error(`EnvironmentRenderer: Failed to load HDR for ${environmentType}:`, error);
        if (isMounted) {
          setHasError(true);
          setCachedTexture(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEnvironmentTexture();

    return () => {
      isMounted = false;
    };
  }, [environmentType]);

  // If we have a cached texture and no errors, use it directly
  if (cachedTexture && !isLoading && !hasError) {
    return (
      <>
        <primitive object={cachedTexture} attach="background" />
        <Environment map={cachedTexture} background={false} />
        {renderEnvironmentLighting(environmentType)}
      </>
    );
  }

  // Fallback to original environment components while loading or on error
  switch (environmentType) {
    case 'stadium':
      return <StadiumEnvironment />;
    
    case 'gallery':
      return <GalleryEnvironment />;
    
    case 'cardshop':
    case 'store':
    case 'mall':
      return <RetroArcadeEnvironment />;
    
    case 'cosmic':
    case 'space':
      return <CosmicEnvironment />;
    
    case 'underwater':
    case 'ocean':
      return <UnderwaterEnvironment />;
      
    case 'night':
    case 'nightsky':
      return <NightSkyEnvironment />;
      
    case 'forest':
    case 'nature':
      return <ForestEnvironment />;
    
    default: // studio
      return <StudioEnvironment />;
  }
};

// Helper function to render environment-specific lighting
const renderEnvironmentLighting = (environmentType: string) => {
  switch (environmentType) {
    case 'stadium':
      return (
        <>
          <directionalLight position={[10, 20, 5]} intensity={2.0} color="#ffffff" castShadow />
          <pointLight position={[-10, 15, 5]} intensity={1.5} color="#ffffff" />
          <ambientLight intensity={0.8} color="#f5f5dc" />
          <fog attach="fog" args={['#2a3c5f', 50, 200]} />
        </>
      );
    
    case 'gallery':
      return (
        <>
          <directionalLight position={[10, 15, 8]} intensity={2.5} color="#ffffff" castShadow />
          <directionalLight position={[-8, 12, 8]} intensity={1.8} color="#f8f8ff" />
          <ambientLight intensity={0.6} color="#f5f5f5" />
          <spotLight
            position={[0, 25, 10]}
            angle={0.3}
            penumbra={0.4}
            intensity={1.5}
            color="#ffffff"
            target-position={[0, 0, 0]}
          />
        </>
      );
    
    case 'cosmic':
    case 'space':
      return (
        <>
          <ambientLight intensity={0.1} color="#001122" />
          <pointLight position={[100, 50, 100]} color="#ffffff" intensity={0.3} distance={1000} />
          <pointLight position={[-80, -30, 120]} color="#aaccff" intensity={0.2} distance={800} />
          <fog attach="fog" args={['#000011', 200, 800]} />
        </>
      );
    
    case 'underwater':
    case 'ocean':
      return (
        <>
          <directionalLight position={[0, 20, 0]} intensity={1.5} color="#87ceeb" castShadow />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#4682b4" />
          <pointLight position={[-10, 5, -10]} intensity={0.6} color="#20b2aa" />
          <ambientLight intensity={0.3} color="#006994" />
          <fog attach="fog" args={['#004466', 20, 100]} />
        </>
      );
      
    case 'night':
    case 'nightsky':
      return (
        <>
          <ambientLight intensity={0.15} color="#1a1a3a" />
          <directionalLight position={[50, 80, 30]} intensity={0.8} color="#e6f3ff" castShadow />
          <pointLight position={[200, 100, 150]} color="#ffffff" intensity={0.2} distance={2000} />
          <fog attach="fog" args={['#0c0c1e', 300, 1000]} />
        </>
      );
      
    case 'forest':
    case 'nature':
      return (
        <>
          <ambientLight intensity={0.5} color="#4a6741" />
          <directionalLight position={[20, 30, 15]} intensity={2.0} color="#fff8dc" castShadow />
          <spotLight
            position={[25, 35, 25]}
            target-position={[5, 0, 5]}
            angle={0.3}
            penumbra={0.8}
            intensity={1.8}
            color="#fffacd"
          />
          <fog attach="fog" args={['#2d4a22', 40, 120]} />
        </>
      );
      
    case 'cardshop':
    case 'store':
    case 'mall':
      return (
        <>
          <ambientLight intensity={0.4} color="#ff00ff" />
          <directionalLight position={[10, 15, 10]} intensity={1.8} color="#00ffff" castShadow />
          <pointLight position={[15, 10, 15]} intensity={2.0} color="#ff0080" />
          <pointLight position={[-15, 12, 10]} intensity={1.5} color="#00ff80" />
          <fog attach="fog" args={['#1a0826', 25, 80]} />
        </>
      );
    
    default: // studio
      return (
        <>
          <directionalLight position={[10, 15, 10]} intensity={3.0} color="#ffffff" castShadow />
          <directionalLight position={[-8, 12, 8]} intensity={1.5} color="#f0f0ff" />
          <directionalLight position={[0, 8, -15]} intensity={1.0} color="#fff5e0" />
          <spotLight
            position={[15, 20, 15]}
            target-position={[0, 0, 0]}
            angle={0.4}
            penumbra={0.3}
            intensity={2.0}
            color="#ffffff"
            castShadow
          />
          <spotLight
            position={[-15, 20, 15]}
            target-position={[0, 0, 0]}
            angle={0.4}
            penumbra={0.3}
            intensity={1.8}
            color="#ffffff"
          />
          <ambientLight intensity={0.4} color="#f0f0ff" />
        </>
      );
  }
};

export default EnvironmentRenderer;
