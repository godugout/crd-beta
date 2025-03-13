
import React, { useState, useEffect } from 'react';
import { CardData } from '@/types/card';
import { toast } from 'sonner';
import './CardEffects.css';
import CardCanvas from './card-viewer/CardCanvas';
import CardControls from './card-viewer/CardControls';
import EffectControls from './card-viewer/EffectControls';
import { useCardEffects } from './card-viewer/useCardEffects';

interface CardViewerProps {
  card: CardData;
  isFlipped: boolean;
  flipCard: () => void;
  onBackToCollection: () => void;
  activeEffects: string[];
  onSnapshot: () => void;
}

const CardViewer = ({ 
  card, 
  isFlipped, 
  flipCard, 
  onBackToCollection, 
  activeEffects,
  onSnapshot
}: CardViewerProps) => {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [motionSpeed, setMotionSpeed] = useState(1.0);
  const [pulseIntensity, setPulseIntensity] = useState(1.0);
  const [shimmerSpeed, setShimmerSpeed] = useState(3.0);

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

  useEffect(() => {
    // Update animation speeds when controls change
    setAnimationSpeed({
      motion: motionSpeed,
      pulse: pulseIntensity,
      shimmer: shimmerSpeed
    });
  }, [motionSpeed, pulseIntensity, shimmerSpeed, setAnimationSpeed]);
  
  const handleSnapshot = () => {
    onSnapshot();
    toast.success('Snapshot captured!', {
      description: 'Effect combination saved to gallery'
    });
  };

  const toggleAdvancedControls = () => {
    setShowAdvancedControls(prev => !prev);
  };

  const handleMotionSpeedChange = (value: number[]) => {
    setMotionSpeed(value[0]);
  };

  const handlePulseIntensityChange = (value: number[]) => {
    setPulseIntensity(value[0]);
  };

  const handleShimmerSpeedChange = (value: number[]) => {
    setShimmerSpeed(value[0]);
  };

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-96 md:h-[500px] flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden"
      onMouseMove={handleCanvasMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic background */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
      
      {/* Card container with 3D perspective */}
      <div 
        ref={containerRef}
        className={`card-3d-container relative w-80 h-[450px] flex items-center justify-center transition-transform duration-200 ${isMoving ? 'mouse-move' : 'dynamic-card floating-card'}`}
        onMouseMove={handleMouseMove}
        style={{
          '--motion-speed': `${motionSpeed}`,
          '--pulse-intensity': `${pulseIntensity}`,
          '--shimmer-speed': `${shimmerSpeed}s`
        } as React.CSSProperties}
      >
        {/* Card representation */}
        <CardCanvas 
          card={card}
          isFlipped={isFlipped}
          activeEffects={activeEffects}
          containerRef={containerRef}
          cardRef={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      
      {/* Controls */}
      <CardControls 
        flipCard={flipCard}
        onBackToCollection={onBackToCollection}
        onSnapshot={handleSnapshot}
        activeEffectsCount={activeEffects.length}
        onToggleAdvancedControls={toggleAdvancedControls}
        showAdvancedControls={showAdvancedControls}
      />

      {/* Advanced Effect Controls */}
      <EffectControls 
        isOpen={showAdvancedControls}
        motionSpeed={motionSpeed}
        pulseIntensity={pulseIntensity}
        shimmerSpeed={shimmerSpeed}
        onClose={() => setShowAdvancedControls(false)}
        onMotionSpeedChange={handleMotionSpeedChange}
        onPulseIntensityChange={handlePulseIntensityChange}
        onShimmerSpeedChange={handleShimmerSpeedChange}
      />
    </div>
  );
};

export default CardViewer;
