
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface Card3DTransformProps {
  children: React.ReactNode;
  className?: string;
  rotateX?: number;
  rotateY?: number;
  scale?: number;
  perspective?: number;
  lightIntensity?: number;
  enableDeformation?: boolean;
  shadowOpacity?: number;
  shadowBlur?: number;
  shadowColor?: string;
}

export const Card3DTransform: React.FC<Card3DTransformProps> = ({
  children,
  className,
  rotateX = 0,
  rotateY = 0,
  scale = 1,
  perspective = 1000,
  lightIntensity = 0.3,
  enableDeformation = true,
  shadowOpacity = 0.3,
  shadowBlur = 20,
  shadowColor = 'rgba(0, 0, 0, 0.5)'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });
  
  // Update card dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setCardDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };
    
    updateDimensions();
    
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);
  
  // Calculate lighting effects based on rotation
  const lightX = rotateY / 25; // Light moves inversely to rotation
  const lightY = -rotateX / 25;
  
  // Calculate card deformation based on the rotation angle
  const deformationX = enableDeformation ? Math.abs(rotateY) * 0.05 : 0;
  const deformationY = enableDeformation ? Math.abs(rotateX) * 0.05 : 0;
  
  // Calculate shadow position based on rotation
  const shadowX = rotateY * 0.5;
  const shadowY = rotateX * 0.5;
  
  // Create style for spotlight effect
  const spotlightStyle = {
    background: `radial-gradient(
      circle at ${50 + lightX}% ${50 + lightY}%,
      rgba(255, 255, 255, ${lightIntensity}),
      rgba(255, 255, 255, 0) 70%
    )`,
  };
  
  // Create style for shadow
  const shadowStyle = {
    boxShadow: `
      ${shadowX}px ${shadowY}px ${shadowBlur}px 0 ${shadowColor}
    `,
    filter: `drop-shadow(0 20px 20px rgba(0, 0, 0, ${shadowOpacity}))`
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "card-3d-transform relative w-full h-full",
        className
      )}
      style={{
        perspective: `${perspective}px`,
      }}
    >
      {/* Main card container with 3D transformations */}
      <div
        className="card-3d-container relative w-full h-full"
        style={{
          transform: `
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale(${scale})
            ${enableDeformation ? `perspective(${perspective}px)` : ''}
          `,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out',
          ...shadowStyle
        }}
      >
        {/* Card content */}
        <div className="card-content relative w-full h-full">
          {/* Light reflection overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-10 opacity-70 mix-blend-overlay"
            style={spotlightStyle}
          />
          
          {/* Subtle edge deformation when card is rotated */}
          {enableDeformation && (
            <div
              className="absolute inset-0 pointer-events-none rounded-lg"
              style={{
                transform: `perspective(${perspective}px) scaleX(${1 - deformationX}) scaleY(${1 - deformationY})`,
                background: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0))',
                opacity: Math.max(deformationX, deformationY) * 5,
                mixBlendMode: 'overlay',
              }}
            />
          )}
          
          {/* Actual card content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card3DTransform;
