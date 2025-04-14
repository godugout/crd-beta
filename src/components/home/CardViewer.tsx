import React, { useState, useCallback, useEffect } from 'react';
import { CardData } from '@/types/card';
import { toast } from 'sonner';
import './card-effects/index.css';
import CardCanvas from './card-viewer/CardCanvas';
import CardControls from './card-viewer/CardControls';
import EffectControls from './card-viewer/EffectControls';
import EffectsPresets from './card-viewer/EffectsPresets';
import { useCardEffects } from './card-viewer/useCardEffects';
import { useEffectSettings } from './card-viewer/useEffectSettings';
import { usePresetsState } from './card-viewer/usePresetsState';
import CardBackground from './card-viewer/CardBackground';
import CardContainer from './card-viewer/CardContainer';
import { motion } from 'framer-motion';

interface CardViewerProps {
  card: CardData;
  isFlipped: boolean;
  flipCard: () => void;
  onBackToCollection: () => void;
  activeEffects: string[];
  onSnapshot: () => void;
  autoRotate?: boolean;
}

const CardViewer = ({ 
  card, 
  isFlipped, 
  flipCard, 
  onBackToCollection, 
  activeEffects,
  onSnapshot,
  autoRotate = true
}: CardViewerProps) => {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [showPresetsPanel, setShowPresetsPanel] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isBeingDragged, setIsBeingDragged] = useState(false);
  const [localActiveEffects, setLocalActiveEffects] = useState<string[]>([]);

  const { 
    cardRef,
    containerRef,
    canvasRef,
    isMoving,
    handleCanvasMouseMove,
    handleMouseMove,
    handleMouseLeave,
    setAnimationSpeed
  } = useCardEffects();

  const effectSettings = useEffectSettings((settings) => {
    setAnimationSpeed({
      motion: settings.motionSpeed,
      pulse: settings.pulseIntensity,
      shimmer: settings.shimmerSpeed,
      gold: settings.goldIntensity,
      chrome: settings.chromeIntensity,
      vintage: settings.vintageIntensity,
      refractor: settings.refractorIntensity,
      spectral: settings.spectralIntensity || 1.0
    });
  });
  
  useEffect(() => {
    const initialEffects = activeEffects.length > 0 ? [activeEffects[0]] : [];
    setLocalActiveEffects(initialEffects);
  }, []);
  
  useEffect(() => {
    if (!autoRotate || !containerRef.current || isBeingDragged) return;
    
    const autoRotateInterval = setInterval(() => {
      if (!containerRef.current || isMoving) return;
      
      const rotateX = Math.sin(Date.now() / 3000) * 5;
      const rotateY = Math.cos(Date.now() / 4000) * 8;
      
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 1s ease-out';
        cardRef.current.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      }
    }, 50);
    
    return () => clearInterval(autoRotateInterval);
  }, [autoRotate, isMoving, isBeingDragged, containerRef, cardRef]);
  
  const { userPresets, builtInPresets, handleToggleFavorite, saveUserPreset } = usePresetsState();
  
  const handleSnapshot = () => {
    onSnapshot();
    toast.success('Snapshot captured!', {
      description: 'Effect combination saved to gallery'
    });
  };

  const toggleAdvancedControls = () => {
    setShowAdvancedControls(prev => !prev);
    if (showPresetsPanel) setShowPresetsPanel(false);
  };

  const togglePresetsPanel = () => {
    setShowPresetsPanel(prev => !prev);
    if (showAdvancedControls) setShowAdvancedControls(false);
  };

  const handleSaveEffectsCombination = (name: string) => {
    const newPreset = saveUserPreset(name, activeEffects, effectSettings.getCurrentSettings());
    
    toast.success('Effect combination saved!', {
      description: `"${name}" added to your presets library`
    });
  };

  const handleApplyPreset = (preset: any) => {
    effectSettings.applySettings(preset.settings);
    
    toast.success(`"${preset.name}" applied!`, {
      description: `Effects combination applied to the current card`
    });
  };
  
  const handleMotionSpeedChange = (value: number) => {
    effectSettings.handleMotionSpeedChange([value]);
  };

  const handlePulseIntensityChange = (value: number) => {
    effectSettings.handlePulseIntensityChange([value]);
  };

  const handleShimmerSpeedChange = (value: number) => {
    effectSettings.handleShimmerSpeedChange([value]);
  };

  const handleGoldIntensityChange = (value: number) => {
    effectSettings.handleGoldIntensityChange([value]);
  };

  const handleChromeIntensityChange = (value: number) => {
    effectSettings.handleChromeIntensityChange([value]);
  };

  const handleVintageIntensityChange = (value: number) => {
    effectSettings.handleVintageIntensityChange([value]);
  };

  const handleRefractorIntensityChange = (value: number) => {
    effectSettings.handleRefractorIntensityChange([value]);
  };

  const handleSpectralIntensityChange = (value: number) => {
    effectSettings.handleSpectralIntensityChange([value]);
  };

  const handleDragStart = () => {
    setIsBeingDragged(true);
  };
  
  const handleDragEnd = (info: any) => {
    setIsBeingDragged(false);
    
    const velocity = Math.abs(info.velocity.x) + Math.abs(info.velocity.y);
    
    if (velocity > 500) {
      const angle = Math.atan2(info.velocity.y, info.velocity.x) * (180 / Math.PI);
      const direction = 
        angle > -45 && angle < 45 ? 'right' :
        angle >= 45 && angle < 135 ? 'down' :
        angle >= 135 || angle < -135 ? 'left' :
        'up';
      
      toast.success(`Card flicked ${direction}!`, {
        description: 'Sharing with nearby users'
      });
    }
    
    setDragPosition({ x: 0, y: 0 });
  };

  const handleToggleEffect = useCallback((effect: string) => {
    setLocalActiveEffects(prev => 
      prev.includes(effect) 
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
  }, []);

  return (
    <div>
      <div 
        ref={canvasRef}
        className="relative w-full h-96 md:h-[500px] flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-visible"
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <CardBackground activeEffects={localActiveEffects} />
        
        <motion.div
          drag
          dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
          dragElastic={0.2}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={dragPosition}
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ overflow: 'visible' }}
        >
          <CardContainer
            containerRef={containerRef}
            onMouseMove={handleMouseMove}
            isMoving={isMoving}
            effectSettings={effectSettings.getCurrentSettings()}
            activeEffects={localActiveEffects}
          >
            <CardCanvas 
              card={card}
              isFlipped={isFlipped}
              activeEffects={localActiveEffects}
              containerRef={containerRef}
              cardRef={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              effectSettings={{
                refractorIntensity: 0.3,
                refractorColors: ['#00ffff', '#ff00ff', '#ffff00'],
                animationEnabled: true,
                refractorSpeed: 0.5,
                holographicIntensity: 0.3,
                holographicPattern: 'linear',
                holographicColorMode: 'rainbow',
                holographicSparklesEnabled: true
              }}
            />
          </CardContainer>
        </motion.div>
        
        <CardControls 
          flipCard={flipCard}
          onBackToCollection={onBackToCollection}
          onSnapshot={handleSnapshot}
          activeEffectsCount={localActiveEffects.length}
          onToggleAdvancedControls={toggleAdvancedControls}
          showAdvancedControls={showAdvancedControls}
          onTogglePresetsPanel={togglePresetsPanel}
          showPresetsPanel={showPresetsPanel}
        />

        <EffectControls 
          isOpen={showAdvancedControls}
          onClose={() => setShowAdvancedControls(false)}
          onSaveEffectsCombination={handleSaveEffectsCombination}
          activeEffects={localActiveEffects}
          onMotionSpeedChange={handleMotionSpeedChange}
          onPulseIntensityChange={handlePulseIntensityChange}
          onShimmerSpeedChange={handleShimmerSpeedChange}
          onGoldIntensityChange={handleGoldIntensityChange}
          onChromeIntensityChange={handleChromeIntensityChange}
          onVintageIntensityChange={handleVintageIntensityChange}
          onRefractorIntensityChange={handleRefractorIntensityChange}
          onSpectralIntensityChange={handleSpectralIntensityChange}
          motionSpeed={effectSettings.motionSpeed}
          pulseIntensity={effectSettings.pulseIntensity}
          shimmerSpeed={effectSettings.shimmerSpeed}
          goldIntensity={effectSettings.goldIntensity}
          chromeIntensity={effectSettings.chromeIntensity}
          vintageIntensity={effectSettings.vintageIntensity}
          refractorIntensity={effectSettings.refractorIntensity}
          spectralIntensity={effectSettings.spectralIntensity}
        />

        <EffectsPresets
          isOpen={showPresetsPanel}
          onClose={() => setShowPresetsPanel(false)}
          presets={builtInPresets}
          userPresets={userPresets}
          onApplyPreset={handleApplyPreset}
          onToggleFavorite={handleToggleFavorite}
        />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="spotlight spotlight-1" style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)'
          }}></div>
          <div className="spotlight spotlight-2" style={{
            backgroundImage: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 35%)'
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default CardViewer;
