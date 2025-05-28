
import React from 'react';
import { StadiumEnvironment } from './environments/StadiumEnvironment';
import { GalleryEnvironment } from './environments/GalleryEnvironment';
import { CosmicEnvironment } from './environments/CosmicEnvironment';
import { UnderwaterEnvironment } from './environments/UnderwaterEnvironment';
import { StudioEnvironment } from './environments/StudioEnvironment';
import { Environment } from '@react-three/drei';

interface EnvironmentRendererProps {
  environmentType: string;
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ environmentType }) => {
  console.log('EnvironmentRenderer: Rendering environment type:', environmentType);

  switch (environmentType) {
    case 'stadium':
      return <StadiumEnvironment />;
    
    case 'gallery':
      return <GalleryEnvironment />;
    
    case 'cardshop':
    case 'store':
    case 'mall':
      return (
        <>
          <Environment preset="warehouse" background={false} />
          <ambientLight intensity={0.8} color="#ffd700" />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <fog attach="fog" args={['#2a2a2a', 10, 50]} />
        </>
      );
    
    case 'cosmic':
      return <CosmicEnvironment />;
    
    case 'underwater':
      return <UnderwaterEnvironment />;
    
    default: // studio
      return <StudioEnvironment />;
  }
};

export default EnvironmentRenderer;
