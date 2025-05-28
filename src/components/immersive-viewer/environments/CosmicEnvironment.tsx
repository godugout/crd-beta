
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CosmicEnvironment = () => {
  const starFieldRef = useRef<THREE.Points>(null);
  const twinkleStarsRef = useRef<THREE.Points>(null);
  const cometRef = useRef<THREE.Group>(null);
  const blackHoleRef = useRef<THREE.Group>(null);
  const nebulaDustRef = useRef<THREE.Group>(null);
  
  const [cometVisible, setCometVisible] = useState(false);
  const [blackHoleVisible, setBlackHoleVisible] = useState(false);
  const [cometPosition, setCometPosition] = useState({ x: -200, y: 50, z: -100 });
  
  // Create star field geometry
  const createStarField = (count: number, spread: number) => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Random spherical distribution
      const radius = spread * Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Star colors - mostly white with some blue/yellow tints
      const starType = Math.random();
      if (starType < 0.7) {
        // White stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (starType < 0.85) {
        // Blue giants
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1;
      } else {
        // Red dwarfs
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0.6;
      }
    }
    
    return { positions, colors };
  };
  
  const starField = createStarField(15000, 800);
  const twinkleStars = createStarField(200, 400);
  
  // Comet appearance cycle
  useEffect(() => {
    const cometInterval = setInterval(() => {
      if (!cometVisible) {
        setCometVisible(true);
        setCometPosition({
          x: -200 + Math.random() * 100,
          y: -50 + Math.random() * 100,
          z: -100 - Math.random() * 50
        });
        setTimeout(() => setCometVisible(false), 8000);
      }
    }, 20000);
    
    return () => clearInterval(cometInterval);
  }, [cometVisible]);
  
  // Black hole appearance cycle
  useEffect(() => {
    const blackHoleInterval = setInterval(() => {
      if (!blackHoleVisible) {
        setBlackHoleVisible(true);
        setTimeout(() => setBlackHoleVisible(false), 12000);
      }
    }, 45000);
    
    return () => clearInterval(blackHoleInterval);
  }, [blackHoleVisible]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Slowly rotate star field
    if (starFieldRef.current) {
      starFieldRef.current.rotation.y += 0.0001;
      starFieldRef.current.rotation.x += 0.00005;
    }
    
    // Animate twinkling stars
    if (twinkleStarsRef.current && twinkleStarsRef.current.material) {
      const material = twinkleStarsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.3 + Math.sin(time * 2) * 0.3;
    }
    
    // Animate comet
    if (cometRef.current && cometVisible) {
      cometRef.current.position.x += 1.5;
      cometRef.current.position.y += Math.sin(time * 0.5) * 0.2;
      cometRef.current.rotation.z += 0.02;
      
      // Reset comet position when it goes off screen
      if (cometRef.current.position.x > 200) {
        setCometVisible(false);
      }
    }
    
    // Animate black hole
    if (blackHoleRef.current && blackHoleVisible) {
      blackHoleRef.current.rotation.z += 0.03;
      blackHoleRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.y += 0.01 + index * 0.005;
        }
      });
    }
    
    // Subtle nebula dust movement
    if (nebulaDustRef.current) {
      nebulaDustRef.current.rotation.y += 0.0002;
      nebulaDustRef.current.children.forEach((dust, index) => {
        dust.rotation.z += 0.0001 + index * 0.00005;
      });
    }
  });
  
  return (
    <>
      {/* Deep space black background */}
      <color attach="background" args={['#000000']} />
      
      {/* Main star field */}
      <points ref={starFieldRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={starField.positions}
            count={starField.positions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={starField.colors}
            count={starField.colors.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.5}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={false}
        />
      </points>
      
      {/* Twinkling bright stars */}
      <points ref={twinkleStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={twinkleStars.positions}
            count={twinkleStars.positions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={twinkleStars.colors}
            count={twinkleStars.colors.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={4}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation={false}
        />
      </points>
      
      {/* Occasional comet */}
      <group ref={cometRef} position={[cometPosition.x, cometPosition.y, cometPosition.z]} visible={cometVisible}>
        {/* Comet nucleus */}
        <mesh>
          <sphereGeometry args={[0.8, 8, 6]} />
          <meshBasicMaterial color="#cccccc" />
        </mesh>
        
        {/* Comet tail */}
        <mesh position={[-15, 0, 0]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[2, 30, 8]} />
          <meshBasicMaterial color="#4488ff" transparent opacity={0.3} />
        </mesh>
        
        {/* Dust tail */}
        <mesh position={[-10, -2, 0]} rotation={[0, 0, -0.1]}>
          <coneGeometry args={[1.5, 20, 6]} />
          <meshBasicMaterial color="#ffaa44" transparent opacity={0.2} />
        </mesh>
      </group>
      
      {/* Occasional black hole */}
      <group ref={blackHoleRef} position={[100, -50, -150]} visible={blackHoleVisible}>
        {/* Black hole center */}
        <mesh>
          <sphereGeometry args={[8, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        
        {/* Accretion disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[15, 3, 8, 32]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.4} />
        </mesh>
        
        {/* Outer glow */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[25, 5, 6, 24]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.15} />
        </mesh>
      </group>
      
      {/* Distant nebula dust clouds */}
      <group ref={nebulaDustRef}>
        <mesh position={[0, 0, -600]}>
          <sphereGeometry args={[200, 16, 16]} />
          <meshBasicMaterial color="#330066" transparent opacity={0.03} side={THREE.BackSide} />
        </mesh>
        
        <mesh position={[300, 150, -500]}>
          <sphereGeometry args={[80, 12, 12]} />
          <meshBasicMaterial color="#004466" transparent opacity={0.02} side={THREE.BackSide} />
        </mesh>
        
        <mesh position={[-250, -100, -450]}>
          <sphereGeometry args={[60, 10, 10]} />
          <meshBasicMaterial color="#440033" transparent opacity={0.025} side={THREE.BackSide} />
        </mesh>
      </group>
      
      {/* Minimal ambient lighting for depth */}
      <ambientLight intensity={0.02} color="#001122" />
      
      {/* Distant starlight */}
      <pointLight position={[500, 300, 200]} color="#ffffff" intensity={0.1} distance={1000} />
      <pointLight position={[-400, -200, 300]} color="#aaccff" intensity={0.08} distance={800} />
      <pointLight position={[200, -300, -400]} color="#ffccaa" intensity={0.06} distance={600} />
      
      {/* Space fog for depth */}
      <fog attach="fog" args={['#000011', 400, 1200]} />
    </>
  );
};
