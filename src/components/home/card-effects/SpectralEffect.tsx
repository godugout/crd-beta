
import React, { useEffect, useRef } from 'react';
import './SpectralEffect.css';

interface SpectralEffectProps {
  intensity?: number;
  isActive: boolean;
}

const SpectralEffect: React.FC<SpectralEffectProps> = ({
  intensity = 1.0,
  isActive
}) => {
  const spectralRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!spectralRef.current || !isActive) return;
    
    const spectralElement = spectralRef.current;
    spectralElement.style.setProperty('--spectral-intensity', intensity.toString());
    
    // Create dynamic pattern
    const createPattern = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = 256;
      canvas.height = 256;
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 256, 256);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      gradient.addColorStop(0.5, 'rgba(200, 200, 255, 0.08)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
      
      // Add holographic lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < 50; i++) {
        const y = i * 5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }
      
      // Add some diagonal lines
      ctx.strokeStyle = 'rgba(150, 230, 255, 0.15)';
      for (let i = 0; i < 20; i++) {
        const offset = i * 15;
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(256, offset);
        ctx.stroke();
      }
      
      return canvas.toDataURL('image/png');
    };
    
    const pattern = createPattern();
    if (pattern) {
      spectralElement.style.setProperty('--spectral-pattern', `url(${pattern})`);
    }
  }, [intensity, isActive]);
  
  if (!isActive) return null;
  
  return (
    <div 
      ref={spectralRef}
      className="spectral-effect"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none'
      }}
    />
  );
};

export default SpectralEffect;
