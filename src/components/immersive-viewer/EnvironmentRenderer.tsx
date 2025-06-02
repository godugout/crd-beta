
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
  const [currentResolution, setCurrentResolution] = useState<string>('1k');

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

  // Load HDR texture using our enhanced cache service with adaptive resolution
  useEffect(() => {
    setIsLoading(true);
    setHdrTexture(null);
    setLoadError(null);

    const loadEnvironment = async () => {
      try {
        console.log(`EnvironmentRenderer: Loading adaptive resolution environment ${environmentType}`);
        
        const texture = await hdrImageCache.getTexture(environmentType);
        
        if (texture) {
          console.log(`EnvironmentRenderer: Successfully loaded HDR texture for ${environmentType}`);
          
          // Ensure texture is properly configured with enhanced filtering
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.needsUpdate = true;
          
          // Enhanced texture filtering for better quality
          texture.magFilter = THREE.LinearFilter;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.generateMipmaps = true;
          
          // Enable anisotropic filtering if supported
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
          if (gl) {
            const maxAnisotropy = gl.getParameter(gl.getExtension('EXT_texture_filter_anisotropic')?.MAX_TEXTURE_MAX_ANISOTROPY_EXT || gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            if (maxAnisotropy) {
              texture.anisotropy = Math.min(16, maxAnisotropy);
            }
          }
          
          setHdrTexture(texture);
          
          // Get stats to show current resolution
          const stats = hdrImageCache.getStats();
          setCurrentResolution(stats.optimalResolution);
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
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <group userData={{ 
          environment: environmentType, 
          resolution: currentResolution,
          isLoading,
          hasTexture: !!hdrTexture 
        }} />
      )}
    </>
  );
};

export default EnvironmentRenderer;
