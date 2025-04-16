
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { useCardLighting } from '@/hooks/useCardLighting';

interface CardViewerProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  showLightingControls?: boolean;
}

const CardViewer: React.FC<CardViewerProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities,
  showLightingControls = false
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  const [imageLoadAttempted, setImageLoadAttempted] = useState(false);
  
  // Add lighting system
  const { 
    lightingSettings, 
    updateLightPosition
  } = useCardLighting('display_case');

  // Default fallback image when card image fails to load
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

  useKeyboardControls({
    onRotateLeft: () => setRotation(prev => ({ ...prev, x: prev.x - 5 })),
    onRotateRight: () => setRotation(prev => ({ ...prev, x: prev.x + 5 })),
    onRotateUp: () => setRotation(prev => ({ ...prev, y: prev.y - 5 })),
    onRotateDown: () => setRotation(prev => ({ ...prev, y: prev.y + 5 })),
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX - rotation.x, y: e.clientY - rotation.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update light position based on mouse position
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    updateLightPosition(x, y);

    // Handle dragging
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
    console.log('Image failed to load:', card.imageUrl);
    setImageError(true);
  };

  // Get the appropriate image URL with fallback mechanisms
  const getImageUrl = () => {
    const imageUrl = card?.imageUrl;
    
    // If we've already tried loading the image and got an error, use the fallback
    if (imageError || !imageUrl) {
      console.log('Using fallback image for card', card.id);
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
    console.log('Card changed, resetting image error state for card:', card.id);
  }, [card.id]);

  // Add lighting CSS variables to the root
  useEffect(() => {
    document.documentElement.style.setProperty('--light-x', `${lightingSettings.primaryLight.x}px`);
    document.documentElement.style.setProperty('--light-y', `${lightingSettings.primaryLight.y}px`);
    document.documentElement.style.setProperty('--light-z', `${lightingSettings.primaryLight.z}px`);
    document.documentElement.style.setProperty('--light-intensity', lightingSettings.primaryLight.intensity.toString());
    document.documentElement.style.setProperty('--light-color', lightingSettings.primaryLight.color);
    document.documentElement.style.setProperty('--ambient-intensity', lightingSettings.ambientLight.intensity.toString());
    document.documentElement.style.setProperty('--ambient-color', lightingSettings.ambientLight.color);
  }, [lightingSettings]);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
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
            <div className={`w-full h-full rounded-xl overflow-hidden shadow-xl card-with-lighting ${
              activeEffects.map(effect => `effect-${effect.toLowerCase()}`).join(' ')
            }`}>
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
                  console.log('Image loaded successfully for card:', card.id);
                  setImageLoadAttempted(true);
                }}
                onError={(e) => {
                  console.error('Image failed to load, trying fallback:', card.id);
                  setImageLoadAttempted(true);
                  // If the current source isn't already the fallback, try the fallback
                  if ((e.target as HTMLImageElement).src !== fallbackImage) {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  } else {
                    handleImageError();
                  }
                }}
              />
              
              {/* Effect overlays */}
              {activeEffects.map(effect => (
                <div
                  key={effect}
                  className={`absolute inset-0 effect-overlay-${effect.toLowerCase()}`}
                  style={{
                    opacity: effectIntensities[effect] || 0.5,
                  }}
                />
              ))}

              {/* Dynamic lighting overlay */}
              <div className="absolute inset-0 lighting-overlay"></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CardViewer;
