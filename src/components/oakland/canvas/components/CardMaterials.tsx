import React, { useMemo } from 'react';
import * as THREE from 'three';

interface CardMaterialsProps {
  cardTexture: THREE.Texture;
  backTexture: THREE.Texture;
  cardFinish: 'matte' | 'glossy' | 'foil';
}

export const useCardMaterials = ({ cardTexture, backTexture, cardFinish }: CardMaterialsProps) => {
  // Create materials based on card finish - DON'T TINT THE BASE TEMPLATE
  const frontMaterial = useMemo(() => {
    const baseProps = {
      map: cardTexture,
      side: THREE.FrontSide,
    };

    switch (cardFinish) {
      case 'matte':
        return new THREE.MeshLambertMaterial({
          ...baseProps,
          // Don't tint the base template - let it show naturally
          color: '#ffffff'
        });
      
      case 'foil':
        return new THREE.MeshPhysicalMaterial({
          ...baseProps,
          metalness: 0.1,
          roughness: 0.3,
          envMapIntensity: 1.0,
          clearcoat: 0.4,
          clearcoatRoughness: 0.2,
          iridescence: 0.4,
          iridescenceIOR: 1.1,
          iridescenceThicknessRange: [100, 300],
          transmission: 0.05,
          opacity: 0.92,
          transparent: true,
          // Keep base template white, effects will add color
          color: '#ffffff'
        });
      
      case 'glossy':
      default:
        return new THREE.MeshPhysicalMaterial({
          ...baseProps,
          metalness: 0.02,
          roughness: 0.15,
          envMapIntensity: 0.8,
          clearcoat: 0.3,
          clearcoatRoughness: 0.2,
          reflectivity: 0.5,
          transparent: true,
          opacity: 0.98,
          // Keep base template white, effects will add color
          color: '#ffffff'
        });
    }
  }, [cardTexture, cardFinish]);

  const backMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      metalness: 0.1,
      roughness: 0.4,
      envMapIntensity: 0.8,
      clearcoat: 0.6,
      clearcoatRoughness: 0.4,
      side: THREE.BackSide,
    });
  }, [backTexture]);

  return { frontMaterial, backMaterial };
};
