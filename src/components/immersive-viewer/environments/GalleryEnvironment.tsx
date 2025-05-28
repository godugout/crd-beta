
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const GalleryEnvironment = () => {
  const artworksRef = useRef<THREE.Group>(null);
  const lightsRef = useRef<THREE.Group>(null);
  
  // Create detailed marble texture
  const createMarbleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base marble color
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Add marble veining
      for (let i = 0; i < 50; i++) {
        ctx.strokeStyle = `rgba(${200 + Math.random() * 40}, ${200 + Math.random() * 40}, ${200 + Math.random() * 40}, 0.6)`;
        ctx.lineWidth = Math.random() * 6 + 2;
        ctx.beginPath();
        ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
        ctx.bezierCurveTo(
          Math.random() * 1024, Math.random() * 1024,
          Math.random() * 1024, Math.random() * 1024,
          Math.random() * 1024, Math.random() * 1024
        );
        ctx.stroke();
      }
      
      // Add subtle speckles
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(${180 + Math.random() * 60}, ${180 + Math.random() * 60}, ${180 + Math.random() * 60}, 0.3)`;
        ctx.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 3, Math.random() * 3);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  // Create wall texture
  const createWallTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add subtle texture
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(${240 + Math.random() * 15}, ${240 + Math.random() * 15}, ${240 + Math.random() * 15}, 0.5)`;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 5, Math.random() * 5);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  const marbleTexture = createMarbleTexture();
  const wallTexture = createWallTexture();
  
  marbleTexture.wrapS = THREE.RepeatWrapping;
  marbleTexture.wrapT = THREE.RepeatWrapping;
  marbleTexture.repeat.set(6, 6);
  
  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(4, 4);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Subtle gallery lighting animation
    if (lightsRef.current) {
      lightsRef.current.children.forEach((light, index) => {
        if (light instanceof THREE.Object3D) {
          light.position.y = 20 + Math.sin(time + index) * 0.1;
        }
      });
    }
  });
  
  return (
    <>
      {/* Gallery background */}
      <color attach="background" args={['#f5f5f5']} />
      
      {/* Gallery walls */}
      <group>
        {/* Front wall */}
        <mesh position={[0, 20, -80]}>
          <planeGeometry args={[160, 40]} />
          <meshStandardMaterial map={wallTexture} color="#fafafa" />
        </mesh>
        
        {/* Back wall */}
        <mesh position={[0, 20, 80]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[160, 40]} />
          <meshStandardMaterial map={wallTexture} color="#fafafa" />
        </mesh>
        
        {/* Left wall */}
        <mesh position={[-80, 20, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[160, 40]} />
          <meshStandardMaterial map={wallTexture} color="#fafafa" />
        </mesh>
        
        {/* Right wall */}
        <mesh position={[80, 20, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[160, 40]} />
          <meshStandardMaterial map={wallTexture} color="#fafafa" />
        </mesh>
        
        {/* Ceiling */}
        <mesh position={[0, 40, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[160, 160]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </group>
      
      {/* Gallery artworks and frames */}
      <group ref={artworksRef}>
        {/* Artwork frames on walls */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          const radius = 70;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <group key={i} position={[x, 15, z]} rotation={[0, -angle, 0]}>
              {/* Frame */}
              <mesh>
                <boxGeometry args={[12, 16, 0.5]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              
              {/* Artwork */}
              <mesh position={[0, 0, 0.3]}>
                <planeGeometry args={[10, 14]} />
                <meshStandardMaterial color={`hsl(${i * 45}, 60%, 70%)`} />
              </mesh>
              
              {/* Spotlight for each artwork */}
              <spotLight
                position={[0, 10, 5]}
                target-position={[0, 0, 0]}
                angle={0.3}
                penumbra={0.5}
                intensity={1.5}
                color="#ffffff"
                castShadow
              />
            </group>
          );
        })}
      </group>
      
      {/* Gallery columns */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            i % 2 === 0 ? -40 : 40,
            20,
            i < 2 ? -40 : 40
          ]}
        >
          <cylinderGeometry args={[2, 2, 40, 16]} />
          <meshStandardMaterial color="#e8e8e8" />
        </mesh>
      ))}
      
      {/* Gallery benches */}
      {Array.from({ length: 2 }).map((_, i) => (
        <group key={i} position={[0, 2, i === 0 ? -20 : 20]}>
          <mesh>
            <boxGeometry args={[20, 2, 4]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          {/* Bench legs */}
          {Array.from({ length: 4 }).map((_, j) => (
            <mesh
              key={j}
              position={[
                j % 2 === 0 ? -8 : 8,
                -2,
                j < 2 ? -1.5 : 1.5
              ]}
            >
              <cylinderGeometry args={[0.3, 0.3, 4, 8]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Information plaques */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            i % 2 === 0 ? -30 : 30,
            8,
            i < 2 ? -30 : 30
          ]}
          rotation={[0, i % 2 === 0 ? Math.PI / 4 : -Math.PI / 4, 0]}
        >
          <boxGeometry args={[6, 8, 0.2]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}
      
      {/* Professional gallery lighting */}
      <group ref={lightsRef}>
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
        
        {/* Track lighting */}
        {Array.from({ length: 6 }).map((_, i) => (
          <spotLight
            key={i}
            position={[i * 20 - 50, 35, 0]}
            angle={0.2}
            penumbra={0.3}
            intensity={1.2}
            color="#ffffff"
            target-position={[i * 20 - 50, 0, 0]}
          />
        ))}
      </group>
      
      {/* Ambient gallery lighting */}
      <ambientLight intensity={0.4} color="#f5f5f5" />
      
      {/* Detailed marble gallery floor */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial 
          map={marbleTexture}
          color="#f8f8f8" 
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>
      
      {/* Gallery entrance archway */}
      <group position={[0, 20, 75]}>
        <mesh>
          <torusGeometry args={[8, 2, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#e8e8e8" />
        </mesh>
        
        {/* Entrance pillars */}
        <mesh position={[-8, -10, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 20, 12]} />
          <meshStandardMaterial color="#e8e8e8" />
        </mesh>
        <mesh position={[8, -10, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 20, 12]} />
          <meshStandardMaterial color="#e8e8e8" />
        </mesh>
      </group>
    </>
  );
};
