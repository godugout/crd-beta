
import React, { useRef, useEffect } from 'react';
import { Card } from '@/lib/types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Card3DRenderer from './Card3DRenderer';
import { useCardEffects } from '@/hooks/useCardEffects';
import { useToast } from '@/hooks/use-toast';
import { getFallbackImageUrl } from '@/lib/utils/imageUtils';

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
  const { toast } = useToast();
  
  // Ensure we have valid image URLs before rendering
  useEffect(() => {
    const validateCardImages = () => {
      // Check if card has valid image URLs
      if (!card.imageUrl) {
        console.warn(`Card ${card.id} is missing an image URL, using fallback`);
        card.imageUrl = getFallbackImageUrl(card.tags, card.title);
        
        toast({
          title: "Using fallback image",
          description: "The original card image couldn't be loaded",
          variant: "default",
          duration: 3000
        });
      }
    };
    
    validateCardImages();
  }, [card, toast]);
  
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
