
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const StadiumEnvironment = () => {
  const stadiumRef = useRef<THREE.Group>(null);
  const crowdRef = useRef<THREE.Group>(null);
  const lightsRef = useRef<THREE.Group>(null);
  
  // Create detailed grass texture
  const createGrassTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base grass color
      ctx.fillStyle = '#1a4a1a';
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Add grass blade variations
      for (let i = 0; i < 2000; i++) {
        const green = Math.floor(60 + Math.random() * 80);
        ctx.fillStyle = `rgba(${Math.floor(green * 0.3)}, ${green}, ${Math.floor(green * 0.4)}, 0.8)`;
        ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1, Math.random() * 3 + 1);
      }
      
      // Add field lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      // Center line
      ctx.beginPath();
      ctx.moveTo(512, 0);
      ctx.lineTo(512, 1024);
      ctx.stroke();
      
      // Yard lines
      for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 102.4, 0);
        ctx.lineTo(i * 102.4, 1024);
        ctx.stroke();
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  // Create concrete texture for stadium structure
  const createConcreteTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#8a8a8a';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add concrete texture
      for (let i = 0; i < 300; i++) {
        ctx.fillStyle = `rgba(${120 + Math.random() * 60}, ${120 + Math.random() * 60}, ${120 + Math.random() * 60}, 0.5)`;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 10, Math.random() * 10);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  const grassTexture = createGrassTexture();
  const concreteTexture = createConcreteTexture();
  
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(50, 50);
  
  concreteTexture.wrapS = THREE.RepeatWrapping;
  concreteTexture.wrapT = THREE.RepeatWrapping;
  concreteTexture.repeat.set(8, 8);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate stadium lights
    if (lightsRef.current) {
      lightsRef.current.children.forEach((light, index) => {
        if (light instanceof THREE.Mesh) {
          light.rotation.y += 0.001 + index * 0.0001;
        }
      });
    }
    
    // Subtle crowd animation
    if (crowdRef.current) {
      crowdRef.current.children.forEach((section, index) => {
        section.position.y = Math.sin(time + index) * 0.1;
      });
    }
  });
  
  return (
    <>
      {/* Stadium sky background */}
      <color attach="background" args={['#2a3c5f']} />
      
      {/* Stadium bowl structure */}
      <group ref={stadiumRef}>
        {/* Lower bowl */}
        <mesh position={[0, 5, 0]}>
          <cylinderGeometry args={[120, 100, 20, 32, 1, true]} />
          <meshStandardMaterial map={concreteTexture} color="#6a6a6a" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Upper deck */}
        <mesh position={[0, 25, 0]}>
          <cylinderGeometry args={[140, 130, 15, 32, 1, true]} />
          <meshStandardMaterial map={concreteTexture} color="#5a5a5a" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Stadium roof structure */}
        <mesh position={[0, 40, 0]}>
          <cylinderGeometry args={[150, 145, 5, 32, 1, true]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
      
      {/* Crowd sections */}
      <group ref={crowdRef}>
        {Array.from({ length: 16 }).map((_, i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 16, 0]}>
            {/* Lower level crowd */}
            <mesh position={[0, 8, -110]}>
              <boxGeometry args={[15, 8, 3]} />
              <meshStandardMaterial color="#2a4a6a" />
            </mesh>
            
            {/* Upper level crowd */}
            <mesh position={[0, 28, -135]}>
              <boxGeometry args={[18, 10, 3]} />
              <meshStandardMaterial color="#1a3a5a" />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Stadium light towers */}
      <group ref={lightsRef}>
        {Array.from({ length: 4 }).map((_, i) => (
          <group key={i} position={[
            Math.cos(i * Math.PI / 2) * 160,
            45,
            Math.sin(i * Math.PI / 2) * 160
          ]}>
            {/* Light tower */}
            <mesh>
              <cylinderGeometry args={[2, 2, 60, 8]} />
              <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.3} />
            </mesh>
            
            {/* Light array */}
            <mesh position={[0, 25, 0]}>
              <boxGeometry args={[8, 4, 2]} />
              <meshStandardMaterial color="#ffff99" emissive="#ffff99" emissiveIntensity={0.3} />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Scoreboard */}
      <mesh position={[0, 35, -140]}>
        <boxGeometry args={[40, 15, 2]} />
        <meshStandardMaterial color="#000000" emissive="#0066cc" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Stadium lighting */}
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1.5} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 15, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, 25, -10]} intensity={1} color="#fff8dc" />
      
      {/* Stadium floodlights */}
      {Array.from({ length: 4 }).map((_, i) => (
        <spotLight
          key={i}
          position={[
            Math.cos(i * Math.PI / 2) * 160,
            70,
            Math.sin(i * Math.PI / 2) * 160
          ]}
          angle={0.3}
          penumbra={0.5}
          intensity={2}
          color="#ffffff"
          target-position={[0, 0, 0]}
          castShadow
        />
      ))}
      
      {/* Stadium atmosphere */}
      <fog attach="fog" args={['#2a3c5f', 80, 300]} />
      
      {/* Detailed stadium grass field */}
      <mesh position={[0, -15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshLambertMaterial map={grassTexture} color="#1a4a1a" />
      </mesh>
      
      {/* Field goal posts */}
      <group position={[0, 0, 140]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 20, 8]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
        <mesh position={[-9, 18, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 18, 8]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
        <mesh position={[9, 18, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 18, 8]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
        <mesh position={[0, 18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 18, 8]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
      </group>
      
      <group position={[0, 0, -140]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 20, 8]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
        <mesh position={[-9, 18, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 18, 8]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
        <mesh position={[9, 18, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 18, 8]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
        <mesh position={[0, 18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 18, 8]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
      </group>
    </>
  );
};
