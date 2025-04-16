
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { useAdvancedGestures } from '@/hooks/useAdvancedGestures';
import CardParticleSystem from '@/components/particles/CardParticleSystem';
import { useParticleEffects } from '@/hooks/useParticleEffects';
import GestureTutorial from '@/components/tutorials/GestureTutorial';
import { toast } from 'sonner';
import { useBrandTheme } from '@/context/BrandThemeContext';

interface CardDisplayProps {
  card: Card;
  rotation: { x: number; y: number; z: number };
  isFlipped: boolean;
  zoom: number;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  cardRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isAutoRotating: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  mousePosition: { x: number; y: number };
  touchImprintAreas: Array<{ id: string; active: boolean }>;
  showExplodedView: boolean;
  lightingSettings?: any;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  rotation,
  isFlipped,
  zoom,
  isDragging,
  setIsDragging,
  cardRef,
  containerRef,
  isAutoRotating,
  activeEffects,
  effectIntensities,
  mousePosition,
  touchImprintAreas,
  showExplodedView,
  lightingSettings
}) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const { currentTheme } = useBrandTheme();

  // Setup particle effects for the card
  const {
    particleState,
    toggleEffect,
    toggleSystem
  } = useParticleEffects({
    card,
    shouldAutoDetectCardType: true
  });

  // Initialize advanced gesture handling
  const {
    scale: gestureScale,
    rotation: gestureRotation,
    position: gesturePosition,
    isGesturing,
    activeGesture,
    requestDeviceMotionPermission,
    resetGestures
  } = useAdvancedGestures({
    containerRef,
    onShowTutorial: () => setShowTutorial(true)
  });
  
  // Apply gesture-based transformations
  const combinedRotation = {
    x: rotation.x + gestureRotation.x,
    y: rotation.y + gestureRotation.y,
    z: gestureRotation.z
  };

  const combinedZoom = zoom * gestureScale;
  
  // Handle edge swipe gestures for flipping the card
  useEffect(() => {
    if (activeGesture === 'edge-swipe-left' || activeGesture === 'edge-swipe-right') {
      // Simulate card flip on edge swipe
      toast.info("Card flip gesture detected!");
      // Note: In a real implementation, we would call the flip card function here
    }
  }, [activeGesture]);
  
  // Request permission for device motion API
  useEffect(() => {
    const hasAskedPermission = localStorage.getItem('cardShowDeviceMotionAsked');
    
    if (!hasAskedPermission && 'DeviceMotionEvent' in window) {
      setTimeout(() => {
        requestDeviceMotionPermission();
        localStorage.setItem('cardShowDeviceMotionAsked', 'true');
      }, 2000);
    }
  }, [requestDeviceMotionPermission]);

  // Calculate total movement to activate particle effects
  const totalMovement = Math.abs(combinedRotation.x) + Math.abs(combinedRotation.y) + Math.abs(combinedRotation.z);
  
  return (
    <div 
      className="card-display relative flex items-center justify-center"
      style={{ 
        perspective: '1200px',
        width: '100%',
        height: '100%'
      }}
    >
      <div 
        ref={cardRef}
        className={`card-display-inner ${isFlipped ? 'flipped' : ''} ${isAutoRotating ? 'auto-rotating' : ''}`}
        style={{
          position: 'relative',
          width: '350px',
          height: '490px',
          transition: isDragging || isGesturing ? 'none' : 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
          transform: `
            scale(${combinedZoom})
            translate3d(${gesturePosition.x}px, ${gesturePosition.y}px, 0px)
            rotateX(${combinedRotation.x}deg) 
            rotateY(${combinedRotation.y}deg)
            rotateZ(${combinedRotation.z}deg)
            ${isFlipped ? 'rotateY(180deg)' : ''}
          `,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Card Front */}
        <div 
          className={`card-face card-front absolute w-full h-full rounded-xl overflow-hidden card-spotlight ${activeEffects.join(' ')}`}
          style={{
            backfaceVisibility: 'hidden',
            backgroundColor: currentTheme.cardBackgroundColor,
            boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 15px ${currentTheme.accentColor}40`,
            border: `1px solid ${currentTheme.accentColor}30`,
          }}
        >
          {/* Card Front Content */}
          <img 
            src={card.imageUrl || 'https://via.placeholder.com/350x490?text=Card+Front'}
            alt={card.title || 'Card Front'}
            className="w-full h-full object-cover"
            style={{
              opacity: 0.95
            }}
          />
          
          {/* Apply lighting effects */}
          {lightingSettings && (
            <div 
              className={`lighting-overlay environment-${lightingSettings.environmentType}`}
              style={{
                '--light-x': `${lightingSettings.primaryLight.x}px`,
                '--light-y': `${lightingSettings.primaryLight.y}px`,
                '--light-z': `${lightingSettings.primaryLight.z}px`,
                '--light-intensity': lightingSettings.primaryLight.intensity,
                '--light-color': lightingSettings.primaryLight.color,
                '--ambient-intensity': lightingSettings.ambientLight.intensity,
                '--ambient-color': lightingSettings.ambientLight.color,
              } as React.CSSProperties}
            ></div>
          )}
          
          {/* Special effects overlays */}
          {activeEffects.includes('Holographic') && (
            <div 
              className="effect-holographic absolute inset-0"
              style={{ opacity: effectIntensities['Holographic'] || 1 }}
            ></div>
          )}
          {activeEffects.includes('Refractor') && (
            <div 
              className="effect-refractor absolute inset-0"
              style={{ opacity: effectIntensities['Refractor'] || 1 }}
            ></div>
          )}
          
          {/* Add subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none"></div>
        </div>

        {/* Card Back */}
        <div 
          className={`card-face card-back absolute w-full h-full rounded-xl overflow-hidden card-spotlight ${activeEffects.join(' ')}`}
          style={{
            backfaceVisibility: 'hidden',
            backgroundColor: currentTheme.backgroundColor,
            transform: 'rotateY(180deg)',
            boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 15px ${currentTheme.accentColor}40`,
            border: `1px solid ${currentTheme.accentColor}30`,
          }}
        >
          {/* Card Back Content */}
          <div className="p-6 flex flex-col h-full dark-glass">
            <h2 className="text-xl font-bold mb-2 glow-text" style={{ color: currentTheme.primaryColor }}>{card.title || 'Card Title'}</h2>
            
            {card.description && (
              <p className="text-sm mb-4 line-clamp-3" style={{ color: currentTheme.textColor }}>{card.description}</p>
            )}
            
            <div className="mt-auto">
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {card.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 rounded-md text-xs"
                      style={{ 
                        backgroundColor: `${currentTheme.secondaryColor}40`, 
                        color: currentTheme.secondaryColor 
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="border-t mt-4 pt-4 text-sm flex justify-between" style={{ borderColor: `${currentTheme.textColor}20`, color: `${currentTheme.textColor}80` }}>
                <span>{card.year}</span>
                <span>{card.id}</span>
              </div>
            </div>
          </div>

          {/* Apply lighting effects to back face */}
          {lightingSettings && (
            <div 
              className={`lighting-overlay environment-${lightingSettings.environmentType}`}
              style={{
                '--light-x': `${-lightingSettings.primaryLight.x}px`,
                '--light-y': `${lightingSettings.primaryLight.y}px`,
                '--light-z': `${lightingSettings.primaryLight.z}px`,
                '--light-intensity': lightingSettings.primaryLight.intensity * 0.7,
                '--light-color': lightingSettings.primaryLight.color,
                '--ambient-intensity': lightingSettings.ambientLight.intensity,
                '--ambient-color': lightingSettings.ambientLight.color,
              } as React.CSSProperties}
            ></div>
          )}
          
          {/* Add subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none"></div>
        </div>
        
        {/* Exploded view layers */}
        {showExplodedView && (
          <div className="exploded-layers">
            {/* Base layer already exists as card front and back */}
            
            {/* Shadow layer */}
            <div 
              className="absolute w-full h-full rounded-xl bg-black/90"
              style={{
                transform: 'translateZ(-10px)',
                boxShadow: '0 0 30px rgba(0,0,0,0.7)',
                opacity: 0.4
              }}
            ></div>
            
            {/* Highlight layer */}
            <div 
              className="absolute w-[90%] h-[90%] rounded-xl bg-white/10"
              style={{
                left: '5%',
                top: '5%',
                transform: 'translateZ(20px)',
                boxShadow: '0 0 20px rgba(255,255,255,0.1)',
                opacity: 0.4,
                pointerEvents: 'none'
              }}
            ></div>
            
            {/* Special effect layers */}
            {activeEffects.includes('Holographic') && (
              <div 
                className="absolute w-[95%] h-[95%] rounded-xl bg-gradient-to-tr from-blue-400/20 to-purple-500/20"
                style={{
                  left: '2.5%',
                  top: '2.5%',
                  transform: 'translateZ(10px)',
                  opacity: effectIntensities['Holographic'] || 0.7,
                  pointerEvents: 'none'
                }}
              ></div>
            )}
            
            {activeEffects.includes('Refractor') && (
              <div 
                className="absolute w-[98%] h-[98%] rounded-xl bg-gradient-to-br from-yellow-400/10 to-orange-500/10"
                style={{
                  left: '1%',
                  top: '1%',
                  transform: 'translateZ(5px)',
                  opacity: effectIntensities['Refractor'] || 0.6,
                  pointerEvents: 'none'
                }}
              ></div>
            )}
          </div>
        )}
        
        {/* Render particle effects */}
        <CardParticleSystem
          containerRef={cardRef}
          particleState={particleState}
          cardRotation={combinedRotation}
          isFlipped={isFlipped}
          isMoving={isDragging || isGesturing || isAutoRotating || totalMovement > 20}
        />
      </div>
      
      {/* Gesture tutorial dialog */}
      <GestureTutorial 
        open={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
    </div>
  );
};

export default CardDisplay;
