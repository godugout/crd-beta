
import React, { useMemo, useEffect, useState } from 'react';
import { Environment } from '@react-three/drei';
import { hdrImageCache } from '@/services/hdrImageCache';
import * as THREE from 'three';

interface EnvironmentRendererProps {
  environmentType: string;
  lightingSettings?: any;
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ 
  environmentType, 
  lightingSettings 
}) => {
  const [hdrTexture, setHdrTexture] = useState<THREE.DataTexture | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Environment configuration based on environment type
  const environmentConfig = useMemo(() => {
    switch (environmentType) {
      case 'studio':
        return { background: true };
      case 'gallery':
        return { background: true };
      case 'stadium':
        return { background: true };
      case 'twilight':
        return { background: true };
      case 'quarry':
        return { background: true };
      case 'coastline':
        return { background: true };
      case 'hillside':
        return { background: true };
      case 'milkyway':
        return { background: true };
      case 'esplanade':
        return { background: true };
      case 'neonclub':
        return { background: true };
      case 'industrial':
        return { background: true };
      default:
        return { background: true };
    }
  }, [environmentType]);

  // Load HDR texture
  useEffect(() => {
    setIsLoading(true);
    setHdrTexture(null);

    const loadEnvironment = async () => {
      try {
        console.log(`EnvironmentRenderer: Loading environment ${environmentType}`);
        
        const texture = await hdrImageCache.getTexture(environmentType);
        
        if (texture) {
          console.log(`EnvironmentRenderer: Successfully loaded HDR texture for ${environmentType}`);
          
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.needsUpdate = true;
          texture.magFilter = THREE.LinearFilter;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.generateMipmaps = true;
          
          setHdrTexture(texture);
        } else {
          console.warn(`EnvironmentRenderer: Failed to load ${environmentType}`);
        }
      } catch (error) {
        console.error(`EnvironmentRenderer: Error loading ${environmentType}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEnvironment();
  }, [environmentType]);

  return (
    <>
      {/* Use HDR texture if available, otherwise fallback to basic presets */}
      {hdrTexture && !isLoading ? (
        <Environment 
          map={hdrTexture}
          background={environmentConfig.background}
        />
      ) : (
        <Environment 
          preset={environmentType === 'milkyway' ? 'night' : 
                 environmentType === 'twilight' ? 'sunset' : 'studio'}
          background={environmentConfig.background}
        />
      )}
    </>
  );
};

export default EnvironmentRenderer;
