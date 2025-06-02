
import React, { useMemo, useEffect, useState } from 'react';
import { Environment } from '@react-three/drei';
import { hdrImageCache } from '@/services/hdr';
import * as THREE from 'three';

interface EnvironmentRendererProps {
  environmentType: string;
  lightingSettings?: {
    primaryLight: {
      intensity: number;
      color: string;
      x: number;
      y: number;
      z: number;
    };
    ambientLight: {
      intensity: number;
      color: string;
    };
    envMapIntensity: number;
    useDynamicLighting: boolean;
    followPointer: boolean;
    autoRotate: boolean;
  };
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ 
  environmentType, 
  lightingSettings 
}) => {
  const [hdrTexture, setHdrTexture] = useState<THREE.DataTexture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentResolution, setCurrentResolution] = useState<string>('1k');

  // Environment intensity configuration with lighting settings override
  const environmentConfig = useMemo(() => {
    const baseConfig = {
      studio: { intensity: 1.0, ambientIntensity: 0.3 },
      gallery: { intensity: 0.8, ambientIntensity: 0.3 },
      stadium: { intensity: 1.2, ambientIntensity: 0.3 },
      twilight: { intensity: 0.7, ambientIntensity: 0.3 },
      quarry: { intensity: 0.9, ambientIntensity: 0.3 },
      coastline: { intensity: 1.1, ambientIntensity: 0.3 },
      hillside: { intensity: 0.8, ambientIntensity: 0.3 },
      milkyway: { intensity: 0.4, ambientIntensity: 0.2 },
      esplanade: { intensity: 1.0, ambientIntensity: 0.3 },
      neonclub: { intensity: 0.6, ambientIntensity: 0.3 },
      industrial: { intensity: 0.7, ambientIntensity: 0.3 }
    };

    const config = baseConfig[environmentType as keyof typeof baseConfig] || baseConfig.studio;
    
    // Override with user lighting settings if provided
    if (lightingSettings) {
      return {
        intensity: lightingSettings.primaryLight.intensity,
        ambientIntensity: lightingSettings.ambientLight.intensity
      };
    }
    
    return config;
  }, [environmentType, lightingSettings]);

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
            const ext = gl.getExtension('EXT_texture_filter_anisotropic');
            if (ext) {
              const maxAnisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
              if (maxAnisotropy) {
                texture.anisotropy = Math.min(16, maxAnisotropy);
              }
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
          environmentIntensity={lightingSettings?.envMapIntensity || 1.0}
        />
      ) : (
        /* Fallback to basic drei presets */
        <Environment 
          preset={environmentType === 'milkyway' ? 'night' : 
                 environmentType === 'twilight' ? 'sunset' : 'studio'}
          background={true}
          environmentIntensity={lightingSettings?.envMapIntensity || 1.0}
        />
      )}
      
      {/* Primary directional light with user settings */}
      <directionalLight 
        intensity={environmentConfig.intensity} 
        position={[
          lightingSettings?.primaryLight.x || 10, 
          lightingSettings?.primaryLight.y || 10, 
          lightingSettings?.primaryLight.z || 5
        ]} 
        color={lightingSettings?.primaryLight.color || '#ffffff'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Ambient light with user settings */}
      <ambientLight 
        intensity={environmentConfig.ambientIntensity} 
        color={lightingSettings?.ambientLight.color || '#f0f0ff'}
      />
      
      {/* Additional fill light for better card visibility */}
      <pointLight 
        position={[-5, 5, 5]} 
        intensity={0.3} 
        color="#ffffff" 
      />
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <group userData={{ 
          environment: environmentType, 
          resolution: currentResolution,
          isLoading,
          hasTexture: !!hdrTexture,
          lightingOverride: !!lightingSettings
        }} />
      )}
    </>
  );
};

export default EnvironmentRenderer;
