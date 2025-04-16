
import React, { useRef, useEffect, useState } from 'react';
import { Card as IndexCard } from '@/lib/types';
import { Card as CardTypesCard } from '@/lib/types/cardTypes';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Card3DRenderer from './Card3DRenderer';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_DESIGN_METADATA, FALLBACK_IMAGE_URL } from '@/lib/utils/cardDefaults';
import { convertIndexCardToCardTypesCard } from '@/lib/adapters/typeAdapters';

interface ImmersiveCardViewerProps {
  card: IndexCard;
  isFlipped?: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
}

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  isFlipped = false,
  activeEffects,
  effectIntensities
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [processedCard, setProcessedCard] = useState<CardTypesCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert IndexCard to CardTypesCard and validate images
  useEffect(() => {
    const validateCardImages = async () => {
      setIsLoading(true);
      
      try {
        // Convert the index card to card types card
        const cardTypesCard = convertIndexCardToCardTypesCard(card);

        // Ensure we have valid image URL
        if (!cardTypesCard.imageUrl || cardTypesCard.imageUrl === 'undefined') {
          console.warn(`Card ${cardTypesCard.id} is missing an image URL, using fallback`);
          cardTypesCard.imageUrl = FALLBACK_IMAGE_URL;
          
          toast({
            title: "Using fallback image",
            description: "The original card image couldn't be loaded",
            variant: "default",
            duration: 3000
          });
        }
        
        // Also ensure we have a thumbnail URL
        if (!cardTypesCard.thumbnailUrl || cardTypesCard.thumbnailUrl === 'undefined') {
          cardTypesCard.thumbnailUrl = cardTypesCard.imageUrl || FALLBACK_IMAGE_URL;
        }

        // Set up imagePreload to validate that images actually load
        const image = new Image();
        image.onload = () => {
          console.log(`Image loaded successfully: ${cardTypesCard.imageUrl}`);
          setProcessedCard(cardTypesCard);
          setIsLoading(false);
        };
        image.onerror = () => {
          console.error(`Failed to load image: ${cardTypesCard.imageUrl}, using fallback`);
          cardTypesCard.imageUrl = FALLBACK_IMAGE_URL;
          cardTypesCard.thumbnailUrl = FALLBACK_IMAGE_URL;
          setProcessedCard(cardTypesCard);
          setIsLoading(false);
        };
        image.src = cardTypesCard.imageUrl;
        
      } catch (error) {
        console.error("Error during card processing:", error);
        // Create a minimal valid card with fallback image
        const fallbackCard = convertIndexCardToCardTypesCard({
          ...card,
          imageUrl: FALLBACK_IMAGE_URL,
          thumbnailUrl: FALLBACK_IMAGE_URL
        });
        setProcessedCard(fallbackCard);
        setIsLoading(false);
      }
    };
    
    validateCardImages();
  }, [card, toast]);
  
  if (isLoading || !processedCard) {
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
