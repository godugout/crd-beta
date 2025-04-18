
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { LightingSettings } from '@/hooks/useCardLighting';

interface CardLightingProps {
  settings: LightingSettings;
  debug?: boolean;
}

export const CardLighting = ({ settings, debug = false }: CardLightingProps) => {
  const { scene } = useThree();
  const mainLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  
  // Update lights when settings change
  useEffect(() => {
    if (mainLightRef.current) {
      mainLightRef.current.position.set(
        settings.primaryLight.x,
        settings.primaryLight.y,
        settings.primaryLight.z
      );
      mainLightRef.current.intensity = settings.primaryLight.intensity;
      mainLightRef.current.color.set(settings.primaryLight.color);
    }
    
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = settings.ambientLight.intensity;
      ambientLightRef.current.color.set(settings.ambientLight.color);
    }
  }, [settings]);

  // Get environment path based on preset
  const getEnvironmentPath = () => {
    switch (settings.environmentType) {
      case 'studio':
        return '/environments/studio.hdr';
      case 'natural':
        return '/environments/natural.hdr';
      case 'dramatic':
        return '/environments/dramatic.hdr';
      case 'display_case':
        return '/environments/display_case.hdr';
      default:
        return '/environments/studio.hdr';
    }
  };
  
  // Optimization: Only show light helpers in debug mode
  const renderHelpers = () => {
    if (!debug) return null;
    
    return (
      <>
        <directionalLightHelper args={[mainLightRef.current as THREE.DirectionalLight]} />
      </>
    );
  };

  return (
    <>
      <directionalLight
        ref={mainLightRef}
        position={[settings.primaryLight.x, settings.primaryLight.y, settings.primaryLight.z]}
        intensity={settings.primaryLight.intensity}
        color={settings.primaryLight.color}
        castShadow={true}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      <ambientLight
        ref={ambientLightRef}
        intensity={settings.ambientLight.intensity}
        color={settings.ambientLight.color}
      />

      {/* Progressive enhancement - complex environment maps only on desktop */}
      <Environment
        files={getEnvironmentPath()}
        path=""
        preset={null}
        background={false}
        intensity={settings.envMapIntensity}
      />
      
      {renderHelpers()}
    </>
  );
};

export default CardLighting;
