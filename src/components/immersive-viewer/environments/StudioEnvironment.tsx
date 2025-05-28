
import React from 'react';
import * as THREE from 'three';

export const StudioEnvironment = () => {
  // Create a procedural concrete texture
  const createConcreteTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base concrete color
      ctx.fillStyle = '#e8e8e8';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add some texture variation
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(${180 + Math.random() * 60}, ${180 + Math.random() * 60}, ${180 + Math.random() * 60}, 0.3)`;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 20, Math.random() * 20);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  const concreteTexture = createConcreteTexture();
  concreteTexture.wrapS = THREE.RepeatWrapping;
  concreteTexture.wrapT = THREE.RepeatWrapping;
  concreteTexture.repeat.set(4, 4);
  
  return (
    <>
      {/* Studio background */}
      <color attach="background" args={['#f0f0f0']} />
      
      {/* Studio backdrop */}
      <mesh position={[0, 0, -50]}>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial 
          color="#f8f8f8" 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Studio lighting setup */}
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={2.5} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill lights */}
      <directionalLight 
        position={[-8, 12, 8]} 
        intensity={1.2} 
        color="#f0f0ff"
      />
      <directionalLight 
        position={[0, 8, -15]} 
        intensity={0.8} 
        color="#fff5e0"
      />
      
      {/* Rim lighting */}
      <pointLight position={[15, 10, -10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-15, 10, -10]} intensity={1.2} color="#f8f8ff" />
      
      {/* Ambient studio lighting */}
      <ambientLight intensity={0.3} color="#f0f0ff" />
      
      {/* Polished concrete studio floor */}
      <mesh position={[0, -6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial 
          map={concreteTexture}
          color="#e8e8e8" 
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
    </>
  );
};
