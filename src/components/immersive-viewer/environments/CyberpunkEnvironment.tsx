
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const NeonGrid = () => {
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(300, 300, 60, 60);
    return geometry;
  }, []);

  return (
    <mesh position={[0, -15, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
      <primitive object={gridGeometry} />
      <meshBasicMaterial 
        color="#00ffff" 
        wireframe={true} 
        opacity={0.4} 
        transparent={true}
      />
    </mesh>
  );
};

export const CyberpunkEnvironment = () => {
  return (
    <>
      {/* Dark cyberpunk background */
      <color attach="background" args={['#0a0a1a']} />
      
      {/* Neon grid floor */}
      <NeonGrid />
      
      {/* Use built-in night environment with city vibes */}
      <Environment 
        preset="night"
        background={true}
        blur={0.6}
      />
      
      {/* Cyberpunk ambient lighting */}
      <ambientLight intensity={0.3} color="#001133" />
      
      {/* Neon lighting setup */}
      <directionalLight 
        position={[25, 35, 25]} 
        intensity={2.2} 
        color="#00ffff"
        castShadow
      />
      <directionalLight 
        position={[-25, 35, 25]} 
        intensity={2.2} 
        color="#ff00ff"
        castShadow
      />
      <directionalLight 
        position={[0, 40, -30]} 
        intensity={1.8} 
        color="#ffff00"
      />
      
      {/* Cyberpunk neon spots */}
      <spotLight
        position={[40, 45, 40]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.7}
        intensity={3.5}
        color="#00ffff"
        castShadow
      />
      <spotLight
        position={[-40, 45, 40]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.7}
        intensity={3.5}
        color="#ff00ff"
        castShadow
      />
      
      {/* City neon glow */}
      <pointLight position={[50, 20, 0]} intensity={1.8} color="#00ffff" />
      <pointLight position={[-50, 20, 0]} intensity={1.8} color="#ff00ff" />
      <pointLight position={[0, 25, 60]} intensity={1.5} color="#ffff00" />
      <pointLight position={[0, 25, -60]} intensity={1.5} color="#ff4500" />
      
      {/* Scattered neon accents */}
      <pointLight position={[35, 12, 35]} intensity={1.0} color="#00ff00" />
      <pointLight position={[-35, 12, 35]} intensity={1.0} color="#ff1493" />
      <pointLight position={[35, 12, -35]} intensity={1.0} color="#1e90ff" />
      <pointLight position={[-35, 12, -35]} intensity={1.0} color="#ff6347" />
    </>
  );
};
