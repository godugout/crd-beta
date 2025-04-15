
import React, { useEffect, useRef, useState } from 'react';

interface CardBackgroundProps {
  activeEffects?: string[];
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const CardBackground: React.FC<CardBackgroundProps> = ({ 
  activeEffects = [], 
  intensity = 'medium',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const frameRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle mouse movement for interactive lighting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Determine background style based on active effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match display size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    setDimensions({ width: rect.width, height: rect.height });
    
    // Initialize particles
    if (particlesRef.current.length === 0) {
      initializeParticles(rect.width, rect.height);
    }
    
    // Animation frame for continuous rendering
    const render = () => {
      // Reset canvas
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Determine effects intensity
      const intensityValue = intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1;
      
      // Choose background style based on active effects
      const hasRefractor = activeEffects.includes('Refractor');
      const hasHolographic = activeEffects.includes('Holographic');
      const hasGoldFoil = activeEffects.includes('Gold Foil');
      const hasVintage = activeEffects.includes('Vintage');
      
      // Create gradient background
      drawBackgroundGradient(ctx, rect.width, rect.height, {
        hasRefractor,
        hasHolographic,
        hasGoldFoil,
        hasVintage,
        intensityValue
      });
      
      // Add dynamic spotlight that follows mouse
      drawSpotlights(ctx, rect.width, rect.height, mousePosition);
      
      // Add particle effects
      if (hasRefractor || hasHolographic || hasGoldFoil) {
        updateAndDrawParticles(ctx, rect.width, rect.height, {
          hasRefractor,
          hasHolographic,
          hasGoldFoil,
          intensityValue
        });
      }
      
      // Add ambient light glow
      drawAmbientGlow(ctx, rect.width, rect.height, intensityValue);
      
      // Continue animation loop
      frameRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [activeEffects, mousePosition, dimensions, intensity]);
  
  // Initialize particles
  const initializeParticles = (width: number, height: number) => {
    const particleCount = 150;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2
      });
    }
    
    particlesRef.current = particles;
  };
  
  // Update and draw particles
  const updateAndDrawParticles = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    options: { 
      hasRefractor: boolean, 
      hasHolographic: boolean, 
      hasGoldFoil: boolean,
      intensityValue: number
    }
  ) => {
    particlesRef.current.forEach(particle => {
      // Update particle position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around screen edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
      
      // Determine particle color based on effects
      let particleColor: string;
      
      if (options.hasGoldFoil) {
        const goldHue = 35 + Math.random() * 20;
        const goldSat = 80 + Math.random() * 20;
        particleColor = `hsla(${goldHue}, ${goldSat}%, 60%, ${particle.opacity * options.intensityValue})`;
      } else if (options.hasHolographic) {
        const hue = (particle.x / width) * 360;
        particleColor = `hsla(${hue}, 100%, 70%, ${particle.opacity * options.intensityValue})`;
      } else if (options.hasRefractor) {
        particleColor = `rgba(100, 150, 255, ${particle.opacity * options.intensityValue})`;
      } else {
        particleColor = `rgba(255, 255, 255, ${particle.opacity * options.intensityValue})`;
      }
      
      // Draw particle
      ctx.fillStyle = particleColor;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  // Draw background gradient
  const drawBackgroundGradient = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    options: { 
      hasRefractor: boolean, 
      hasHolographic: boolean, 
      hasGoldFoil: boolean,
      hasVintage: boolean,
      intensityValue: number
    }
  ) => {
    let gradient: CanvasGradient;
    
    if (options.hasGoldFoil) {
      gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
    } else {
      gradient = ctx.createLinearGradient(0, 0, width, height);
    }
    
    if (options.hasRefractor && options.hasHolographic) {
      // Vibrant dual-effect background
      gradient.addColorStop(0, 'rgba(30, 30, 50, 1)');
      gradient.addColorStop(0.4, 'rgba(20, 20, 40, 1)');
      gradient.addColorStop(0.6, 'rgba(15, 15, 35, 1)');
      gradient.addColorStop(1, 'rgba(5, 5, 20, 1)');
    } else if (options.hasRefractor) {
      // Cool blue refractor background
      gradient.addColorStop(0, 'rgba(10, 20, 40, 1)');
      gradient.addColorStop(0.5, 'rgba(5, 10, 30, 1)');
      gradient.addColorStop(1, 'rgba(0, 5, 20, 1)');
    } else if (options.hasHolographic) {
      // Rainbow-tinted holographic background
      gradient.addColorStop(0, 'rgba(25, 15, 30, 1)');
      gradient.addColorStop(0.5, 'rgba(15, 10, 25, 1)');
      gradient.addColorStop(1, 'rgba(10, 5, 20, 1)');
    } else if (options.hasGoldFoil) {
      // Gold-tinted luxury background
      gradient.addColorStop(0, 'rgba(25, 20, 10, 1)');
      gradient.addColorStop(0.7, 'rgba(15, 10, 5, 1)');
      gradient.addColorStop(1, 'rgba(10, 5, 0, 1)');
    } else if (options.hasVintage) {
      // Sepia-toned vintage background
      gradient.addColorStop(0, 'rgba(30, 25, 20, 1)');
      gradient.addColorStop(0.5, 'rgba(20, 15, 10, 1)');
      gradient.addColorStop(1, 'rgba(15, 10, 5, 1)');
    } else {
      // Default dark background
      gradient.addColorStop(0, 'rgba(10, 10, 15, 1)');
      gradient.addColorStop(0.5, 'rgba(5, 5, 10, 1)');
      gradient.addColorStop(1, 'rgba(0, 0, 5, 1)');
    }
    
    // Apply gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };
  
  // Draw ambient glow and light beams
  const drawAmbientGlow = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
    // Center glow
    const centerX = width / 2;
    const centerY = height / 2;
    
    const centerGlow = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, height / 1.5
    );
    
    centerGlow.addColorStop(0, `rgba(100, 100, 150, ${0.15 * intensity})`);
    centerGlow.addColorStop(1, 'rgba(100, 100, 150, 0)');
    
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, width, height);
    
    // Add subtle light beams
    const beamCount = 3;
    for (let i = 0; i < beamCount; i++) {
      const rotation = (Math.PI * 2 / beamCount) * i;
      const x1 = centerX;
      const y1 = centerY;
      const distance = Math.sqrt(width * width + height * height) / 2;
      const x2 = centerX + Math.cos(rotation) * distance;
      const y2 = centerY + Math.sin(rotation) * distance;
      
      const beamGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      beamGradient.addColorStop(0, `rgba(150, 150, 200, ${0.1 * intensity})`);
      beamGradient.addColorStop(1, 'rgba(150, 150, 200, 0)');
      
      ctx.fillStyle = beamGradient;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.fillRect(-30, 0, 60, distance);
      ctx.restore();
    }
  };
  
  // Draw spotlights that follow mouse or are fixed
  const drawSpotlights = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    mousePos: { x: number, y: number }
  ) => {
    // Mouse-following spotlight
    if (mousePos.x > 0 && mousePos.y > 0) {
      const spotlightGradient = ctx.createRadialGradient(
        mousePos.x, mousePos.y, 0,
        mousePos.x, mousePos.y, height / 3
      );
      
      spotlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      spotlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      spotlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = spotlightGradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    // Fixed spotlights in corners
    const spotlights = [
      { x: width * 0.2, y: height * 0.2, color: 'rgba(100, 150, 255, 0.1)' },
      { x: width * 0.8, y: height * 0.2, color: 'rgba(255, 150, 100, 0.1)' },
      { x: width * 0.2, y: height * 0.8, color: 'rgba(150, 255, 100, 0.1)' },
      { x: width * 0.8, y: height * 0.8, color: 'rgba(255, 100, 150, 0.1)' }
    ];
    
    spotlights.forEach(spot => {
      const spotGradient = ctx.createRadialGradient(
        spot.x, spot.y, 0,
        spot.x, spot.y, width / 4
      );
      
      spotGradient.addColorStop(0, spot.color);
      spotGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = spotGradient;
      ctx.fillRect(0, 0, width, height);
    });
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ position: 'absolute', inset: 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-50"></div>
    </div>
  );
};

export default CardBackground;
