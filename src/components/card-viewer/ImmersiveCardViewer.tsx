
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Card3DRenderer from './Card3DRenderer';
import { useToast } from '@/hooks/use-toast';
import { convertIndexCardToCardTypesCard } from '@/lib/adapters/typeAdapters';

// Define fallback constants
const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
const DEFAULT_DESIGN_METADATA = {
  cardStyle: {
    template: 'standard',
    effect: 'standard',
    borderRadius: '8px',
    borderColor: '#000000',
    shadowColor: '#000000',
    frameWidth: 5,
    frameColor: '#000000'
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333'
  },
  cardMetadata: {
    category: 'standard',
    series: 'default',
    cardType: 'standard'
  },
  marketMetadata: {
    isPrintable: true,
    isForSale: false,
    includeInCatalog: false
  }
};

interface ImmersiveCardViewerProps {
  card: Card;
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
  const [processedCard, setProcessedCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert IndexCard to CardTypesCard and validate images
  useEffect(() => {
    setIsLoading(true);
    
    try {
      // Make sure the card has the required properties
      const cardWithDefaults = {
        ...card,
        isPublic: card.isPublic !== false, // Default to true if not explicitly set to false
        effects: card.effects || [],
        rarity: card.rarity || 'common'
      };

      // Convert the card to compatible format for Card3DRenderer
      const convertedCard = convertIndexCardToCardTypesCard(cardWithDefaults);

      // Ensure we have valid image URL
      if (!convertedCard.imageUrl || convertedCard.imageUrl === 'undefined') {
        console.warn(`Card ${convertedCard.id} is missing an image URL, using fallback`);
        convertedCard.imageUrl = FALLBACK_IMAGE_URL;
        
        toast({
          title: "Using fallback image",
          description: "The original card image couldn't be loaded",
          variant: "default",
          duration: 3000
        });
      }
      
      // Also ensure we have a thumbnail URL
      if (!convertedCard.thumbnailUrl || convertedCard.thumbnailUrl === 'undefined') {
        convertedCard.thumbnailUrl = convertedCard.imageUrl || FALLBACK_IMAGE_URL;
      }

      // Set up imagePreload to validate that images actually load
      const image = new Image();
      image.onload = () => {
        console.log(`Image loaded successfully: ${convertedCard.imageUrl}`);
        setProcessedCard(convertedCard);
        setIsLoading(false);
      };
      image.onerror = () => {
        console.error(`Failed to load image: ${convertedCard.imageUrl}, using fallback`);
        convertedCard.imageUrl = FALLBACK_IMAGE_URL;
        convertedCard.thumbnailUrl = FALLBACK_IMAGE_URL;
        setProcessedCard(convertedCard);
        setIsLoading(false);
      };
      image.src = convertedCard.imageUrl;
      
    } catch (error) {
      console.error("Error during card processing:", error);
      // Create a minimal valid card with fallback image
      const fallbackCard = convertIndexCardToCardTypesCard({
        ...card,
        imageUrl: FALLBACK_IMAGE_URL,
        thumbnailUrl: FALLBACK_IMAGE_URL,
        isPublic: true,
        effects: [],
        rarity: 'common'
      });
      setProcessedCard(fallbackCard);
      setIsLoading(false);
    }
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
