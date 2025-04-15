
import React, { useState, useCallback, useRef } from 'react';
import CardInteraction from './CardInteraction';
import Card3DTransform from './Card3DTransform';
import CardFlip from './CardFlip';
import CardViewControls from './CardViewControls';
import ImmersiveBackground from './ImmersiveBackground';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CardInteractionDemoProps {
  className?: string;
}

const CardInteractionDemo: React.FC<CardInteractionDemoProps> = ({ className }) => {
  // State for controlling card interactions
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRotationLocked, setIsRotationLocked] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState<'modern' | 'vintage' | 'premium' | 'default'>('default');
  
  // Card container ref for taking screenshots
  const cardContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle card flipping
  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);
  
  // Reset card position and rotation
  const handleReset = useCallback(() => {
    setIsFlipped(false);
    // If we had a ref to the CardInteraction component, we could reset its position here
  }, []);
  
  // Toggle rotation lock
  const toggleRotationLock = useCallback(() => {
    setIsRotationLocked(prev => !prev);
  }, []);
  
  // Toggle auto-rotation
  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating(prev => !prev);
  }, []);
  
  // Take screenshot (simplified implementation)
  const takeScreenshot = useCallback(() => {
    // In a real implementation, you would use html2canvas or a similar library
    alert('Screenshot functionality would capture the current card state');
  }, []);
  
  // Share card (simplified implementation)
  const shareCard = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this baseball card!',
        text: 'I created this amazing baseball card with the Cardshow app!',
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing card:', err);
      });
    } else {
      alert('Sharing is not supported on this browser');
    }
  }, []);

  return (
    <div className={cn("card-interaction-demo", className)}>
      <ImmersiveBackground 
        theme={backgroundTheme} 
        intensity="medium" 
        className="p-8 min-h-[600px] rounded-xl"
      >
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              variant={backgroundTheme === 'default' ? "default" : "outline"} 
              size="sm"
              onClick={() => setBackgroundTheme('default')}
            >
              Default
            </Button>
            <Button 
              variant={backgroundTheme === 'modern' ? "default" : "outline"} 
              size="sm"
              onClick={() => setBackgroundTheme('modern')}
            >
              Modern
            </Button>
            <Button 
              variant={backgroundTheme === 'vintage' ? "default" : "outline"} 
              size="sm"
              onClick={() => setBackgroundTheme('vintage')}
            >
              Vintage
            </Button>
            <Button 
              variant={backgroundTheme === 'premium' ? "default" : "outline"} 
              size="sm"
              onClick={() => setBackgroundTheme('premium')}
            >
              Premium
            </Button>
          </div>
          
          <div 
            ref={cardContainerRef} 
            className="relative w-80 h-[448px] perspective-1000"
          >
            <CardFlip
              front={
                <Card3DTransform
                  disabled={isFlipped || isRotationLocked}
                  maxRotation={22}
                  bendFactor={0.1}
                  shadow={true}
                  className="w-full h-full"
                >
                  <CardInteraction
                    disabled={isFlipped || isRotationLocked || isAutoRotating}
                    onFlip={handleFlip}
                    maxRotation={15}
                    className="w-full h-full"
                  >
                    <div className="card-front w-full h-full rounded-xl overflow-hidden bg-white shadow-xl border-4 border-white">
                      <div className="relative h-full">
                        <img 
                          src="https://storage.googleapis.com/pai-images/6c54daa7570e4349a79659ecfca0f14c.jpeg" 
                          alt="Baseball Card Front" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <h3 className="text-white font-bold text-xl">Mickey Mantle</h3>
                          <p className="text-white/80 text-sm">New York Yankees • 1952</p>
                          <Badge className="mt-2 bg-amber-500">Hall of Fame</Badge>
                        </div>
                      </div>
                    </div>
                  </CardInteraction>
                </Card3DTransform>
              }
              back={
                <Card3DTransform
                  disabled={!isFlipped || isRotationLocked}
                  maxRotation={22}
                  bendFactor={0.1}
                  shadow={true}
                  className="w-full h-full"
                >
                  <CardInteraction
                    disabled={!isFlipped || isRotationLocked || isAutoRotating}
                    onFlip={handleFlip}
                    maxRotation={15}
                    className="w-full h-full"
                  >
                    <div className="card-back w-full h-full rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-xl border-4 border-white">
                      <div className="flex flex-col h-full">
                        <h3 className="font-bold text-lg text-center border-b border-gray-300 pb-2 mb-4">
                          Player Statistics
                        </h3>
                        
                        <div className="space-y-3 text-sm mb-auto">
                          <div className="flex justify-between">
                            <span className="font-medium">Position:</span>
                            <span>Center Field</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Batting Avg:</span>
                            <span>.298</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Home Runs:</span>
                            <span>536</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">RBI:</span>
                            <span>1,509</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Career:</span>
                            <span>1951-1968</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <p className="text-xs text-gray-600 italic">
                            "The Commerce Comet" is regarded as the greatest switch-hitter in baseball history. 
                            A 20-time All-Star and 7-time World Series champion.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardInteraction>
                </Card3DTransform>
              }
              isFlipped={isFlipped}
              onFlip={setIsFlipped}
              flipDirection="horizontal"
              enableSound={true}
              disableFlip={isRotationLocked && !isFlipped}
            />
          </div>
          
          <div className="mt-2">
            <CardViewControls
              onReset={handleReset}
              onToggleRotationLock={toggleRotationLock}
              onToggleAutoRotate={toggleAutoRotate}
              onScreenshot={takeScreenshot}
              onShare={shareCard}
              isRotationLocked={isRotationLocked}
              isAutoRotating={isAutoRotating}
              className="bg-white/30 backdrop-blur-sm p-2 rounded-lg"
            />
          </div>
          
          <div className="max-w-md text-center mt-4">
            <p className="text-sm text-gray-600 bg-white/50 backdrop-blur-sm p-3 rounded-lg">
              Interact with the card using your mouse or touch. Click to flip, drag to rotate, 
              and use the controls to lock rotation or take a screenshot.
            </p>
          </div>
        </div>
      </ImmersiveBackground>
    </div>
  );
};

export default CardInteractionDemo;
