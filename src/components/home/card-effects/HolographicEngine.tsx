
import React, { useEffect, useRef } from 'react';
import { throttle } from 'lodash-es';

interface HolographicEngineProps {
  active: boolean;
  intensity?: number;
  colorMode?: 'rainbow' | 'gold' | 'silver' | 'blue';
  animated?: boolean;
  microtext?: string;
  particleCount?: number;
}

const HolographicEngine: React.FC<HolographicEngineProps> = ({
  active,
  intensity = 1.0,
  colorMode = 'rainbow',
  animated = true,
  microtext = 'AUTHENTIC HOLOGRAM',
  particleCount = 30
}) => {
  const engineRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  
  // Initialize the effect
  useEffect(() => {
    if (!active || !engineRef.current) return;
    
    const engineElement = engineRef.current;
    engineElement.style.setProperty('--holo-intensity', intensity.toString());
    
    // Set color mode
    const getColorGradient = () => {
      switch (colorMode) {
        case 'gold':
          return 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 40%, #B38728 60%, #FBF5B7 80%, #AA771C 100%)';
        case 'silver':
          return 'linear-gradient(135deg, #CCCCCC 0%, #FFFFFF 40%, #AAAAAA 60%, #F5F5F5 80%, #999999 100%)';
        case 'blue':
          return 'linear-gradient(135deg, #29ABE2 0%, #98DCFB 40%, #3F8CFF 60%, #8FD1FF 80%, #2E66FF 100%)';
        case 'rainbow':
        default:
          return 'linear-gradient(135deg, #FF0000 0%, #FFFF00 25%, #00FF00 50%, #00FFFF 75%, #0000FF 100%)';
      }
    };
    
    engineElement.style.setProperty('--holo-gradient', getColorGradient());
    
    // Generate the microtext pattern if enabled
    if (microtext && engineElement) {
      const textContainer = document.createElement('div');
      textContainer.className = 'spectral-microtext';
      
      // Create repeating text pattern
      const repeatedText = Array(50).fill(microtext).join(' ');
      
      // Create multiple lines
      for (let i = 0; i < 100; i++) {
        const textLine = document.createElement('div');
        textLine.textContent = repeatedText;
        if (i % 2 === 0) {
          textLine.style.transform = 'translateX(-20%)';
        }
        textContainer.appendChild(textLine);
      }
      
      // Add to the DOM
      engineElement.appendChild(textContainer);
      
      // Cleanup
      return () => {
        if (textContainer.parentNode === engineElement) {
          engineElement.removeChild(textContainer);
        }
      };
    }
  }, [active, intensity, colorMode, microtext]);
  
  // Initialize canvas-based particle effects
  useEffect(() => {
    if (!active || !canvasRef.current || particleCount <= 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas to match container
    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resizeCanvas();
    
    // Listen for resize events
    const handleResize = throttle(resizeCanvas, 100);
    window.addEventListener('resize', handleResize);
    
    // Create particles
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    }));
    
    // Animation function
    const animate = () => {
      if (!ctx || !animated) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient based on color mode
      let gradient: CanvasGradient;
      
      switch (colorMode) {
        case 'gold':
          gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 215, 0.6)');
          gradient.addColorStop(1, 'rgba(212, 175, 55, 0.6)');
          break;
        case 'silver':
          gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, 'rgba(192, 192, 192, 0.6)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(169, 169, 169, 0.6)');
          break;
        case 'blue':
          gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, 'rgba(0, 100, 255, 0.6)');
          gradient.addColorStop(0.5, 'rgba(135, 206, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(0, 191, 255, 0.6)');
          break;
        default:
          gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, 'rgba(255, 0, 0, 0.6)');
          gradient.addColorStop(0.33, 'rgba(0, 255, 0, 0.6)');
          gradient.addColorStop(0.66, 'rgba(0, 0, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(255, 0, 255, 0.6)');
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.opacity * intensity;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Request next frame
      rafRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    if (animated) {
      animate();
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [active, colorMode, animated, intensity, particleCount]);
  
  if (!active) return null;
  
  return (
    <div 
      ref={engineRef}
      className="holographic-engine"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 15,
        pointerEvents: 'none',
        overflow: 'hidden',
        borderRadius: '12px',
        opacity: intensity,
        mixBlendMode: 'overlay'
      }}
    >
      {/* Holographic base layer */}
      <div 
        className="holographic-base"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--holo-gradient)',
          opacity: 0.2,
          mixBlendMode: 'color-dodge',
          filter: 'blur(8px)',
          animation: animated ? 'hue-rotate 6s infinite alternate' : 'none',
        }}
      />
      
      {/* Dynamic particles canvas */}
      <canvas 
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Shine effect */}
      <div 
        className="holographic-shine"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
          backgroundSize: '200% 200%',
          animation: animated ? 'shine-slide 3s infinite linear' : 'none',
          opacity: 0.3
        }}
      />
    </div>
  );
};

export default HolographicEngine;
