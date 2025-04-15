
import { useMemo } from 'react';
import * as THREE from 'three';
import { cardVertexShader, cardFragmentShader } from '@/shaders/cardShader';
import { glowVertexShader, glowFragmentShader } from '@/shaders/glowShader';
import { edgeVertexShader, edgeFragmentShader } from '@/shaders/edgeShader';

export const useCardMaterials = (
  frontTexture: THREE.Texture,
  backTexture: THREE.Texture,
  isFlipped: boolean
) => {
  // Create shader material for the card faces
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

  // Create colored edge material
  const edgeMaterial = useMemo(() => {
    // Create a custom shader for the edges to make them more interesting
    if (edgeVertexShader && edgeFragmentShader) {
      return new THREE.ShaderMaterial({
        vertexShader: edgeVertexShader,
        fragmentShader: edgeFragmentShader,
        transparent: true,
        side: THREE.BackSide, // Use BackSide to make the edges visible around the card
        blending: THREE.NormalBlending,
        uniforms: {
          time: { value: 0 },
          baseColor: { value: new THREE.Color(0x9b87f5) } // Primary purple color
        }
      });
    }
    
    // Fallback to a simple material if shaders aren't available
    return new THREE.MeshStandardMaterial({
      color: 0x9b87f5, // Primary purple color
      metalness: 0.8,
      roughness: 0.2,
      side: THREE.BackSide, // Use BackSide to make the edges visible around the card
      transparent: true,
      opacity: 0.95 // Match the 95% transparency requirement
    });
  }, []);

  return { shaderMaterial, glowMaterial, edgeMaterial };
};
