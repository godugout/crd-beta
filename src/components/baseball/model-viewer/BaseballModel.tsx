
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ModelLoader from './ModelLoader';

interface BaseballModelProps {
  modelUrl?: string;
  scale?: number;
}

const BaseballModel: React.FC<BaseballModelProps> = ({ 
  modelUrl,
  scale = 1
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          {modelUrl ? (
            <ModelLoader url={modelUrl} scale={scale} />
          ) : (
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="gray" />
            </mesh>
          )}
        </Suspense>
        <OrbitControls 
          enablePan={false}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default BaseballModel;
