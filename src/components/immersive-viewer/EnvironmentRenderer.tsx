
import React, { useMemo, useEffect, useState } from 'react';
import { Environment, Sky } from '@react-three/drei';
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
          console.log('Texture details:', {
            width: texture.image?.width,
            height: texture.image?.height,
            format: texture.format,
            mapping: texture.mapping
          });
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

  // Show loading state
  if (isLoading) {
    console.log(`EnvironmentRenderer: Loading ${environmentType}...`);
  }

  // Show error state
  if (loadError) {
    console.error(`EnvironmentRenderer: Error state for ${environmentType}:`, loadError);
  }

  return (
    <>
      {/* Use the loaded HDR texture if available */}
      {!isLoading && hdrTexture ? (
        <>
          <Environment 
            map={hdrTexture}
            background={true}
          />
          <fog attach="fog" args={['#000000', 50, 200]} />
        </>
      ) : (
        /* Fallback environments with specific configs for problematic ones */
        <>
          {environmentType === 'milkyway' ? (
            <>
              <Environment preset="night" background={true} />
              <fog attach="fog" args={['#000011', 30, 150]} />
            </>
          ) : environmentType === 'twilight' ? (
            <>
              <Environment preset="sunset" background={true} />
              <fog attach="fog" args={['#4a5568', 40, 180]} />
            </>
          ) : (
            <Environment 
              preset="studio"
              background={true}
            />
          )}
        </>
      )}
      
      {/* Add ambient light to control overall intensity */}
      <ambientLight intensity={environmentConfig.ambientIntensity} />
      
      {/* Add directional light with environment-specific intensity */}
      <directionalLight 
        intensity={environmentConfig.intensity} 
        position={[10, 10, 5]} 
        castShadow
      />
    </>
  );
};

export default EnvironmentRenderer;
