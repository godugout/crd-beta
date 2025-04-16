
import React, { useRef, useEffect, useState } from 'react';
import { ParticleSettings, ParticleEffectType, ParticleSystemState } from '@/lib/types/particleEffects';
import '@/styles/card-particles.css';

interface CardParticleEffectProps {
  effectType: ParticleEffectType;
  settings: ParticleSettings;
  containerRef: React.RefObject<HTMLDivElement>;
  performanceLevel: 'high' | 'medium' | 'low';
  cardRotation?: { x: number; y: number; z: number };
  isFlipped?: boolean;
  isMoving?: boolean;
  paused?: boolean;
}

const CardParticleEffect: React.FC<CardParticleEffectProps> = ({
  effectType,
  settings,
  containerRef,
  performanceLevel,
  cardRotation = { x: 0, y: 0, z: 0 },
  isFlipped = false,
  isMoving = false,
  paused = false
}) => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const activeParticlesRef = useRef<HTMLDivElement[]>([]);
  const particlePoolRef = useRef<HTMLDivElement[]>([]);
  
  // Calculate how many particles to show based on performance level and settings
  const getParticleCount = () => {
    const baseCount = 
      performanceLevel === 'high' ? 100 : 
      performanceLevel === 'medium' ? 50 : 20;
    
    return Math.floor(baseCount * settings.density);
  };

  // Initialize particle pool
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const container = particlesRef.current;
    const particleCount = getParticleCount();
    
    // Clear existing particles
    container.innerHTML = '';
    activeParticlesRef.current = [];
    particlePoolRef.current = [];
    
    // Create particle pool
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = `particle ${effectType}-particle`;
      particle.style.display = 'none';
      container.appendChild(particle);
      particlePoolRef.current.push(particle);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [effectType, performanceLevel, settings.density]);

  // Main animation loop
  useEffect(() => {
    if (!settings.enabled || paused || !containerRef.current || !particlesRef.current) return;

    let lastTime = performance.now();
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    const getEmissionPoint = () => {
      let x, y;
      
      switch (settings.emissionPattern) {
        case 'edges':
          // Randomly select one of the four edges
          const edge = Math.floor(Math.random() * 4);
          switch (edge) {
            case 0: // Top edge
              x = Math.random() * rect.width;
              y = 0;
              break;
            case 1: // Right edge
              x = rect.width;
              y = Math.random() * rect.height;
              break;
            case 2: // Bottom edge
              x = Math.random() * rect.width;
              y = rect.height;
              break;
            case 3: // Left edge
              x = 0;
              y = Math.random() * rect.height;
              break;
          }
          break;
        
        case 'corners':
          // Randomly select one of the four corners
          const corner = Math.floor(Math.random() * 4);
          switch (corner) {
            case 0: // Top-left
              x = rect.width * 0.1 * Math.random();
              y = rect.height * 0.1 * Math.random();
              break;
            case 1: // Top-right
              x = rect.width - (rect.width * 0.1 * Math.random());
              y = rect.height * 0.1 * Math.random();
              break;
            case 2: // Bottom-right
              x = rect.width - (rect.width * 0.1 * Math.random());
              y = rect.height - (rect.height * 0.1 * Math.random());
              break;
            case 3: // Bottom-left
              x = rect.width * 0.1 * Math.random();
              y = rect.height - (rect.height * 0.1 * Math.random());
              break;
          }
          break;
        
        case 'custom':
          // Use custom emission points if available
          if (settings.customEmissionPoints && settings.customEmissionPoints.length > 0) {
            const point = settings.customEmissionPoints[
              Math.floor(Math.random() * settings.customEmissionPoints.length)
            ];
            x = point[0] * rect.width;
            y = point[1] * rect.height;
          } else {
            // Fallback to full pattern
            x = Math.random() * rect.width;
            y = Math.random() * rect.height;
          }
          break;
        
        case 'full':
        default:
          // Random point within the container
          x = Math.random() * rect.width;
          y = Math.random() * rect.height;
      }
      
      return { x, y };
    };
    
    const createParticle = () => {
      // Get a particle from the pool
      if (particlePoolRef.current.length === 0) return null;
      
      const particle = particlePoolRef.current.pop()!;
      activeParticlesRef.current.push(particle);
      
      // Set particle properties
      const { x, y } = getEmissionPoint();
      const size = (5 + Math.random() * 10) * settings.size;
      const lifetime = (0.8 + Math.random() * 1.2) * settings.lifespan;
      
      // Choose color
      let color = settings.color;
      if (Array.isArray(color)) {
        color = color[Math.floor(Math.random() * color.length)];
      }
      
      // Set CSS properties
      particle.style.display = 'block';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = settings.opacity.toString();
      particle.style.backgroundColor = 'transparent'; // Use gradient backgrounds instead
      
      if (settings.blendMode) {
        particle.style.mixBlendMode = settings.blendMode;
      }
      
      // Set animation variables
      const travelX = (Math.random() - 0.5) * 100 * settings.speed;
      const travelY = (Math.random() - 0.5) * 100 * settings.speed;
      particle.style.setProperty('--travel-x', `${travelX}px`);
      particle.style.setProperty('--travel-y', `${travelY}px`);
      particle.style.setProperty('--lifetime', `${lifetime}s`);
      
      // Add animation class based on effect type
      particle.className = `particle ${effectType}-particle`;
      
      switch (effectType) {
        case 'sparkle':
          particle.classList.add('sparkle-animation');
          if (settings.color.includes('#FFD700') || settings.color.includes('#FFC800')) {
            particle.classList.add('premium');
          }
          break;
        case 'dust':
          particle.classList.add('float-animation');
          break;
        case 'energy':
          particle.classList.add('pulse-animation');
          particle.style.setProperty('--pulse-speed', `${0.8 + Math.random() * 0.8}s`);
          break;
        case 'team':
          particle.classList.add('sparkle-animation');
          break;
      }
      
      // Remove particle after animation completes
      setTimeout(() => {
        if (!particlesRef.current) return;
        
        particle.style.display = 'none';
        
        // Remove from active list and add back to pool
        const index = activeParticlesRef.current.indexOf(particle);
        if (index !== -1) {
          activeParticlesRef.current.splice(index, 1);
        }
        
        particlePoolRef.current.push(particle);
      }, lifetime * 1000);
      
      return particle;
    };
    
    // Animation function
    const animate = (time: number) => {
      if (!settings.enabled || paused || !containerRef.current) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        return;
      }
      
      const delta = time - lastTime;
      lastTime = time;
      
      // Calculate spawn rate based on performance level and settings
      const baseSpawnInterval = 
        performanceLevel === 'high' ? 50 :
        performanceLevel === 'medium' ? 100 : 200;
      
      // Adjust spawn rate based on card movement and flipping
      const movementFactor = isMoving ? settings.reactivity : 0.5;
      const flipFactor = isFlipped ? 1.5 : 1;
      const spawnInterval = baseSpawnInterval / (settings.density * movementFactor * flipFactor);
      
      // Spawn particles at calculated rate
      if (delta > spawnInterval) {
        createParticle();
      }
      
      // Update existing particles based on card rotation
      if (settings.reactivity > 0) {
        activeParticlesRef.current.forEach(particle => {
          const currentTransform = particle.style.transform || '';
          const rotationInfluence = settings.reactivity * 0.1;
          
          // Add subtle movement based on card rotation
          particle.style.transform = `
            ${currentTransform}
            translate3d(
              ${cardRotation.y * rotationInfluence}px,
              ${-cardRotation.x * rotationInfluence}px,
              0
            )
          `;
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [settings.enabled, paused, settings.density, settings.speed, settings.reactivity, 
      settings.emissionPattern, settings.color, settings.size, settings.opacity, 
      settings.lifespan, effectType, performanceLevel, isMoving, isFlipped, cardRotation]);

  return (
    <div 
      className={`particle-layer layer-${effectType} particles-${performanceLevel}`} 
      ref={particlesRef}
    />
  );
};

export default CardParticleEffect;
