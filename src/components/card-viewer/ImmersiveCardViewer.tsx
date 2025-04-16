
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Card3DRenderer from './Card3DRenderer';
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
  const [processedCard, setProcessedCard] = useState<Card>(card);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure we have valid image URLs before rendering
  useEffect(() => {
    const validateCardImages = async () => {
      setIsLoading(true);
      
      // Create a copy of the card to avoid modifying the original
      const cardCopy = { ...card };
      
      // Check if card has valid image URL
      if (!cardCopy.imageUrl) {
        console.warn(`Card ${cardCopy.id} is missing an image URL, using fallback`);
        cardCopy.imageUrl = getFallbackImageUrl(cardCopy.tags, cardCopy.title);
        
        toast({
          title: "Using fallback image",
          description: "The original card image couldn't be loaded",
          variant: "default",
          duration: 3000
        });
      }
      
      // Also ensure we have a thumbnail URL
      if (!cardCopy.thumbnailUrl) {
        cardCopy.thumbnailUrl = cardCopy.imageUrl;
      }
      
      // Update the processed card
      setProcessedCard(cardCopy);
      setIsLoading(false);
    };
    
    validateCardImages();
  }, [card, toast]);
  
  if (isLoading) {
    return (
      <div 
        className="w-full h-full min-h-[600px] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center"
      >
        <div className="text-white text-center">
          <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Preparing card viewer...</p>
        </div>
      </div>
    );
  }
  
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
          card={processedCard}
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
