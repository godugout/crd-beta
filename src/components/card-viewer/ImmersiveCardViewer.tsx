import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ImmersiveCardViewerProps {
  cardId: string;
}

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({ cardId }) => {
  const navigate = useNavigate();
  const [card, setCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  const [imageLoadAttempted, setImageLoadAttempted] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({
    Holographic: 0.7,
    Refractor: 0.8,
    Chrome: 0.6,
    Vintage: 0.5
  });

  // Default fallback image when card image fails to load
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

  // Load card data (mock implementation)
  useEffect(() => {
    // Mock card data loading
    const mockCardData = {
      id: cardId,
      title: 'Sample Card',
      description: 'This is a sample card for demonstration purposes.',
      imageUrl: 'https://placehold.co/600x400/orange/white?text=Sample+Card',
      tags: ['sample', 'card'],
      userId: 'system',
      effects: ['Holographic', 'Refractor'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: {
        cardStyle: {
          template: 'classic',
          effect: 'none',
          borderRadius: '8px',
          borderColor: '#000000',
          shadowColor: 'rgba(0,0,0,0.2)',
          frameWidth: 2,
          frameColor: '#000000'
        },
        textStyle: {
          titleColor: '#000000',
          titleAlignment: 'center',
          titleWeight: 'bold',
          descriptionColor: '#333333'
        },
        cardMetadata: {},
        marketMetadata: {}
      }
    } as Card;

    setCard(mockCardData);
    setActiveEffects(mockCardData.effects || []);
  }, [cardId]);

  // Apply effect CSS variables when effects change
  useEffect(() => {
    console.log("Active effects:", activeEffects);
    console.log("Effect intensities:", effectIntensities);

    // Set default CSS variables for all possible effects
    document.documentElement.style.setProperty('--holographic-active', '0');
    document.documentElement.style.setProperty('--refractor-active', '0');
    document.documentElement.style.setProperty('--chrome-active', '0');
    document.documentElement.style.setProperty('--vintage-active', '0');

    // Enable active effects
    activeEffects.forEach(effect => {
      const normalizedName = effect.toLowerCase();
      document.documentElement.style.setProperty(`--${normalizedName}-active`, '1');
      document.documentElement.style.setProperty(
        `--${normalizedName}-intensity`,
        (effectIntensities[effect] || 0.5).toString()
      );
    });
  }, [activeEffects, effectIntensities]);

  // Keyboard controls
  const handlePrevCard = () => {
    // Navigate to the previous card
    console.log('Previous card');
  };

  const handleNextCard = () => {
    // Navigate to the next card
    console.log('Next card');
  };

  useHotkeys('arrowleft', handlePrevCard);
  useHotkeys('arrowright', handleNextCard);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX - rotation.x, y: e.clientY - rotation.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setRotation({
        x: (e.clientX - startPosition.x) * 0.5,
        y: (e.clientY - startPosition.y) * 0.5,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageError = () => {
    console.log('Image failed to load:', card?.imageUrl);
    setImageError(true);
  };

  // Get the appropriate image URL with fallback mechanisms
  const getImageUrl = () => {
    const imageUrl = card?.imageUrl;

    // If we've already tried loading the image and got an error, use the fallback
    if (imageError || !imageUrl) {
      console.log('Using fallback image for card', card?.id);
      return fallbackImage;
    }

    return imageUrl;
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => {
    // Reset image error state when card changes
    setImageError(false);
    setImageLoadAttempted(false);
    console.log('Card changed, resetting image error state for card:', card?.id);
  }, [card?.id]);

  if (!card) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="relative w-full h-screen flex items-center justify-center"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <motion.div
        className={`card-container w-80 h-120 relative perspective-1000 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation.x}deg) rotateX(${rotation.y}deg)`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? 'back' : 'front'}
            className="absolute inset-0 w-full h-full backface-hidden"
            initial={{ rotateY: isFlipped ? 180 : 0 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            exit={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div
              className={`w-full h-full rounded-xl overflow-hidden shadow-xl card-with-lighting ${
                activeEffects.map(effect => `effect-${effect.toLowerCase()}`).join(' ')
              }`}
              style={{
                // Use camelCase for custom properties in React
                '--rotationX': `${rotation.x}deg`,
                '--rotationY': `${rotation.y}deg`,
              } as React.CSSProperties}
            >
              {/* Placeholder or loading state */}
              {!imageLoadAttempted && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
                </div>
              )}

              {/* The actual image with error handling */}
              <img
                src={getImageUrl()}
                alt={card.title || 'Card'}
                className="w-full h-full object-cover"
                onLoad={() => {
                  console.log('Image loaded successfully for card:', card?.id);
                  setImageLoadAttempted(true);
                }}
                onError={(e) => {
                  console.error('Image failed to load, trying fallback:', card?.id);
                  setImageLoadAttempted(true);
                  // If the current source isn't already the fallback, try the fallback
                  if ((e.target as HTMLImageElement).src !== fallbackImage) {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  } else {
                    handleImageError();
                  }
                }}
              />

              {/* Effect overlays - Always render but control visibility with CSS */}
              <div className="absolute inset-0 holographic-effect-overlay"
                style={{ opacity: activeEffects.includes('Holographic') ? (effectIntensities['Holographic'] || 0.5) : 0 }}
              />

              <div className="absolute inset-0 refractor-effect-overlay"
                style={{ opacity: activeEffects.includes('Refractor') ? (effectIntensities['Refractor'] || 0.5) : 0 }}
              />

              <div className="absolute inset-0 chrome-effect-overlay"
                style={{ opacity: activeEffects.includes('Chrome') ? (effectIntensities['Chrome'] || 0.5) : 0 }}
              />

              <div className="absolute inset-0 vintage-effect-overlay"
                style={{ opacity: activeEffects.includes('Vintage') ? (effectIntensities['Vintage'] || 0.5) : 0 }}
              />

              {/* Dynamic lighting overlay */}
              <div className="absolute inset-0 lighting-overlay"></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="absolute top-4 left-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2" />
          Back
        </Button>
      </div>
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button variant="ghost" onClick={handlePrevCard}>
          <ArrowRight className="mr-2" />
          Prev
        </Button>
        <Button variant="ghost" onClick={handleNextCard}>
          <ArrowLeft className="mr-2" />
          Next
        </Button>
      </div>
    </div>
  );
};

export default ImmersiveCardViewer;
