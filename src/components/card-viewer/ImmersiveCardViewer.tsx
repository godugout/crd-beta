
import React, { useRef, useEffect } from 'react';
import { Card } from '@/lib/types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Card3DRenderer from './Card3DRenderer';
import { useCardEffects } from '@/hooks/useCardEffects';

interface ImmersiveCardViewerProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
}

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div 
      ref={containerRef} 
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
