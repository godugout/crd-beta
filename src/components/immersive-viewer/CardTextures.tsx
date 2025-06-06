
import { useMemo } from 'react';
import * as THREE from 'three';
import { Card } from '@/lib/types';

interface CardTexturesProps {
  card: Card;
}

export const useCardTextures = ({ card }: CardTexturesProps) => {
  // Load textures with correct orientation
  const frontTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(card.imageUrl || '/images/card-placeholder.jpg');
    texture.flipY = true;
    return texture;
  }, [card.imageUrl]);

  const backTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/lovable-uploads/f1b608ba-b8c6-40f5-b552-a5d7addbf4ae.png');
    texture.flipY = true;
    return texture;
  }, []);

  return { frontTexture, backTexture };
};
