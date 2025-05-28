
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const NeonGrid = () => {
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    return geometry;
  }, []);

  return (
    <mesh position={[0, -10, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
      <primitive object={gridGeometry} />
      <meshBasicMaterial 
        color="#00ffff" 
        wireframe={true} 
        opacity={0.3} 
        transparent={true}
      />
    </mesh>
  );
};

export const CyberpunkEnvironment = () => {
  return (
    <>
      {/* Dark cyberpunk background */}
      <color attach="background" args={['#0a0a1a']} />
      
      {/* Neon grid floor */}
      <NeonGrid />
      
      {/* Use built-in night environment */}
      <Environment 
        preset="night"
        background={false}
        blur={0.7}
      />
      
      {/* Cyberpunk ambient lighting */}
      <ambientLight intensity={0.2} color="#001133" />
      
      {/* Neon lighting setup */}
      <directionalLight 
        position={[20, 25, 20]} 
        intensity={1.5} 
        color="#00ffff"
        castShadow
      />
      <directionalLight 
        position={[-20, 25, 20]} 
        intensity={1.5} 
        color="#ff00ff"
        castShadow
      />
      <directionalLight 
        position={[0, 30, -25]} 
        intensity={1.0} 
        color="#ffff00"
      />
      
      {/* Cyberpunk neon spots */}
      <spotLight
        position={[30, 35, 30]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={2.5}
        color="#00ffff"
        castShadow
      />
      <spotLight
        position={[-30, 35, 30]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={2.5}
        color="#ff00ff"
        castShadow
      />
      
      {/* City neon glow */}
      <pointLight position={[40, 15, 0]} intensity={1.2} color="#00ffff" />
      <pointLight position={[-40, 15, 0]} intensity={1.2} color="#ff00ff" />
      <pointLight position={[0, 20, 50]} intensity={1.0} color="#ffff00" />
      <pointLight position={[0, 20, -50]} intensity={1.0} color="#ff4500" />
      
      {/* Scattered neon accents */}
      <pointLight position={[25, 8, 25]} intensity={0.6} color="#00ff00" />
      <pointLight position={[-25, 8, 25]} intensity={0.6} color="#ff1493" />
      <pointLight position={[25, 8, -25]} intensity={0.6} color="#1e90ff" />
      <pointLight position={[-25, 8, -25]} intensity={0.6} color="#ff6347" />
      
      {/* Cyberpunk atmosphere */}
      <fog attach="fog" args={['#0a0a1a', 80, 250]} />
    </>
  );
};
