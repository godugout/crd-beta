
import React, { useMemo } from 'react';
import { Sky, Stars, Cloud, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface EnvironmentRendererProps {
  environmentType: string;
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ environmentType }) => {
  const environmentConfig = useMemo(() => {
    switch (environmentType) {
      case 'stadium':
        return {
          sky: { sunPosition: [0, 0.4, 1], turbidity: 10, rayleigh: 2 },
          stars: { radius: 200, depth: 50, count: 800, factor: 4 },
          fog: { near: 50, far: 200, color: '#1a1a2e' },
          ambient: '#4a90e2'
        };
      
      case 'gallery':
        return {
          sky: null,
          stars: null,
          fog: { near: 10, far: 50, color: '#f5f5f5' },
          ambient: '#ffffff',
          preset: 'city'
        };
      
      case 'cardshop':
        return {
          sky: null,
          stars: null,
          fog: { near: 5, far: 30, color: '#2a2a2a' },
          ambient: '#ffd700',
          preset: 'warehouse'
        };
      
      case 'store':
        return {
          sky: null,
          stars: null,
          fog: { near: 8, far: 40, color: '#e8e8e8' },
          ambient: '#ffffff',
          preset: 'apartment'
        };
      
      case 'mall':
        return {
          sky: null,
          stars: null,
          fog: { near: 15, far: 80, color: '#f0f0f0' },
          ambient: '#ffffff',
          preset: 'city'
        };
      
      case 'cosmic':
        return {
          sky: null,
          stars: { radius: 500, depth: 100, count: 2000, factor: 8, saturation: 0.5 },
          fog: { near: 100, far: 500, color: '#0a0a0a' },
          ambient: '#4a0e4e',
          nebula: true
        };
      
      case 'underwater':
        return {
          sky: null,
          stars: null,
          fog: { near: 5, far: 50, color: '#006994' },
          ambient: '#0080b3',
          caustics: true
        };
      
      default: // studio
        return {
          sky: { sunPosition: [0, 1, 0] },
          stars: { radius: 300, depth: 60, count: 1000, factor: 6 },
          fog: null,
          ambient: '#f0f0ff',
          preset: 'studio'
        };
    }
  }, [environmentType]);

  return (
    <>
      {/* Sky */}
      {environmentConfig.sky && (
        <Sky 
          sunPosition={environmentConfig.sky.sunPosition}
          turbidity={environmentConfig.sky.turbidity}
          rayleigh={environmentConfig.sky.rayleigh}
        />
      )}
      
      {/* Stars */}
      {environmentConfig.stars && (
        <Stars 
          radius={environmentConfig.stars.radius}
          depth={environmentConfig.stars.depth}
          count={environmentConfig.stars.count}
          factor={environmentConfig.stars.factor}
          saturation={environmentConfig.stars.saturation || 0}
          fade 
          speed={1}
        />
      )}
      
      {/* Environment preset */}
      {environmentConfig.preset && (
        <Environment preset={environmentConfig.preset} />
      )}
      
      {/* Fog */}
      {environmentConfig.fog && (
        <fog 
          attach="fog"
          args={[environmentConfig.fog.color, environmentConfig.fog.near, environmentConfig.fog.far]}
        />
      )}
      
      {/* Special effects for cosmic environment */}
      {environmentConfig.nebula && (
        <>
          <mesh position={[0, 0, -200]}>
            <sphereGeometry args={[100, 32, 16]} />
            <meshBasicMaterial 
              color="#4a0e4e" 
              transparent 
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
          <pointLight position={[50, 50, 50]} color="#ff00ff" intensity={0.5} />
          <pointLight position={[-50, -50, -50]} color="#00ffff" intensity={0.5} />
        </>
      )}
      
      {/* Underwater caustics effect */}
      {environmentConfig.caustics && (
        <>
          <mesh position={[0, 50, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[200, 200]} />
            <meshBasicMaterial 
              color="#006994" 
              transparent 
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight position={[0, 30, 0]} color="#00bfff" intensity={1} />
        </>
      )}
    </>
  );
};

export default EnvironmentRenderer;
