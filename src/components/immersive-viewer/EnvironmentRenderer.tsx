
import React, { useMemo } from 'react';
import { Environment, Sky } from '@react-three/drei';

interface EnvironmentRendererProps {
  environmentType: string;
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ environmentType }) => {
  // Map environment types to actual HDR file paths and configurations
  const environmentConfig = useMemo(() => {
    switch (environmentType) {
      case 'studio':
        return {
          files: '/environments/scenes/photo_studio.hdr',
          background: true,
          intensity: 1.0
        };
      
      case 'gallery':
        return {
          files: '/environments/scenes/art_gallery.hdr',
          background: true,
          intensity: 0.8
        };
      
      case 'stadium':
        return {
          files: '/environments/scenes/sports_stadium.hdr',
          background: true,
          intensity: 1.2
        };
      
      case 'twilight':
        return {
          files: '/environments/scenes/twilight_road.hdr',
          background: true,
          intensity: 0.7
        };
      
      case 'quarry':
        return {
          files: '/environments/scenes/stone_quarry.hdr',
          background: true,
          intensity: 0.9
        };
      
      case 'coastline':
        return {
          files: '/environments/scenes/ocean_coastline.hdr',
          background: true,
          intensity: 1.1
        };
      
      case 'hillside':
        return {
          files: '/environments/scenes/forest_hillside.hdr',
          background: true,
          intensity: 0.8
        };
      
      case 'milkyway':
        return {
          files: '/environments/scenes/starry_night.hdr',
          background: true,
          intensity: 0.4
        };
      
      case 'esplanade':
        return {
          files: '/environments/scenes/royal_esplanade.hdr',
          background: true,
          intensity: 1.0
        };
      
      case 'neonclub':
        return {
          files: '/environments/scenes/cyberpunk_neon.hdr',
          background: true,
          intensity: 0.6
        };
      
      case 'industrial':
        return {
          files: '/environments/scenes/industrial_workshop.hdr',
          background: true,
          intensity: 0.7
        };
      
      default:
        return {
          files: '/environments/scenes/photo_studio.hdr',
          background: true,
          intensity: 1.0
        };
    }
  }, [environmentType]);

  return (
    <>
      {/* Use HDR files - drei will handle fallbacks internally */}
      <Environment 
        files={environmentConfig.files}
        background={environmentConfig.background}
        preset={null}
      />
      
      {/* Add ambient light to ensure proper illumination */}
      <ambientLight intensity={environmentConfig.intensity * 0.3} />
      
      {/* Special sky for twilight environment as enhancement */}
      {environmentType === 'twilight' && (
        <Sky
          distance={450000}
          sunPosition={[100, 20, 100]}
          inclination={0.6}
          azimuth={0.25}
        />
      )}
      
      {/* Star field for space environments as enhancement */}
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
