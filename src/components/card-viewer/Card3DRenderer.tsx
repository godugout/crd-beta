import React, { useRef, useEffect, useState, PropsWithChildren } from 'react';
import * as THREE from 'three';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { Card } from '@/lib/types';

interface Card3DRendererProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  onOffCenter: (isOffCenter: boolean) => void;
}

// Physics constants
const ROTATION_SPEED = 0.15;
const DAMPENING = 0.95;
const INERTIA_FACTOR = 0.92;
const MAX_ROTATION = 0.35;
const RESET_SPEED = 0.1;

const Card3DRenderer: React.FC<PropsWithChildren<Card3DRendererProps>> = ({ 
  card, 
  isFlipped,
  onFlip,
  onOffCenter,
  children 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const isDraggingRef = useRef(false);
  
  // Reset card position with R key
  useKeyboardShortcut('r', () => {
    resetCardPosition();
  });
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseEnter = () => {
      setIsMouseOver(true);
    };
    
    const handleMouseLeave = () => {
      setIsMouseOver(false);
      // Start inertia when mouse leaves
      if (!isDraggingRef.current) {
        startAnimation();
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Get container dimensions and position
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to center of container (-1 to 1)
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      
      setMousePosition({ x, y });
      
      // Calculate mouse velocity for inertia
      const deltaX = e.clientX - previousMouseRef.current.x;
      const deltaY = e.clientY - previousMouseRef.current.y;
      
      // Store current mouse position for next frame
      previousMouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Update velocity
      if (isDraggingRef.current) {
        setVelocity({
          x: deltaX * 0.01,
          y: deltaY * 0.01
        });
        
        // Update position
        setPosition(prev => ({
          x: prev.x + deltaX * 0.02,
          y: prev.y + deltaY * 0.02
        }));
      }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Stop any ongoing animation
      stopAnimation();
    };
    
    const handleMouseUp = () => {
      isDraggingRef.current = false;
      
      // Start inertia animation
      startAnimation();
    };
    
    const handleClick = () => {
      // Only trigger flip if we haven't dragged significantly
      if (Math.abs(velocity.x) < 0.01 && Math.abs(velocity.y) < 0.01) {
        onFlip();
      }
    };
    
    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMouseRef.current = { 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        };
        
        // Stop any ongoing animation
        stopAnimation();
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !isDraggingRef.current || e.touches.length !== 1) return;
      
      // Get container dimensions and position
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      
      // Calculate touch position relative to center of container (-1 to 1)
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
      
      setMousePosition({ x, y });
      
      // Calculate touch velocity for inertia
      const deltaX = touch.clientX - previousMouseRef.current.x;
      const deltaY = touch.clientY - previousMouseRef.current.y;
      
      // Store current touch position for next frame
      previousMouseRef.current = { x: touch.clientX, y: touch.clientY };
      
      // Update velocity
      setVelocity({
        x: deltaX * 0.01,
        y: deltaY * 0.01
      });
      
      // Update position
      setPosition(prev => ({
        x: prev.x + deltaX * 0.02,
        y: prev.y + deltaY * 0.02
      }));
      
      // Prevent default to avoid page scrolling
      e.preventDefault();
    };
    
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      
      // Start inertia animation
      startAnimation();
    };
    
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mousedown', handleMouseDown);
    containerRef.current.addEventListener('mouseup', handleMouseUp);
    containerRef.current.addEventListener('click', handleClick);
    
    // Touch events
    containerRef.current.addEventListener('touchstart', handleTouchStart);
    containerRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    containerRef.current.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mousedown', handleMouseDown);
        containerRef.current.removeEventListener('mouseup', handleMouseUp);
        containerRef.current.removeEventListener('click', handleClick);
        
        // Touch events
        containerRef.current.removeEventListener('touchstart', handleTouchStart);
        containerRef.current.removeEventListener('touchmove', handleTouchMove);
        containerRef.current.removeEventListener('touchend', handleTouchEnd);
      }
      
      // Clean up animation frame
      stopAnimation();
    };
  }, [onFlip]);
  
  // Apply rotation to card based on mouse position or physics
  useEffect(() => {
    if (!cardRef.current) return;
    
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    if (isMouseOver && !isDraggingRef.current) {
      // When mouse is over and not dragging, follow mouse position
      targetRotationX = mousePosition.y * -ROTATION_SPEED;
      targetRotationY = mousePosition.x * ROTATION_SPEED;
    } else {
      // Otherwise, use current rotation
      targetRotationX = rotation.x;
      targetRotationY = rotation.y;
    }
    
    // Limit rotation
    targetRotationX = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, targetRotationX));
    targetRotationY = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, targetRotationY));
    
    // Apply rotation to card with smooth interpolation
    cardRef.current.style.transform = 
      `perspective(1200px) 
       rotateX(${targetRotationX}rad) 
       rotateY(${targetRotationY}rad) 
       translateX(${position.x}px) 
       translateY(${position.y}px)
       ${isFlipped ? 'rotateY(180deg)' : ''}`;
  }, [mousePosition, rotation, position, isFlipped, isMouseOver]);
  
  // Animation loop for physics
  const animate = () => {
    setRotation(prev => ({
      x: prev.x * DAMPENING,
      y: prev.y * DAMPENING
    }));
    
    setVelocity(prev => ({
      x: prev.x * INERTIA_FACTOR,
      y: prev.y * INERTIA_FACTOR
    }));
    
    setPosition(prev => {
      // Apply velocity to position
      const newX = prev.x + velocity.x * 10;
      const newY = prev.y + velocity.y * 10;
      
      // Check if card is too far from center and notify parent
      const isOffCenter = Math.abs(newX) > 150 || Math.abs(newY) > 150;
      onOffCenter(isOffCenter);
      
      return { x: newX, y: newY };
    });
    
    // Continue animation if there's still significant movement
    if (
      Math.abs(velocity.x) > 0.001 || 
      Math.abs(velocity.y) > 0.001 ||
      Math.abs(rotation.x) > 0.001 || 
      Math.abs(rotation.y) > 0.001
    ) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
    }
  };
  
  const startAnimation = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };
  
  const stopAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      setIsAnimating(false);
    }
  };
  
  const resetCardPosition = () => {
    // Smoothly animate card back to center
    const resetAnimation = () => {
      setPosition(prev => ({
        x: prev.x * (1 - RESET_SPEED),
        y: prev.y * (1 - RESET_SPEED)
      }));
      
      setRotation({
        x: 0,
        y: 0
      });
      
      setVelocity({
        x: 0,
        y: 0
      });
      
      // Continue until we're close enough to center
      if (Math.abs(position.x) > 0.5 || Math.abs(position.y) > 0.5) {
        animationFrameRef.current = requestAnimationFrame(resetAnimation);
      } else {
        setPosition({ x: 0, y: 0 });
        onOffCenter(false);
      }
    };
    
    // Stop any existing animation and start reset
    stopAnimation();
    animationFrameRef.current = requestAnimationFrame(resetAnimation);
  };
  
  // Handle flipping animation
  const flipStyle = isFlipped ? {
    transform: 'rotateY(180deg)',
  } : {};
  
  // Calculate card aspect ratio based on standard trading card dimensions
  const aspectRatio = 63/88; // Standard trading card ratio

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{ perspective: '1200px' }}
    >
      <div 
        ref={cardRef}
        className="relative w-[280px] h-[392px] transition-transform duration-300 ease-out transform-style-preserve-3d"
        style={{ 
          transformStyle: 'preserve-3d',
          aspectRatio: `1/${1/aspectRatio}`,
          ...flipStyle
        }}
      >
        {/* Card Front */}
        <div 
          className="absolute inset-0 backface-hidden rounded-lg overflow-hidden shadow-xl"
          style={{ 
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d'
          }}
        >
          <img 
            src={card.imageUrl} 
            alt={card.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Effects layer (front) */}
          <div className="absolute inset-0 pointer-events-none transform-style-preserve-3d">
            {children}
          </div>
        </div>
        
        {/* Card Back */}
        <div 
          className="absolute inset-0 bg-[#1b3d6d] backface-hidden rounded-lg overflow-hidden shadow-xl bg-card-pattern border border-white/10"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="w-full h-full p-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-[85%] p-4">
              <div className="mx-auto w-32 h-32 mb-3 bg-white/10 rounded-full flex items-center justify-center">
                <span className="font-bold text-3xl text-white/60">
                  {card.title?.charAt(0) || 'C'}
                </span>
              </div>
              
              <h3 className="text-white text-lg font-medium text-center mb-2">
                {card.title}
              </h3>
              
              {card.description && (
                <p className="text-white/70 text-sm text-center">
                  {card.description.length > 100
                    ? `${card.description.substring(0, 100)}...`
                    : card.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card3DRenderer;
