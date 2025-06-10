
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Badge } from '@/components/ui/badge';
import Card3DRenderer from '@/components/card-viewer/Card3DRenderer';

interface Card3DPreviewProps {
  currentCard: any;
  selectedEnvironment: any;
  selectedTemplate: any;
  selectedStyle: string;
  autoRotate: boolean;
}

const LoadingFallback = () => (
  <mesh>
    <planeGeometry args={[2.5, 3.5]} />
    <meshStandardMaterial color="#333333" />
  </mesh>
);

export const Card3DPreview: React.FC<Card3DPreviewProps> = ({
  currentCard,
  selectedEnvironment,
  selectedTemplate,
  selectedStyle,
  autoRotate
}) => {
  return (
    <div className="flex-1 relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Environment preset={selectedEnvironment.preset as any} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Suspense fallback={<LoadingFallback />}>
          <Card3DRenderer 
            card={currentCard as any}
            isFlipped={false}
            activeEffects={currentCard.effects}
            effectIntensities={{}}
          />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          autoRotate={autoRotate}
          autoRotateSpeed={1}
        />
      </Canvas>
      
      {/* Style Badge - Moved outside Canvas */}
      <div className="absolute top-4 left-4 pointer-events-none z-10">
        <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
          {selectedStyle} • {selectedTemplate.name} • {selectedEnvironment.name}
        </Badge>
      </div>
    </div>
  );
};
