
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
  
  const [blackHoleVisible, setBlackHoleVisible] = useState(false);
  const [blackHoleIntensity, setBlackHoleIntensity] = useState(0);
  
  // Load space station metal texture for the surface
  const spaceTexture = useLoader(TextureLoader, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1024&h=1024&fit=crop');
  
  // Black hole formation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBlackHoleVisible(true);
      
      // Fade in over 3 seconds, stay for 5 seconds, fade out over 3 seconds
      setTimeout(() => setBlackHoleVisible(false), 8000);
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animated nebula clouds
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.y += 0.0008;
      nebulaGroupRef.current.rotation.x += 0.0003;
      
      // Individual nebula rotations
      nebulaGroupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.y += (0.001 + index * 0.0002);
          child.rotation.z += (0.0005 + index * 0.0001);
        }
      });
    }
    
    // Animated star fields with different speeds
    if (starField1Ref.current) {
      starField1Ref.current.rotation.y += 0.0002;
    }
    if (starField2Ref.current) {
      starField2Ref.current.rotation.y -= 0.0001;
      starField2Ref.current.rotation.x += 0.00005;
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
        
        // Update black hole materials
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
      <Stars 
        ref={starField1Ref}
        radius={800} 
        depth={400} 
        count={8000} 
        factor={6} 
        saturation={0.9} 
        fade 
        speed={1}
      />
      <Stars 
        ref={starField2Ref}
        radius={600} 
        depth={300} 
        count={4000} 
        factor={4} 
        saturation={0.7} 
        fade 
        speed={0.5}
      />
      
      {/* Deep space ambient lighting */}
      <ambientLight intensity={0.05} color="#0a0a2a" />
      
      {/* Distant star lighting */}
      <pointLight position={[200, 150, 100]} color="#4a7fff" intensity={1.5} distance={500} />
      <pointLight position={[-150, -100, -200]} color="#ff4a7f" intensity={1.2} distance={400} />
      <pointLight position={[0, 300, -100]} color="#7fff4a" intensity={0.8} distance={600} />
      
      {/* Animated nebula group */}
      <group ref={nebulaGroupRef}>
        {/* Main purple nebula */}
        <mesh position={[0, 0, -400]}>
          <sphereGeometry args={[400, 32, 32]} />
          <meshBasicMaterial 
            color="#6a0dad" 
            transparent 
            opacity={0.12}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Pink nebula cloud */}
        <mesh position={[250, 120, -350]}>
          <sphereGeometry args={[120, 24, 24]} />
          <meshBasicMaterial 
            color="#ff1493" 
            transparent 
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Blue nebula cloud */}
        <mesh position={[-200, -80, -450]}>
          <sphereGeometry args={[90, 20, 20]} />
          <meshBasicMaterial 
            color="#00bfff" 
            transparent 
            opacity={0.06}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Green nebula wisps */}
        <mesh position={[150, -150, -300]}>
          <sphereGeometry args={[60, 16, 16]} />
          <meshBasicMaterial 
            color="#7fff00" 
            transparent 
            opacity={0.04}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Orange nebula */}
        <mesh position={[-100, 200, -380]}>
          <sphereGeometry args={[80, 18, 18]} />
          <meshBasicMaterial 
            color="#ff8c00" 
            transparent 
            opacity={0.05}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
      
      {/* Animated black hole */}
      <group ref={blackHoleRef} position={[150, -100, -200]} visible={blackHoleIntensity > 0}>
        {/* Event horizon */}
        <mesh>
          <sphereGeometry args={[15, 32, 32]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={blackHoleIntensity}
          />
        </mesh>
        
        {/* Accretion disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[25, 8, 16, 32]} />
          <meshBasicMaterial 
            color="#ff4500" 
            transparent 
            opacity={blackHoleIntensity * 0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Outer accretion ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[40, 5, 12, 24]} />
          <meshBasicMaterial 
            color="#ff6347" 
            transparent 
            opacity={blackHoleIntensity * 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Gravitational lensing effect */}
        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={blackHoleIntensity * 0.05}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
      
      {/* Space station platform surface */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          map={spaceTexture}
          color="#1a1a2e"
          roughness={0.7}
          metalness={0.8}
        />
      </mesh>
      
      {/* Deep space particles */}
      <pointLight position={[300, 50, 200]} color="#87ceeb" intensity={0.3} distance={200} />
      <pointLight position={[-250, 100, 150]} color="#dda0dd" intensity={0.4} distance={180} />
      <pointLight position={[0, -200, 300]} color="#98fb98" intensity={0.2} distance={250} />
      
      {/* Cosmic fog for depth */}
      <fog attach="fog" args={['#000011', 300, 1000]} />
    </>
  );
};
