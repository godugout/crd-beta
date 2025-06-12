
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

export const useCardTextures = (templateUrl: string, backTextureUrl: string = '/lovable-uploads/f1b608ba-b8c6-40f5-b552-a5d7addbf4ae.png') => {
  // Load card textures with proper error handling
  const cardTexture = useLoader(
    TextureLoader, 
    templateUrl, 
    (loader) => {
      console.log('Template texture loader initialized');
    },
    (error) => {
      console.warn('Failed to load template texture:', error);
    }
  );
  
  const backTexture = useLoader(
    TextureLoader, 
    backTextureUrl,
    (loader) => {
      console.log('Back texture loader initialized');
    },
    (error) => {
      console.warn('Failed to load back texture:', error);
    }
  );

  // Configure textures after loading
  if (cardTexture) {
    cardTexture.flipY = false;
    cardTexture.wrapS = THREE.ClampToEdgeWrapping;
    cardTexture.wrapT = THREE.ClampToEdgeWrapping;
  }

  if (backTexture) {
    backTexture.flipY = false;
    backTexture.wrapS = THREE.ClampToEdgeWrapping;
    backTexture.wrapT = THREE.ClampToEdgeWrapping;
  }

  return { cardTexture, backTexture };
};
