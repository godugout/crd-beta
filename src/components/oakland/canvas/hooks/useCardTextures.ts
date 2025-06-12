
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { useState, useEffect } from 'react';

interface UseCardTexturesResult {
  cardTexture: THREE.Texture | null;
  backTexture: THREE.Texture | null;
  isLoading: boolean;
  error: string | null;
}

export const useCardTextures = (
  templateUrl: string, 
  backTextureUrl: string = '/lovable-uploads/f1b608ba-b8c6-40f5-b552-a5d7addbf4ae.png'
): UseCardTexturesResult => {
  const [cardTexture, setCardTexture] = useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let isCancelled = false;

    const loadTextures = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load front texture
        const frontTexture = await new Promise<THREE.Texture>((resolve, reject) => {
          loader.load(
            templateUrl,
            (texture) => {
              // Configure texture after loading
              texture.flipY = false;
              texture.wrapS = THREE.ClampToEdgeWrapping;
              texture.wrapT = THREE.ClampToEdgeWrapping;
              texture.needsUpdate = true;
              resolve(texture);
            },
            undefined,
            reject
          );
        });

        // Load back texture
        const backTex = await new Promise<THREE.Texture>((resolve, reject) => {
          loader.load(
            backTextureUrl,
            (texture) => {
              // Configure texture after loading
              texture.flipY = false;
              texture.wrapS = THREE.ClampToEdgeWrapping;
              texture.wrapT = THREE.ClampToEdgeWrapping;
              texture.needsUpdate = true;
              resolve(texture);
            },
            undefined,
            reject
          );
        });

        if (!isCancelled) {
          setCardTexture(frontTexture);
          setBackTexture(backTex);
          setIsLoading(false);
          console.log('Both textures loaded successfully');
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to load textures:', err);
          setError('Failed to load card textures');
          setIsLoading(false);
        }
      }
    };

    loadTextures();

    return () => {
      isCancelled = true;
    };
  }, [templateUrl, backTextureUrl]);

  return { cardTexture, backTexture, isLoading, error };
};
