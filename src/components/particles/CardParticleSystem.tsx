
import React, { useRef, useState, useEffect } from 'react';
import { ParticleSystemState } from '@/lib/types/particleEffects';
import CardParticleEffect from './CardParticleEffect';

interface CardParticleSystemProps {
  containerRef: React.RefObject<HTMLDivElement>;
  particleState: ParticleSystemState;
  cardRotation?: { x: number; y: number; z: number };
  isFlipped?: boolean;
  isMoving?: boolean;
  paused?: boolean;
  className?: string;
}

const CardParticleSystem: React.FC<CardParticleSystemProps> = ({
  containerRef,
  particleState,
  cardRotation = { x: 0, y: 0, z: 0 },
  isFlipped = false,
  isMoving = false,
  paused = false,
  className = ''
}) => {
  const systemRef = useRef<HTMLDivElement>(null);
  
  // If the system is inactive, don't render anything
  if (!particleState.isActive) {
    return null;
  }

  return (
    <div 
      className={`particle-container ${className} ${particleState.isTransitioning ? 'transition-opacity duration-500' : ''}`}
      ref={systemRef}
    >
      {/* Render each enabled effect */}
      {Object.entries(particleState.effects).map(([type, settings]) => (
        settings.enabled && (
          <CardParticleEffect
            key={type}
            effectType={type as any}
            settings={settings}
            containerRef={containerRef}
            performanceLevel={particleState.performanceLevel}
            cardRotation={cardRotation}
            isFlipped={isFlipped}
            isMoving={isMoving}
            paused={paused}
          />
        )
      ))}
    </div>
  );
};

export default CardParticleSystem;
