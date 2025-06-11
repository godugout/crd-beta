
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { OaklandCardTemplate } from '@/lib/data/oaklandCardTemplates';
import { LightingSettings } from '@/hooks/useCardLighting';

interface OaklandCard3DViewerProps {
  template: OaklandCardTemplate;
  title: string;
  subtitle: string;
  autoRotate?: boolean;
  environment?: string;
  lightingSettings?: LightingSettings;
  className?: string;
}

const Card3D: React.FC<{ template: OaklandCardTemplate; title: string; subtitle: string }> = ({ 
  template, 
  title, 
  subtitle 
}) => {
  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <boxGeometry args={[2.5, 3.5, 0.1]} />
      <meshStandardMaterial 
        color={template.category === 'protest' ? '#DC2626' : '#003831'} 
        roughness={0.3}
        metalness={0.1}
      />
      
      {/* Card face */}
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[2.4, 3.4]} />
        <meshStandardMaterial 
          color="#EFB21E" 
          opacity={0.9} 
          transparent
        />
      </mesh>
    </mesh>
  );
};

const OaklandCard3DViewer: React.FC<OaklandCard3DViewerProps> = ({
  template,
  title,
  subtitle,
  autoRotate = false,
  environment = 'studio',
  lightingSettings,
  className = ''
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
        
        {lightingSettings && (
          <>
            <ambientLight intensity={lightingSettings.ambientIntensity} />
            <directionalLight 
              position={lightingSettings.position} 
              intensity={lightingSettings.intensity}
              color={lightingSettings.color}
            />
          </>
        )}
        
        <Environment preset={environment as any} />
        <Card3D template={template} title={title} subtitle={subtitle} />
      </Canvas>
    </div>
  );
};

export default OaklandCard3DViewer;
