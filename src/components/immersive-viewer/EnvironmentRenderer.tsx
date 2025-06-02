
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

    const loadEnvironment = async () => {
      try {
        console.log(`EnvironmentRenderer: Loading environment ${environmentType}`);
        const texture = await hdrImageCache.getTexture(environmentType);
        
        if (texture) {
          setHdrTexture(texture);
          console.log(`EnvironmentRenderer: Successfully loaded ${environmentType}`);
        } else {
          console.warn(`EnvironmentRenderer: Failed to load ${environmentType}, using fallback`);
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
      {/* Use the loaded HDR texture or fallback to preset */}
      {!isLoading && hdrTexture ? (
        <Environment 
          map={hdrTexture}
          background={true}
        />
      ) : (
        <Environment 
          preset="studio"
          background={true}
        />
      )}
      
      {/* Add ambient light to control overall intensity */}
      <ambientLight intensity={environmentConfig.ambientIntensity} />
      
      {/* Add directional light with environment-specific intensity */}
      <directionalLight 
        intensity={environmentConfig.intensity} 
        position={[10, 10, 5]} 
        castShadow
      />
      
      {/* Special sky for twilight environment as enhancement - behind HDR */}
      {environmentType === 'twilight' && (
        <Sky
          distance={450000}
          sunPosition={[100, 20, 100]}
          inclination={0.6}
          azimuth={0.25}
        />
      )}
    </>
  );
};

export default EnvironmentRenderer;
