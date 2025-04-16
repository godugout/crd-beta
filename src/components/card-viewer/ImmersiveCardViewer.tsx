
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Card3DRenderer from './Card3DRenderer';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

// Define a fallback image for cards with missing images
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

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
      
      // Create a deep copy of the card to avoid mutating the original
      const cardCopy: Card = JSON.parse(JSON.stringify(card));
      
      // Ensure designMetadata is always present with required fields
      if (!cardCopy.designMetadata || !cardCopy.designMetadata.cardStyle) {
        console.warn(`Card ${cardCopy.id} is missing designMetadata or cardStyle, using default values`);
        cardCopy.designMetadata = DEFAULT_DESIGN_METADATA;
      }
      
      // Check if card has valid image URL
      if (!cardCopy.imageUrl || cardCopy.imageUrl === 'undefined') {
        console.warn(`Card ${cardCopy.id} is missing an image URL, using fallback`);
        cardCopy.imageUrl = FALLBACK_IMAGE;
        
        toast({
          title: "Using fallback image",
          description: "The original card image couldn't be loaded",
          variant: "default",
          duration: 3000
        });
      }
      
      // Also ensure we have a thumbnail URL
      if (!cardCopy.thumbnailUrl || cardCopy.thumbnailUrl === 'undefined') {
        cardCopy.thumbnailUrl = cardCopy.imageUrl || FALLBACK_IMAGE;
      }
      
      // Ensure other required fields are present
      if (!cardCopy.effects) {
        cardCopy.effects = [];
      }
      
      // Set up imagePreload to validate that images actually load
      try {
        const image = new Image();
        image.onload = () => {
          console.log(`Image loaded successfully: ${cardCopy.imageUrl}`);
          setProcessedCard(cardCopy);
          setIsLoading(false);
        };
        image.onerror = () => {
          console.error(`Failed to load image: ${cardCopy.imageUrl}, using fallback`);
          cardCopy.imageUrl = FALLBACK_IMAGE;
          cardCopy.thumbnailUrl = FALLBACK_IMAGE;
          setProcessedCard(cardCopy);
          setIsLoading(false);
        };
        image.src = cardCopy.imageUrl;
      } catch (error) {
        console.error("Error during image validation:", error);
        cardCopy.imageUrl = FALLBACK_IMAGE;
        cardCopy.thumbnailUrl = FALLBACK_IMAGE;
        setProcessedCard(cardCopy);
        setIsLoading(false);
      }
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
