
import React from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

export const GalleryEnvironment = () => {
  // Create a procedural marble texture
  const createMarbleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base marble color
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add marble veining
      for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = `rgba(${200 + Math.random() * 40}, ${200 + Math.random() * 40}, ${200 + Math.random() * 40}, 0.6)`;
        ctx.lineWidth = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.bezierCurveTo(
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512
        );
        ctx.stroke();
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  const marbleTexture = createMarbleTexture();
  marbleTexture.wrapS = THREE.RepeatWrapping;
  marbleTexture.wrapT = THREE.RepeatWrapping;
  marbleTexture.repeat.set(3, 3);
  
  return (
    <>
      {/* Museum/Gallery environment */}
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/museum_of_ethnography_1k.hdr"
        background={true}
        blur={0.1}
      />
      
      {/* Professional gallery lighting */}
      <directionalLight 
        position={[10, 15, 8]} 
        intensity={2} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight 
        position={[-8, 12, 8]} 
        intensity={1.5} 
        color="#f8f8ff"
      />
      
      {/* Ambient gallery lighting */}
      <ambientLight intensity={0.4} color="#f5f5f5" />
      
      {/* Marble gallery floor */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          map={marbleTexture}
          color="#f8f8f8" 
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>
    </>
  );
};
