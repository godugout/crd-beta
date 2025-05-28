
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const UnderwaterEnvironment = () => {
  const causticsRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  const fishRef = useRef<THREE.Group>(null);
  const coralRef = useRef<THREE.Group>(null);
  const bubblesRef = useRef<THREE.Group>(null);
  
  // Create detailed sand texture
  const createSandTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base sand color
      ctx.fillStyle = '#c4a484';
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Add sand grain variations
      for (let i = 0; i < 3000; i++) {
        const brightness = 180 + Math.random() * 75;
        ctx.fillStyle = `rgba(${brightness}, ${brightness * 0.8}, ${brightness * 0.6}, 0.6)`;
        ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1, 1);
      }
      
      // Add ripple patterns
      for (let i = 0; i < 50; i++) {
        ctx.strokeStyle = `rgba(${200 + Math.random() * 40}, ${160 + Math.random() * 40}, ${120 + Math.random() * 40}, 0.3)`;
        ctx.lineWidth = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
        ctx.bezierCurveTo(
          Math.random() * 1024, Math.random() * 1024,
          Math.random() * 1024, Math.random() * 1024,
          Math.random() * 1024, Math.random() * 1024
        );
        ctx.stroke();
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  // Create coral texture
  const createCoralTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(0, 0, 256, 256);
      
      // Add coral texture
      for (let i = 0; i < 200; i++) {
        const red = 200 + Math.random() * 55;
        const green = 80 + Math.random() * 100;
        const blue = 80 + Math.random() * 100;
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.7)`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 4, Math.random() * 4);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  const sandTexture = createSandTexture();
  const coralTexture = createCoralTexture();
  
  sandTexture.wrapS = THREE.RepeatWrapping;
  sandTexture.wrapT = THREE.RepeatWrapping;
  sandTexture.repeat.set(40, 40);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animated caustics
    if (causticsRef.current) {
      causticsRef.current.position.y = 25 + Math.sin(time * 0.8) * 3;
      causticsRef.current.rotation.z = time * 0.15;
    }
    
    // Animated water surface
    if (waterRef.current && waterRef.current.material) {
      const material = waterRef.current.material as THREE.MeshPhysicalMaterial;
      if (material.opacity !== undefined) {
        material.opacity = 0.7 + Math.sin(time * 2) * 0.1;
      }
    }
    
    // Animated fish
    if (fishRef.current) {
      fishRef.current.children.forEach((fish, index) => {
        fish.position.x += Math.sin(time + index) * 0.02;
        fish.position.y += Math.cos(time + index * 0.5) * 0.01;
        fish.position.z += Math.sin(time * 0.7 + index) * 0.015;
        fish.rotation.y = Math.sin(time + index) * 0.3;
      });
    }
    
    // Animated coral
    if (coralRef.current) {
      coralRef.current.children.forEach((coral, index) => {
        coral.rotation.y += 0.001 + index * 0.0001;
        coral.position.y += Math.sin(time + index) * 0.002;
      });
    }
    
    // Animated bubbles
    if (bubblesRef.current) {
      bubblesRef.current.children.forEach((bubble, index) => {
        bubble.position.y += 0.05;
        if (bubble.position.y > 40) {
          bubble.position.y = -20;
          bubble.position.x = (Math.random() - 0.5) * 100;
          bubble.position.z = (Math.random() - 0.5) * 100;
        }
        bubble.rotation.x += 0.01;
        bubble.rotation.z += 0.005;
      });
    }
  });
  
  return (
    <>
      {/* Underwater gradient background */}
      <color attach="background" args={['#006994']} />
      
      {/* Underwater environment sphere */}
      <mesh position={[0, 0, -200]}>
        <sphereGeometry args={[300, 32, 32]} />
        <meshBasicMaterial 
          color="#004d6b" 
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Underwater lighting */}
      <ambientLight intensity={0.3} color="#0080b3" />
      <directionalLight 
        position={[0, 30, 0]} 
        intensity={2} 
        color="#00bfff"
        castShadow
      />
      
      {/* Animated caustics effects */}
      <group ref={causticsRef}>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 200, 32, 32]} />
          <meshBasicMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <mesh position={[50, 5, 50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100, 16, 16]} />
          <meshBasicMaterial 
            color="#40e0d0" 
            transparent 
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      
      {/* Water surface with animation */}
      <mesh 
        ref={waterRef} 
        position={[0, 40, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[400, 400, 64, 64]} />
        <meshPhysicalMaterial 
          color="#006994" 
          transparent 
          opacity={0.7}
          transmission={0.9}
          roughness={0.1}
          metalness={0.0}
          ior={1.33}
          thickness={10}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Coral reef */}
      <group ref={coralRef}>
        {Array.from({ length: 12 }).map((_, i) => (
          <group
            key={i}
            position={[
              (Math.random() - 0.5) * 80,
              -20 + Math.random() * 10,
              (Math.random() - 0.5) * 80
            ]}
          >
            {/* Coral structures */}
            <mesh scale={Math.random() * 2 + 1}>
              <coneGeometry args={[2, 8, 8]} />
              <meshStandardMaterial map={coralTexture} />
            </mesh>
            
            <mesh position={[2, 0, 1]} scale={Math.random() * 1.5 + 0.5}>
              <sphereGeometry args={[1.5, 8, 6]} />
              <meshStandardMaterial color="#ff8c69" />
            </mesh>
            
            <mesh position={[-1, 2, -1]} scale={Math.random() * 1.2 + 0.8}>
              <cylinderGeometry args={[0.5, 1, 6, 6]} />
              <meshStandardMaterial color="#ffa07a" />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Underwater plants */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 150,
            -15 + Math.random() * 20,
            (Math.random() - 0.5) * 150
          ]}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
          scale={Math.random() * 2 + 1}
        >
          <coneGeometry args={[0.5, 12, 4]} />
          <meshStandardMaterial color="#228b22" transparent opacity={0.8} />
        </mesh>
      ))}
      
      {/* Fish school */}
      <group ref={fishRef}>
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 100,
              Math.random() * 30 - 10,
              (Math.random() - 0.5) * 100
            ]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
            scale={0.5 + Math.random() * 0.5}
          >
            <boxGeometry args={[2, 0.5, 0.3]} />
            <meshStandardMaterial color={`hsl(${200 + Math.random() * 60}, 70%, 60%)`} />
          </mesh>
        ))}
      </group>
      
      {/* Bubble streams */}
      <group ref={bubblesRef}>
        {Array.from({ length: 30 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 100,
              Math.random() * 60 - 20,
              (Math.random() - 0.5) * 100
            ]}
            scale={Math.random() * 0.5 + 0.3}
          >
            <sphereGeometry args={[0.5, 8, 6]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
      
      {/* Underwater rocks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 120,
            -22 + Math.random() * 5,
            (Math.random() - 0.5) * 120
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
          scale={Math.random() * 3 + 2}
        >
          <dodecahedronGeometry args={[2]} />
          <meshStandardMaterial color="#696969" roughness={0.8} />
        </mesh>
      ))}
      
      {/* Detailed sandy ocean floor */}
      <mesh position={[0, -25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial 
          map={sandTexture}
          color="#c4a484" 
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
      
      {/* Underwater fog */}
      <fog attach="fog" args={['#004d6b', 30, 120]} />
      
      {/* Floating particle lights */}
      <pointLight position={[30, 5, 30]} color="#00ffaa" intensity={0.8} />
      <pointLight position={[-30, 10, -30]} color="#0088ff" intensity={0.6} />
      <pointLight position={[0, 15, -40]} color="#40e0d0" intensity={0.4} />
      
      {/* Bioluminescent effects */}
      {Array.from({ length: 10 }).map((_, i) => (
        <pointLight
          key={i}
          position={[
            (Math.random() - 0.5) * 80,
            Math.random() * 20 - 10,
            (Math.random() - 0.5) * 80
          ]}
          color="#00ffff"
          intensity={0.3}
          distance={10}
        />
      ))}
    </>
  );
};
