
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

export const useCardTextures = (templateUrl: string, backTextureUrl: string = '/lovable-uploads/f1b608ba-b8c6-40f5-b552-a5d7addbf4ae.png') => {
  // Load card textures with proper error handling
  const cardTexture = useLoader(
    TextureLoader, 
    templateUrl, 
    (texture) => {
      console.log('Template texture loaded successfully');
      texture.flipY = false;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    },
    (error) => {
      console.warn('Failed to load template texture:', error);
    }
  );
  
  const backTexture = useLoader(
    TextureLoader, 
    backTextureUrl,
    (texture) => {
      texture.flipY = false;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    },
    (error) => {
      console.warn('Failed to load back texture:', error);
    }
  );

  return { cardTexture, backTexture };
};
