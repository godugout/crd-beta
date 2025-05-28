
import React, { useRef, useState, useEffect } from 'react';
import { Stars, Environment } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

export const CosmicEnvironment = () => {
  const nebulaGroupRef = useRef<THREE.Group>(null);
  const blackHoleRef = useRef<THREE.Group>(null);
  const starField1Ref = useRef<THREE.Points>(null);
  const starField2Ref = useRef<THREE.Points>(null);
  const asteroidFieldRef = useRef<THREE.Group>(null);
  const spaceStationRef = useRef<THREE.Group>(null);
  
  const [blackHoleVisible, setBlackHoleVisible] = useState(false);
  const [blackHoleIntensity, setBlackHoleIntensity] = useState(0);
  
  // Create procedural textures
  const createSpaceTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base metallic surface
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Add metallic patterns
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const size = Math.random() * 100 + 50;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, '#4a4a6a');
        gradient.addColorStop(0.5, '#2a2a4a');
        gradient.addColorStop(1, '#1a1a2e');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      }
      
      // Add panel lines
      ctx.strokeStyle = '#3a3a5a';
      ctx.lineWidth = 2;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 51.2);
        ctx.lineTo(1024, i * 51.2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(i * 51.2, 0);
        ctx.lineTo(i * 51.2, 1024);
        ctx.stroke();
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };

  const createAsteroidTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(0, 0, 256, 256);
      
      // Add rocky texture
      for (let i = 0; i < 500; i++) {
        const brightness = 60 + Math.random() * 80;
        ctx.fillStyle = `rgba(${brightness}, ${brightness * 0.8}, ${brightness * 0.6}, 0.8)`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 4, Math.random() * 4);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };

  const spaceTexture = createSpaceTexture();
  const asteroidTexture = createAsteroidTexture();
  
  spaceTexture.wrapS = THREE.RepeatWrapping;
  spaceTexture.wrapT = THREE.RepeatWrapping;
  spaceTexture.repeat.set(4, 4);
  
  // Black hole formation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBlackHoleVisible(true);
      setTimeout(() => setBlackHoleVisible(false), 8000);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animated nebula clouds
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.y += 0.0008;
      nebulaGroupRef.current.rotation.x += 0.0003;
      
      nebulaGroupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.y += (0.001 + index * 0.0002);
          child.rotation.z += (0.0005 + index * 0.0001);
        }
      });
    }
    
    // Animated star fields
    if (starField1Ref.current) {
      starField1Ref.current.rotation.y += 0.0002;
    }
    if (starField2Ref.current) {
      starField2Ref.current.rotation.y -= 0.0001;
      starField2Ref.current.rotation.x += 0.00005;
    }
    
    // Animate asteroids
    if (asteroidFieldRef.current) {
      asteroidFieldRef.current.children.forEach((asteroid, index) => {
        asteroid.rotation.x += 0.001 + index * 0.0001;
        asteroid.rotation.y += 0.0015 + index * 0.0002;
        asteroid.position.x += Math.sin(time + index) * 0.001;
        asteroid.position.z += Math.cos(time + index * 0.5) * 0.001;
      });
    }
    
    // Animate space station
    if (spaceStationRef.current) {
      spaceStationRef.current.rotation.y += 0.0005;
      spaceStationRef.current.position.y = Math.sin(time * 0.3) * 0.5;
    }
    
    // Black hole animation
    if (blackHoleRef.current) {
      if (blackHoleVisible && blackHoleIntensity < 1) {
        setBlackHoleIntensity(prev => Math.min(prev + 0.01, 1));
      } else if (!blackHoleVisible && blackHoleIntensity > 0) {
        setBlackHoleIntensity(prev => Math.max(prev - 0.01, 0));
      }
      
      if (blackHoleIntensity > 0) {
        blackHoleRef.current.rotation.z += 0.02;
        blackHoleRef.current.scale.setScalar(0.5 + blackHoleIntensity * 0.5);
        
        blackHoleRef.current.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh && child.material) {
            const material = child.material as THREE.MeshBasicMaterial;
            material.opacity = blackHoleIntensity * (index === 0 ? 1 : 0.7);
          }
        });
      }
    }
  });
  
  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#000008']} />
      
      {/* Enhanced multi-layer star fields */}
      <Stars ref={starField1Ref} radius={800} depth={400} count={8000} factor={6} saturation={0.9} fade speed={1} />
      <Stars ref={starField2Ref} radius={600} depth={300} count={4000} factor={4} saturation={0.7} fade speed={0.5} />
      
      {/* Deep space ambient lighting */}
      <ambientLight intensity={0.05} color="#0a0a2a" />
      
      {/* Distant star lighting */}
      <pointLight position={[200, 150, 100]} color="#4a7fff" intensity={1.5} distance={500} />
      <pointLight position={[-150, -100, -200]} color="#ff4a7f" intensity={1.2} distance={400} />
      <pointLight position={[0, 300, -100]} color="#7fff4a" intensity={0.8} distance={600} />
      
      {/* Detailed space station complex */}
      <group ref={spaceStationRef} position={[50, 20, -100]}>
        {/* Main station hull */}
        <mesh>
          <cylinderGeometry args={[15, 15, 40, 16]} />
          <meshStandardMaterial map={spaceTexture} metalness={0.8} roughness={0.3} />
        </mesh>
        
        {/* Rotating ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[25, 3, 8, 24]} />
          <meshStandardMaterial color="#2a4a6a" metalness={0.9} roughness={0.2} />
        </mesh>
        
        {/* Communication arrays */}
        <mesh position={[0, 25, 0]}>
          <coneGeometry args={[2, 8, 8]} />
          <meshStandardMaterial color="#4a6a8a" metalness={0.7} roughness={0.4} />
        </mesh>
        
        {/* Solar panels */}
        <mesh position={[30, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[20, 1, 8]} />
          <meshStandardMaterial color="#1a2a4a" metalness={0.3} roughness={0.1} />
        </mesh>
        <mesh position={[-30, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[20, 1, 8]} />
          <meshStandardMaterial color="#1a2a4a" metalness={0.3} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Asteroid field */}
      <group ref={asteroidFieldRef}>
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 400,
              (Math.random() - 0.5) * 200,
              -300 - Math.random() * 200
            ]}
            scale={Math.random() * 3 + 1}
          >
            <icosahedronGeometry args={[Math.random() * 5 + 2, 1]} />
            <meshStandardMaterial map={asteroidTexture} roughness={0.9} metalness={0.1} />
          </mesh>
        ))}
      </group>
      
      {/* Animated nebula group */}
      <group ref={nebulaGroupRef}>
        <mesh position={[0, 0, -400]}>
          <sphereGeometry args={[400, 32, 32]} />
          <meshBasicMaterial color="#6a0dad" transparent opacity={0.12} side={THREE.BackSide} />
        </mesh>
        
        <mesh position={[250, 120, -350]}>
          <sphereGeometry args={[120, 24, 24]} />
          <meshBasicMaterial color="#ff1493" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>
        
        <mesh position={[-200, -80, -450]}>
          <sphereGeometry args={[90, 20, 20]} />
          <meshBasicMaterial color="#00bfff" transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>
        
        <mesh position={[150, -150, -300]}>
          <sphereGeometry args={[60, 16, 16]} />
          <meshBasicMaterial color="#7fff00" transparent opacity={0.04} side={THREE.BackSide} />
        </mesh>
        
        <mesh position={[-100, 200, -380]}>
          <sphereGeometry args={[80, 18, 18]} />
          <meshBasicMaterial color="#ff8c00" transparent opacity={0.05} side={THREE.BackSide} />
        </mesh>
      </group>
      
      {/* Animated black hole */}
      <group ref={blackHoleRef} position={[150, -100, -200]} visible={blackHoleIntensity > 0}>
        <mesh>
          <sphereGeometry args={[15, 32, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={blackHoleIntensity} />
        </mesh>
        
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[25, 8, 16, 32]} />
          <meshBasicMaterial color="#ff4500" transparent opacity={blackHoleIntensity * 0.7} side={THREE.DoubleSide} />
        </mesh>
        
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[40, 5, 12, 24]} />
          <meshBasicMaterial color="#ff6347" transparent opacity={blackHoleIntensity * 0.4} side={THREE.DoubleSide} />
        </mesh>
        
        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={blackHoleIntensity * 0.05} side={THREE.BackSide} />
        </mesh>
      </group>
      
      {/* Detailed space platform surface */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial map={spaceTexture} color="#1a1a2e" roughness={0.7} metalness={0.8} />
      </mesh>
      
      {/* Additional platform details */}
      <group position={[0, -7.5, 0]}>
        {/* Platform support beams */}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 20, -2, Math.sin(i * Math.PI / 2) * 20]}>
            <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
            <meshStandardMaterial color="#2a2a4a" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        
        {/* Central platform hub */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[5, 5, 2, 16]} />
          <meshStandardMaterial map={spaceTexture} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Deep space particles */}
      <pointLight position={[300, 50, 200]} color="#87ceeb" intensity={0.3} distance={200} />
      <pointLight position={[-250, 100, 150]} color="#dda0dd" intensity={0.4} distance={180} />
      <pointLight position={[0, -200, 300]} color="#98fb98" intensity={0.2} distance={250} />
      
      {/* Cosmic fog for depth */}
      <fog attach="fog" args={['#000011', 300, 1000]} />
    </>
  );
};
