
import { useMemo } from 'react';
import * as THREE from 'three';

interface CardMaterialsProps {
  frontTexture: THREE.Texture;
  backTexture: THREE.Texture;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  materialSettings: any;
  lightingSettings: any;
}

export const useCardMaterials = ({
  frontTexture,
  backTexture,
  activeEffects,
  effectIntensities,
  materialSettings,
  lightingSettings
}: CardMaterialsProps) => {
  // Create materials based on active effects and settings
  const frontMaterial = useMemo(() => {
    // Get environment intensity from lighting settings
    const envMapIntensity = lightingSettings?.envMapIntensity || 1.0;
    
    const baseSettings = {
      map: frontTexture,
      roughness: materialSettings?.roughness || 0.2,
      metalness: materialSettings?.metalness || 0.8,
      envMapIntensity: envMapIntensity,
      ...materialSettings
    };

    // Apply effect-specific material properties
    if (activeEffects.includes('holographic')) {
      const intensity = effectIntensities.holographic || 0.7;
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        metalness: 0.9 * intensity,
        roughness: 0.1 * (1 - intensity * 0.8),
        envMapIntensity: envMapIntensity * 2.0 * intensity,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        iridescence: 1.0 * intensity,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [100, 800],
      });
    }

    if (activeEffects.includes('refractor')) {
      const intensity = effectIntensities.refractor || 0.5;
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        transmission: 0.1 * intensity,
        thickness: 0.5,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        envMapIntensity: envMapIntensity,
      });
    }

    if (activeEffects.includes('chrome')) {
      const intensity = effectIntensities.chrome || 0.4;
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: envMapIntensity * 3.0 * intensity,
        clearcoat: 1.0,
      });
    }

    if (activeEffects.includes('vintage')) {
      return new THREE.MeshStandardMaterial({
        map: frontTexture,
        roughness: 0.8,
        metalness: 0.1,
        envMapIntensity: envMapIntensity * 0.3,
      });
    }

    return new THREE.MeshPhysicalMaterial(baseSettings);
  }, [frontTexture, activeEffects, effectIntensities, materialSettings, lightingSettings]);

  const backMaterial = useMemo(() => {
    const envMapIntensity = lightingSettings?.envMapIntensity || 1.0;
    
    // Enhanced material with darker background and glowing characters
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.1, // Very smooth for reflectivity
      metalness: 0.1, // Low metalness so texture remains visible
      envMapIntensity: envMapIntensity * 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.9,
      // Strong glow for character visibility with darker background
      emissive: new THREE.Color(0.05, 0.05, 0.08), // Very subtle blue-tinted glow
      emissiveIntensity: 0.8, // Strong emission for characters
      // Darker background adjustment
      color: new THREE.Color(0.7, 0.7, 0.7), // Darken the overall texture
      toneMapped: false, // Prevent tone mapping from affecting glow
    });
  }, [backTexture, lightingSettings]);

  return { frontMaterial, backMaterial };
};
