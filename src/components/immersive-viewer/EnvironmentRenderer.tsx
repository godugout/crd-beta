
import React, { useMemo, useEffect, useState } from 'react';
import { Environment } from '@react-three/drei';
import { hdrImageCache } from '@/services/hdrImageCache';
import * as THREE from 'three';

interface EnvironmentRendererProps {
  environmentType: string;
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ environmentType }) => {
  const [hdrTexture, setHdrTexture] = useState<THREE.DataTexture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Environment intensity configuration
  const environmentConfig = useMemo(() => {
    switch (environmentType) {
      case 'studio':
        return { intensity: 1.0, ambientIntensity: 0.3 };
      case 'gallery':
        return { intensity: 0.8, ambientIntensity: 0.3 };
      case 'stadium':
        return { intensity: 1.2, ambientIntensity: 0.3 };
      case 'twilight':
        return { intensity: 0.7, ambientIntensity: 0.3 };
      case 'quarry':
        return { intensity: 0.9, ambientIntensity: 0.3 };
      case 'coastline':
        return { intensity: 1.1, ambientIntensity: 0.3 };
      case 'hillside':
        return { intensity: 0.8, ambientIntensity: 0.3 };
      case 'milkyway':
        return { intensity: 0.4, ambientIntensity: 0.2 };
      case 'esplanade':
        return { intensity: 1.0, ambientIntensity: 0.3 };
      case 'neonclub':
        return { intensity: 0.6, ambientIntensity: 0.3 };
      case 'industrial':
        return { intensity: 0.7, ambientIntensity: 0.3 };
      default:
        return { intensity: 1.0, ambientIntensity: 0.3 };
    }
  }, [environmentType]);

  // Load HDR texture using our cache service
  useEffect(() => {
    setIsLoading(true);
    setHdrTexture(null);
    setLoadError(null);

    const loadEnvironment = async () => {
      try {
        console.log(`EnvironmentRenderer: Loading environment ${environmentType}`);
        
        const texture = await hdrImageCache.getTexture(environmentType);
        
        if (texture) {
          console.log(`EnvironmentRenderer: Successfully loaded HDR texture for ${environmentType}`);
          
          // Ensure texture is properly configured
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.needsUpdate = true;
          
          setHdrTexture(texture);
        } else {
          console.warn(`EnvironmentRenderer: Failed to load ${environmentType}, texture is null`);
          setLoadError(`Failed to load HDR texture for ${environmentType}`);
        }
      } catch (error) {
        console.error(`EnvironmentRenderer: Error loading ${environmentType}:`, error);
        setLoadError(`Error loading ${environmentType}: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadEnvironment();
  }, [environmentType]);

  return (
    <>
      {/* Use the loaded HDR texture if available, otherwise use basic presets */}
      {hdrTexture && !isLoading ? (
        <Environment 
          map={hdrTexture}
          background={true}
        />
      ) : (
        /* Fallback to basic drei presets */
        <Environment 
          preset={environmentType === 'milkyway' ? 'night' : 
                 environmentType === 'twilight' ? 'sunset' : 'studio'}
          background={true}
        />
      )}
      
      {/* Add basic lighting */}
      <ambientLight intensity={environmentConfig.ambientIntensity} />
      <directionalLight 
        intensity={environmentConfig.intensity} 
        position={[10, 10, 5]} 
        castShadow
      />
    </>
  );
};

export default EnvironmentRenderer;
