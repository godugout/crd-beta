
import { useMemo } from 'react';
import * as THREE from 'three';
import { cardVertexShader, cardFragmentShader } from '@/shaders/cardShader';
import { glowVertexShader, glowFragmentShader } from '@/shaders/glowShader';

export const useCardMaterials = (
  frontTexture: THREE.Texture,
  backTexture: THREE.Texture,
  isFlipped: boolean
) => {
  // Create shader material for the card
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: cardVertexShader,
      fragmentShader: cardFragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        frontTexture: { value: frontTexture },
        backTexture: { value: backTexture },
        isFlipped: { value: isFlipped },
        time: { value: 0 }
      }
    });
  }, [frontTexture, backTexture, isFlipped]);

  // Create glow material for edges
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        time: { value: 0 },
        glowColor: { value: new THREE.Color(0x00ffff) }
      }
    });
  }, []);

  return { shaderMaterial, glowMaterial };
};
