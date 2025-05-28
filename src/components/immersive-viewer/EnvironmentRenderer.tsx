
import React, { useEffect, useState } from 'react';
import { Environment } from '@react-three/drei';
import { hdrImageCache } from '@/services/hdrImageCache';
import * as THREE from 'three';

interface EnvironmentRendererProps {
  environmentType: string;
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ environmentType }) => {
  const [hdrTexture, setHdrTexture] = useState<THREE.DataTexture | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('EnvironmentRenderer: Loading HDR environment for type:', environmentType);

  useEffect(() => {
    const loadEnvironment = async () => {
      setIsLoading(true);
      try {
        console.log(`EnvironmentRenderer: Loading HDR texture for ${environmentType}`);
        const texture = await hdrImageCache.getTexture(environmentType);
        
        if (texture) {
          console.log(`EnvironmentRenderer: Successfully loaded HDR texture for ${environmentType}`);
          setHdrTexture(texture);
        } else {
          console.warn(`EnvironmentRenderer: Failed to load HDR texture for ${environmentType}`);
        }
      } catch (error) {
        console.error(`EnvironmentRenderer: Error loading HDR texture for ${environmentType}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEnvironment();
  }, [environmentType]);

  // Show loading state
  if (isLoading || !hdrTexture) {
    return (
      <>
        {/* Basic lighting while loading */}
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow
        />
        {/* Use preset environment as fallback */}
        <Environment preset="city" background={false} />
      </>
    );
  }

  // Environment-specific lighting to complement the HDR background
  const getLighting = () => {
    switch (environmentType.toLowerCase()) {
      case 'stadium':
        return (
          <>
            <ambientLight intensity={0.6} color="#2a3a5a" />
            <directionalLight position={[25, 40, 25]} intensity={3.5} color="#ffffff" castShadow />
            <pointLight position={[50, 25, 0]} intensity={1.5} color="#ffffe0" />
          </>
        );
        
      case 'gallery':
        return (
          <>
            <ambientLight intensity={0.8} color="#f5f5f5" />
            <directionalLight position={[12, 20, 10]} intensity={2.8} color="#ffffff" castShadow />
            <spotLight position={[0, 30, 15]} intensity={3.5} color="#ffffff" castShadow />
          </>
        );
        
      case 'cosmic':
      case 'space':
        return (
          <>
            <ambientLight intensity={0.15} color="#001122" />
            <directionalLight position={[200, 100, 200]} intensity={0.6} color="#e6f3ff" />
            <pointLight position={[300, 150, 250]} color="#ffffff" intensity={0.4} />
          </>
        );
        
      case 'underwater':
      case 'ocean':
        return (
          <>
            <ambientLight intensity={0.4} color="#004466" />
            <directionalLight position={[20, 40, 15]} intensity={2.5} color="#4fc3f7" castShadow />
            <pointLight position={[40, 15, 0]} intensity={1.2} color="#00e5ff" />
          </>
        );
        
      case 'forest':
      case 'nature':
        return (
          <>
            <ambientLight intensity={0.5} color="#90a865" />
            <directionalLight position={[25, 40, 20]} intensity={3.2} color="#fff8dc" castShadow />
            <pointLight position={[35, 20, 0]} intensity={0.8} color="#90ee90" />
          </>
        );
        
      case 'nightsky':
      case 'night':
        return (
          <>
            <ambientLight intensity={0.4} color="#b3ccff" />
            <directionalLight position={[60, 100, 40]} intensity={2.5} color="#e6f3ff" castShadow />
            <spotLight position={[0, 120, 0]} intensity={2.8} color="#ffffff" castShadow />
          </>
        );
        
      case 'luxury':
      case 'lounge':
        return (
          <>
            <ambientLight intensity={0.7} color="#ffd700" />
            <directionalLight position={[15, 25, 20]} intensity={2.8} color="#fff8dc" castShadow />
            <spotLight position={[0, 35, 12]} intensity={3.8} color="#ffd700" castShadow />
          </>
        );
        
      case 'cyberpunk':
      case 'cyber':
      case 'neon':
        return (
          <>
            <ambientLight intensity={0.3} color="#001133" />
            <directionalLight position={[25, 35, 25]} intensity={2.2} color="#00ffff" castShadow />
            <pointLight position={[50, 20, 0]} intensity={1.8} color="#00ffff" />
            <pointLight position={[-50, 20, 0]} intensity={1.8} color="#ff00ff" />
          </>
        );
        
      case 'cardshop':
      case 'store':
      case 'mall':
      case 'retro':
        return (
          <>
            <ambientLight intensity={0.4} color="#330066" />
            <directionalLight position={[20, 30, 20]} intensity={2.0} color="#ff00ff" castShadow />
            <pointLight position={[40, 12, 0]} intensity={1.5} color="#ff0080" />
          </>
        );
        
      default: // studio
        return (
          <>
            <ambientLight intensity={0.6} color="#f0f0ff" />
            <directionalLight position={[12, 20, 15]} intensity={3.5} color="#ffffff" castShadow />
            <spotLight position={[18, 28, 20]} intensity={3.8} color="#ffffff" castShadow />
          </>
        );
    }
  };

  return (
    <>
      {/* HDR Environment Background */}
      <primitive object={hdrTexture} attach="background" />
      
      {/* Use HDR for environment lighting */}
      <Environment map={hdrTexture} background={false} />
      
      {/* Additional lighting to enhance the scene */}
      {getLighting()}
    </>
  );
};

export default EnvironmentRenderer;
