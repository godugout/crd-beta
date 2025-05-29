
import React, { useMemo } from 'react';
import { Environment, Sky } from '@react-three/drei';
import * as THREE from 'three';

interface EnvironmentRendererProps {
  environmentType: string;
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ environmentType }) => {
  // Enhanced environment configurations
  const environmentConfig = useMemo(() => {
    switch (environmentType) {
      case 'studio':
        return {
          background: '#f0f0f0',
          fog: { color: '#f0f0f0', near: 20, far: 100 },
          environment: 'studio'
        };
      
      case 'natural':
        return {
          background: '#87ceeb',
          fog: { color: '#87ceeb', near: 30, far: 200 },
          environment: 'park'
        };
      
      case 'dramatic':
        return {
          background: '#0d1421',
          fog: { color: '#0d1421', near: 10, far: 50 },
          environment: 'night'
        };
      
      case 'display_case':
      case 'gallery':
        return {
          background: '#ffffff',
          fog: { color: '#ffffff', near: 25, far: 150 },
          environment: 'warehouse'
        };
      
      case 'stadium':
        return {
          background: '#2e7d32',
          fog: { color: '#2e7d32', near: 40, far: 300 },
          environment: 'park'
        };
      
      case 'twilight':
        return {
          background: '#1a237e',
          fog: { color: '#1a237e', near: 15, far: 80 },
          environment: 'sunset'
        };
      
      case 'quarry':
        return {
          background: '#5d4037',
          fog: { color: '#5d4037', near: 20, far: 120 },
          environment: 'warehouse'
        };
      
      case 'coastline':
        return {
          background: '#006064',
          fog: { color: '#006064', near: 35, far: 250 },
          environment: 'dawn'
        };
      
      case 'hillside':
        return {
          background: '#2e7d32',
          fog: { color: '#2e7d32', near: 30, far: 200 },
          environment: 'forest'
        };
      
      case 'milkyway':
        return {
          background: '#0d0d1a',
          fog: { color: '#0d0d1a', near: 5, far: 30 },
          environment: 'night'
        };
      
      case 'esplanade':
        return {
          background: '#eeeeee',
          fog: { color: '#eeeeee', near: 25, far: 150 },
          environment: 'city'
        };
      
      case 'neonclub':
        return {
          background: '#1a0933',
          fog: { color: '#1a0933', near: 8, far: 40 },
          environment: 'apartment'
        };
      
      case 'industrial':
        return {
          background: '#263238',
          fog: { color: '#263238', near: 15, far: 80 },
          environment: 'warehouse'
        };
      
      default:
        return {
          background: '#f0f0f0',
          fog: { color: '#f0f0f0', near: 20, far: 100 },
          environment: 'studio'
        };
    }
  }, [environmentType]);

  return (
    <>
      {/* Background color */}
      <color attach="background" args={[environmentConfig.background]} />
      
      {/* Fog for atmospheric depth */}
      <fog 
        attach="fog" 
        args={[
          environmentConfig.fog.color, 
          environmentConfig.fog.near, 
          environmentConfig.fog.far
        ]} 
      />
      
      {/* Environment lighting */}
      <Environment preset={environmentConfig.environment as any} background={false} />
      
      {/* Special sky for certain environments */}
      {(environmentType === 'twilight' || environmentType === 'natural') && (
        <Sky
          distance={450000}
          sunPosition={environmentType === 'twilight' ? [100, 20, 100] : [100, 100, 100]}
          inclination={environmentType === 'twilight' ? 0.6 : 0.3}
          azimuth={0.25}
        />
      )}
      
      {/* Special stars for space environments */}
      {environmentType === 'milkyway' && (
        <StarField count={1000} />
      )}
    </>
  );
};

// Star field component for space environments
const StarField: React.FC<{ count: number }> = ({ count }) => {
  const stars = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    return positions;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={stars}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.5} 
        color="#ffffff" 
        sizeAttenuation={false}
        transparent
        opacity={0.8}
      />
    </points>
  );
};

export default EnvironmentRenderer;
