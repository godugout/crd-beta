
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
      </>
    );
  }

  // Use dedicated environment components for each type
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

export default EnvironmentRenderer;
