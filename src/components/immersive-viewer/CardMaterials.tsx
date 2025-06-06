
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
    console.log('Creating front material with effects:', activeEffects, 'intensities:', effectIntensities);
    
    // Get environment intensity from lighting settings
    const envMapIntensity = lightingSettings?.envMapIntensity || 1.0;
    
    const baseSettings = {
      map: frontTexture,
      roughness: materialSettings?.roughness || 0.2,
      metalness: materialSettings?.metalness || 0.8,
      envMapIntensity: envMapIntensity,
      ...materialSettings
    };

    // Get the primary active effect
    const primaryEffect = activeEffects[0] || 'holographic';
    const intensity = effectIntensities[primaryEffect] || 0.7;
    
    console.log('Applying effect:', primaryEffect, 'with intensity:', intensity);

    // Apply effect-specific material properties
    if (primaryEffect === 'holographic' || activeEffects.includes('holographic')) {
      console.log('Applying holographic effect');
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
        reflectivity: 0.9 * intensity,
      });
    }

    if (primaryEffect === 'premium_foil' || activeEffects.includes('premium_foil') || activeEffects.includes('foil')) {
      console.log('Applying premium foil effect');
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        metalness: 1.0 * intensity,
        roughness: 0.05 * (1 - intensity * 0.9),
        envMapIntensity: envMapIntensity * 2.5 * intensity,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 1.0 * intensity,
      });
    }

    if (primaryEffect === 'refractor' || activeEffects.includes('refractor')) {
      console.log('Applying refractor effect');
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        transmission: 0.1 * intensity,
        thickness: 0.5,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        envMapIntensity: envMapIntensity * 1.5,
        metalness: 0.6 * intensity,
        roughness: 0.1,
      });
    }

    if (primaryEffect === 'chrome' || activeEffects.includes('chrome')) {
      console.log('Applying chrome effect');
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: envMapIntensity * 3.0 * intensity,
        clearcoat: 1.0,
        reflectivity: 1.0,
      });
    }

    if (primaryEffect === 'vintage_classic' || primaryEffect === 'vintage' || activeEffects.includes('vintage')) {
      console.log('Applying vintage effect');
      return new THREE.MeshStandardMaterial({
        map: frontTexture,
        roughness: 0.8,
        metalness: 0.1,
        envMapIntensity: envMapIntensity * 0.3,
      });
    }

    if (primaryEffect === 'cosmic_rare' || primaryEffect === 'galaxy' || activeEffects.includes('galaxy')) {
      console.log('Applying cosmic/galaxy effect');
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        metalness: 0.8 * intensity,
        roughness: 0.1 * (1 - intensity * 0.7),
        envMapIntensity: envMapIntensity * 2.2 * intensity,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        iridescence: 0.8 * intensity,
        iridescenceIOR: 1.4,
        iridescenceThicknessRange: [200, 1000],
        reflectivity: 0.85 * intensity,
      });
    }

    // Default holographic material if no specific effect matched
    console.log('Applying default holographic material');
    return new THREE.MeshPhysicalMaterial({
      ...baseSettings,
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: envMapIntensity * 2.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      iridescence: 1.0,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 800],
    });
  }, [frontTexture, activeEffects, effectIntensities, materialSettings, lightingSettings]);

  const backMaterial = useMemo(() => {
    const envMapIntensity = lightingSettings?.envMapIntensity || 1.0;
    
    // Much darker background with strong character glow
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.1, // Very smooth for reflectivity
      metalness: 0.05, // Even lower metalness to preserve texture visibility
      envMapIntensity: envMapIntensity * 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.8,
      // Much stronger glow for character visibility with darker background
      emissive: new THREE.Color(0.02, 0.02, 0.04), // Subtle blue-tinted glow
      emissiveIntensity: 1.2, // Increased intensity for better character visibility
      // Much darker background adjustment
      color: new THREE.Color(0.2, 0.2, 0.2), // Even darker overall texture
      toneMapped: false, // Prevent tone mapping from affecting glow
    });
  }, [backTexture, lightingSettings]);

  return { frontMaterial, backMaterial };
};
