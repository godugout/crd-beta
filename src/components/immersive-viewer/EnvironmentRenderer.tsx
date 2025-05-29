
import React, { useMemo } from 'react';
import { Environment, Sky } from '@react-three/drei';

interface EnvironmentRendererProps {
  environmentType: string;
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ environmentType }) => {
  // Map environment types to actual HDR environment presets
  const environmentConfig = useMemo(() => {
    switch (environmentType) {
      case 'studio':
        return {
          preset: 'studio',
          background: true,
          intensity: 1.0
        };
      
      case 'gallery':
        return {
          preset: 'warehouse',
          background: true,
          intensity: 0.8
        };
      
      case 'stadium':
        return {
          preset: 'park',
          background: true,
          intensity: 1.2
        };
      
      case 'twilight':
        return {
          preset: 'sunset',
          background: true,
          intensity: 0.7
        };
      
      case 'quarry':
        return {
          preset: 'dawn',
          background: true,
          intensity: 0.9
        };
      
      case 'coastline':
        return {
          preset: 'dawn',
          background: true,
          intensity: 1.1
        };
      
      case 'hillside':
        return {
          preset: 'forest',
          background: true,
          intensity: 0.8
        };
      
      case 'milkyway':
        return {
          preset: 'night',
          background: true,
          intensity: 0.4
        };
      
      case 'esplanade':
        return {
          preset: 'city',
          background: true,
          intensity: 1.0
        };
      
      case 'neonclub':
        return {
          preset: 'apartment',
          background: true,
          intensity: 0.6
        };
      
      case 'industrial':
        return {
          preset: 'warehouse',
          background: true,
          intensity: 0.7
        };
      
      default:
        return {
          preset: 'studio',
          background: true,
          intensity: 1.0
        };
    }
  }, [environmentType]);

  return (
    <>
      {/* Use HDR environment maps with correct props */}
      <Environment 
        preset={environmentConfig.preset as any}
        background={environmentConfig.background}
      />
      
      {/* Add ambient light to ensure proper illumination */}
      <ambientLight intensity={environmentConfig.intensity * 0.3} />
      
      {/* Special sky for certain environments */}
      {environmentType === 'twilight' && (
        <Sky
          distance={450000}
          sunPosition={[100, 20, 100]}
          inclination={0.6}
          azimuth={0.25}
        />
      )}
      
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
