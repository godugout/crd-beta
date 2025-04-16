
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import Card3DRenderer from '@/components/card-viewer/Card3DRenderer';
import { toast } from 'sonner';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

interface ImmersiveCardViewerProps {
  card: Card;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
}

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  activeEffects = [],
  effectIntensities = {}
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div 
      className="w-full h-full min-h-[600px] bg-gray-900 rounded-lg overflow-hidden"
    >
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Card3DRenderer 
          card={card}
          isFlipped={isFlipped}
          activeEffects={activeEffects}
          effectIntensities={effectIntensities}
        />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default ImmersiveCardViewer;
