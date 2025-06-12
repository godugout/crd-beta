
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface CardMaterialsProps {
  cardTexture: THREE.Texture;
  backTexture: THREE.Texture;
  cardFinish: 'matte' | 'glossy' | 'foil';
}

export const useCardMaterials = ({ cardTexture, backTexture, cardFinish }: CardMaterialsProps) => {
  // Ensure textures are properly configured
  useMemo(() => {
    if (cardTexture) {
      cardTexture.flipY = false;
      cardTexture.wrapS = THREE.ClampToEdgeWrapping;
      cardTexture.wrapT = THREE.ClampToEdgeWrapping;
      cardTexture.generateMipmaps = true;
      cardTexture.needsUpdate = true;
      console.log('Front texture configured:', cardTexture);
    }
    
    if (backTexture) {
      backTexture.flipY = false;
      backTexture.wrapS = THREE.ClampToEdgeWrapping;
      backTexture.wrapT = THREE.ClampToEdgeWrapping;
      backTexture.generateMipmaps = true;
      backTexture.needsUpdate = true;
      console.log('Back texture configured:', backTexture);
    }
  }, [cardTexture, backTexture]);

  // Create materials with proper texture display
  const frontMaterial = useMemo(() => {
    if (!cardTexture) return null;

    const baseProps = {
      map: cardTexture,
      side: THREE.FrontSide,
      transparent: false,
      alphaTest: 0.1,
    };

    switch (cardFinish) {
      case 'matte':
        return new THREE.MeshLambertMaterial({
          ...baseProps,
          color: '#ffffff',
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
          color: '#ffffff'
        });
    }
  }, [cardTexture, cardFinish]);

  const backMaterial = useMemo(() => {
    if (!backTexture) return null;

    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      metalness: 0.1,
      roughness: 0.4,
      envMapIntensity: 0.8,
      clearcoat: 0.6,
      clearcoatRoughness: 0.4,
      side: THREE.BackSide,
      color: '#ffffff'
    });
  }, [backTexture]);

  return { frontMaterial, backMaterial };
};
