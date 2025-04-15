import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CardBase } from '@/components/card';
import { CardInteraction } from './CardInteraction';
import { Card3DTransform } from './Card3DTransform';
import { CardFlip } from './CardFlip';
import { CardViewControls } from './CardViewControls';
import { ImmersiveBackground } from './ImmersiveBackground';
import { toast } from 'sonner';

interface CardInteractionDemoProps {
  cardFront: React.ReactNode;
  cardBack: React.ReactNode;
  className?: string;
}

const CardInteractionDemo: React.FC<CardInteractionDemoProps> = ({
  cardFront,
  cardBack,
  className
}) => {
  // State for interactions
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRotationLocked, setIsRotationLocked] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [backgroundTheme, setBackgroundTheme] = useState<'modern' | 'vintage' | 'premium' | 'stadium' | 'custom'>('modern');
  
  // Refs
  const cardRef = useRef<HTMLDivElement>(null);
  const autoRotateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Handle flipping the card
  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
    toast.info(isFlipped ? 'Showing front side' : 'Showing back side');
  }, [isFlipped]);
  
  // Handle resetting position
  const handleReset = useCallback(() => {
    rotationRef.current = { x: 0, y: 0 };
    setZoomLevel(1);
    if (isFlipped) {
      setIsFlipped(false);
    }
    toast.success('Card position reset');
  }, [isFlipped]);
  
  // Handle zoom controls
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  }, []);
  
  // Handle rotation lock
  const handleToggleRotationLock = useCallback(() => {
    setIsRotationLocked(prev => !prev);
    toast.info(isRotationLocked ? 'Rotation unlocked' : 'Rotation locked');
  }, [isRotationLocked]);
  
  // Handle auto-rotate
  const handleToggleAutoRotate = useCallback(() => {
    setIsAutoRotating(prev => !prev);
    if (!isAutoRotating) {
      toast.info('Auto-rotation started');
    } else {
      toast.info('Auto-rotation stopped');
    }
  }, [isAutoRotating]);
  
  // Handle screenshot
  const handleScreenshot = useCallback(() => {
    // In a real implementation, this would use html2canvas or similar to capture the card
    console.log('Taking screenshot of card');
  }, []);
  
  // Handle share
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my baseball card!',
        text: 'I created this amazing baseball card on CardShow.',
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast.success('Link copied to clipboard');
        })
        .catch(err => {
          console.error('Error copying to clipboard:', err);
          toast.error('Failed to copy link');
        });
    }
  }, []);
  
  // Handle auto-rotation
  useEffect(() => {
    if (isAutoRotating && !isRotationLocked) {
      autoRotateIntervalRef.current = setInterval(() => {
        rotationRef.current = {
          x: rotationRef.current.x + 0.2,
          y: rotationRef.current.y + 0.3,
        };
        
        // Keep the rotation within bounds
        if (rotationRef.current.x > 15) rotationRef.current.x = -15;
        if (rotationRef.current.y > 15) rotationRef.current.y = -15;
        
        // In a real implementation, this would update the rotation state
      }, 50);
    } else if (autoRotateIntervalRef.current) {
      clearInterval(autoRotateIntervalRef.current);
      autoRotateIntervalRef.current = null;
    }
    
    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
      }
    };
  }, [isAutoRotating, isRotationLocked]);
  
  return (
    <div className="w-full h-full">
      <ImmersiveBackground
        theme={backgroundTheme}
        showThemeSelector={true}
        animationIntensity={0.8}
        className="w-full h-full rounded-lg overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
          <div 
            className="relative w-full max-w-xs md:max-w-sm aspect-[2.5/3.5]"
            style={{
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <CardInteraction
              disabled={isRotationLocked}
              onFlip={handleFlip}
              className="w-full h-full"
              damping={0.85}
              maxRotation={15}
            >
              <Card3DTransform
                rotateX={0}
                rotateY={0}
                lightIntensity={0.4}
                enableDeformation={true}
                shadowOpacity={0.3}
                className="w-full h-full"
              >
                <CardFlip
                  front={cardFront}
                  back={cardBack}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(prev => !prev)}
                  flipDirection="horizontal"
                  enableSound={true}
                  className="w-full h-full"
                />
              </Card3DTransform>
            </CardInteraction>
          </div>
          
          <div className="mt-6">
            <CardViewControls
              onReset={handleReset}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onToggleRotationLock={handleToggleRotationLock}
              onToggleAutoRotate={handleToggleAutoRotate}
              onScreenshot={handleScreenshot}
              onShare={handleShare}
              isRotationLocked={isRotationLocked}
              isAutoRotating={isAutoRotating}
              zoomLevel={zoomLevel}
              maxZoom={2.5}
              minZoom={0.5}
            />
          </div>
        </div>
      </ImmersiveBackground>
    </div>
  );
};

export default CardInteractionDemo;
