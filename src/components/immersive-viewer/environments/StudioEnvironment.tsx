
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const StudioEnvironment = () => {
  const equipmentRef = useRef<THREE.Group>(null);
  const lightsRef = useRef<THREE.Group>(null);
  
  // Create detailed concrete texture
  const createConcreteTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base concrete color
      ctx.fillStyle = '#e8e8e8';
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Add concrete variations
      for (let i = 0; i < 400; i++) {
        ctx.fillStyle = `rgba(${180 + Math.random() * 60}, ${180 + Math.random() * 60}, ${180 + Math.random() * 60}, 0.4)`;
        ctx.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 20, Math.random() * 20);
      }
      
      // Add crack lines
      ctx.strokeStyle = '#c0c0c0';
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
        ctx.lineTo(Math.random() * 1024, Math.random() * 1024);
        ctx.stroke();
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
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add wall texture
      for (let i = 0; i < 150; i++) {
        ctx.fillStyle = `rgba(${240 + Math.random() * 15}, ${240 + Math.random() * 15}, ${240 + Math.random() * 15}, 0.6)`;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 8, Math.random() * 8);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  const concreteTexture = createConcreteTexture();
  const wallTexture = createWallTexture();
  
  concreteTexture.wrapS = THREE.RepeatWrapping;
  concreteTexture.wrapT = THREE.RepeatWrapping;
  concreteTexture.repeat.set(8, 8);
  
  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(4, 4);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate equipment
    if (equipmentRef.current) {
      equipmentRef.current.children.forEach((item, index) => {
        if (item instanceof THREE.Group) {
          item.rotation.y += 0.0005 + index * 0.0001;
        }
      });
    }
    
    // Animate studio lights
    if (lightsRef.current) {
      lightsRef.current.children.forEach((light, index) => {
        if (light instanceof THREE.Object3D) {
          light.position.y = 25 + Math.sin(time + index) * 0.2;
        }
      });
    }
  });
  
  return (
    <>
      {/* Studio background */}
      <color attach="background" args={['#f0f0f0']} />
      
      {/* Studio walls */}
      <group>
        {/* Cyclorama backdrop */}
        <mesh position={[0, 20, -35]}>
          <cylinderGeometry args={[50, 50, 40, 32, 1, true, 0, Math.PI]} />
          <meshStandardMaterial map={wallTexture} color="#ffffff" side={THREE.BackSide} />
        </mesh>
        
        {/* Side walls */}
        <mesh position={[-35, 20, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[70, 40]} />
          <meshStandardMaterial map={wallTexture} color="#f8f8f8" />
        </mesh>
        
        <mesh position={[35, 20, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[70, 40]} />
          <meshStandardMaterial map={wallTexture} color="#f8f8f8" />
        </mesh>
        
        {/* Ceiling with lighting grid */}
        <mesh position={[0, 40, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[70, 70]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        
        {/* Lighting grid structure */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`grid-x-${i}`} position={[i * 8 - 28, 38, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 70, 8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`grid-z-${i}`} position={[0, 38, i * 8 - 28]}>
            <cylinderGeometry args={[0.1, 0.1, 70, 8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        ))}
      </group>
      
      {/* Studio equipment */}
      <group ref={equipmentRef}>
        {/* Camera tripod */}
        <group position={[15, 0, 25]}>
          {/* Tripod legs */}
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos(i * Math.PI * 2 / 3) * 2,
                6,
                Math.sin(i * Math.PI * 2 / 3) * 2
              ]}
              rotation={[0.2, i * Math.PI * 2 / 3, 0]}
            >
              <cylinderGeometry args={[0.1, 0.1, 12, 8]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          ))}
          
          {/* Camera */}
          <mesh position={[0, 12, 0]}>
            <boxGeometry args={[3, 2, 4]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
        </group>
        
        {/* Light stands */}
        {Array.from({ length: 4 }).map((_, i) => (
          <group
            key={i}
            position={[
              Math.cos(i * Math.PI / 2) * 25,
              0,
              Math.sin(i * Math.PI / 2) * 25
            ]}
          >
            {/* Stand pole */}
            <mesh position={[0, 12, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 24, 8]} />
              <meshStandardMaterial color="#666666" />
            </mesh>
            
            {/* Base */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[2, 2, 1, 8]} />
              <meshStandardMaterial color="#444444" />
            </mesh>
            
            {/* Light fixture */}
            <mesh position={[0, 20, 0]} rotation={[Math.PI / 6, i * Math.PI / 2, 0]}>
              <cylinderGeometry args={[2, 1, 3, 12]} />
              <meshStandardMaterial color="#888888" />
            </mesh>
          </group>
        ))}
        
        {/* Reflector boards */}
        {Array.from({ length: 2 }).map((_, i) => (
          <group key={i} position={[i === 0 ? -20 : 20, 8, 15]}>
            <mesh>
              <planeGeometry args={[8, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            
            {/* Stand */}
            <mesh position={[0, -8, -1]}>
              <cylinderGeometry args={[0.2, 0.2, 16, 8]} />
              <meshStandardMaterial color="#555555" />
            </mesh>
          </group>
        ))}
        
        {/* Equipment cart */}
        <group position={[-25, 0, -20]}>
          <mesh position={[0, 4, 0]}>
            <boxGeometry args={[6, 8, 4]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
          
          {/* Wheels */}
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                i % 2 === 0 ? -2.5 : 2.5,
                1,
                i < 2 ? -1.5 : 1.5
              ]}
            >
              <cylinderGeometry args={[0.5, 0.5, 0.3, 8]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          ))}
        </group>
      </group>
      
      {/* Studio lighting setup */}
      <group ref={lightsRef}>
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
        
        {/* Key lights from light stands */}
        {Array.from({ length: 4 }).map((_, i) => (
          <spotLight
            key={i}
            position={[
              Math.cos(i * Math.PI / 2) * 25,
              20,
              Math.sin(i * Math.PI / 2) * 25
            ]}
            target-position={[0, 0, 0]}
            angle={0.4}
            penumbra={0.3}
            intensity={1.8}
            color="#ffffff"
            castShadow
          />
        ))}
        
        {/* Hair/rim lights */}
        <pointLight position={[15, 10, -10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-15, 10, -10]} intensity={1.2} color="#f8f8ff" />
      </group>
      
      {/* Ambient studio lighting */}
      <ambientLight intensity={0.3} color="#f0f0ff" />
      
      {/* Detailed polished concrete studio floor */}
      <mesh position={[0, -6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial 
          map={concreteTexture}
          color="#e8e8e8" 
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
      
      {/* Floor tape marks */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={i}
          position={[i * 8 - 12, -5.9, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.2, 20]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
      ))}
      
      {/* Center mark */}
      <mesh position={[0, -5.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1, 1.2, 16]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    </>
  );
};
