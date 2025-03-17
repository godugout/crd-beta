
import { useState, useRef, RefObject, useCallback, useEffect } from 'react';

interface AnimationSpeed {
  motion: number;
  pulse: number;
  shimmer: number;
  gold?: number;
  chrome?: number;
  vintage?: number;
  refractor?: number;
}

interface UseCardEffectsReturn {
  cardRef: RefObject<HTMLDivElement>;
  containerRef: RefObject<HTMLDivElement>;
  canvasRef: RefObject<HTMLDivElement>;
  isMoving: boolean;
  mousePosition: { x: number; y: number };
  handleCanvasMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
  setAnimationSpeed: (speeds: AnimationSpeed) => void;
}

export const useCardEffects = (): UseCardEffectsReturn => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationSpeed, setAnimationSpeedState] = useState<AnimationSpeed>({
    motion: 0.7, // Reduced from 1.0 for more subtle motion
    pulse: 0.8, // Reduced for more subtlety
    shimmer: 5.0, // Increased from 3.0 for slower shimmer
    gold: 0.8, // Reduced for more subtlety
    chrome: 0.8, // Reduced for more subtlety
    vintage: 0.8, // Reduced for more subtlety
    refractor: 1.0 // Default refractor intensity
  });

  // Handle mouse movement for canvas area (floating effect)
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate relative position (-1 to 1)
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    setMousePosition({ x: relativeX, y: relativeY });
    
    if (containerRef.current) {
      // Move container slightly based on mouse position, adjusted by motion speed
      // Reduced movement from 15px to 10px for more subtle effect
      const moveX = relativeX * 10 * animationSpeed.motion;
      const moveY = relativeY * 10 * animationSpeed.motion;
      containerRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  }, [animationSpeed.motion]);

  // Handle mouse movement for 3D effect on card
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !containerRef.current) return;
    
    setIsMoving(true);
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to center (values between -1 and 1)
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    // Reduced rotation from 20 to 15 degrees for more subtle effect
    const rotateY = relativeX * 15 * animationSpeed.motion;
    const rotateX = -relativeY * 15 * animationSpeed.motion;
    
    cardRef.current.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    
    // Add mouse position as CSS custom properties for refractor effect
    if (cardRef.current) {
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
      
      cardRef.current.style.setProperty('--mouse-x', `${mouseX}%`);
      cardRef.current.style.setProperty('--mouse-y', `${mouseY}%`);
    }
    
    // Adjust effects based on angle and mouse position for dynamic light effects
    if (cardRef.current) {
      // For holographic effects
      const shine = cardRef.current.querySelector('.card-holographic::before') as HTMLElement;
      if (shine) {
        const shinePositionX = 50 + relativeX * 50;
        shine.style.backgroundPosition = `${shinePositionX}% 0`;
      }
      
      // For refractor effects - update the animation play state and position
      const refractor = cardRef.current.querySelector('.card-refractor::before') as HTMLElement;
      if (refractor) {
        const refractorPositionX = 50 + relativeX * 60;
        refractor.style.backgroundPosition = `${refractorPositionX}% 0`;
      }
      
      // For gold foil effects
      const goldShine = cardRef.current.querySelector('.card-gold-foil::before') as HTMLElement;
      if (goldShine) {
        const goldShinePositionX = 50 + relativeX * 60;
        goldShine.style.backgroundPosition = `${goldShinePositionX}% 0`;
      }
      
      // For chrome effects
      const chromeShine = cardRef.current.querySelector('.card-chrome::before') as HTMLElement;
      if (chromeShine) {
        const chromeShinePositionX = 50 + relativeX * 70;
        chromeShine.style.backgroundPosition = `${chromeShinePositionX}% 0`;
      }
    }
  }, [animationSpeed.motion]);

  // Reset card position when mouse leaves, but with a smoother transition
  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      setIsMoving(false);
      cardRef.current.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)'; // Added easing
      cardRef.current.style.transform = '';
      // Reset transition after animation completes
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = '';
        }
      }, 800);
    }
    
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)'; // Added easing
      containerRef.current.style.transform = '';
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = '';
        }
      }, 800);
    }
  }, []);

  // Update animation speeds with new effect parameters
  const setAnimationSpeed = useCallback((speeds: AnimationSpeed) => {
    setAnimationSpeedState(prev => ({
      ...prev,
      ...speeds
    }));
    
    // Apply CSS variables to document root
    const root = document.documentElement;
    root.style.setProperty('--motion-speed', speeds.motion.toString());
    root.style.setProperty('--pulse-intensity', speeds.pulse.toString());
    root.style.setProperty('--shimmer-speed', `${speeds.shimmer}s`);
    
    if (speeds.gold !== undefined) {
      root.style.setProperty('--gold-intensity', speeds.gold.toString());
    }
    
    if (speeds.chrome !== undefined) {
      root.style.setProperty('--chrome-intensity', speeds.chrome.toString());
    }
    
    if (speeds.vintage !== undefined) {
      root.style.setProperty('--vintage-intensity', speeds.vintage.toString());
    }
    
    if (speeds.refractor !== undefined) {
      root.style.setProperty('--refractor-intensity', speeds.refractor.toString());
      // Also update the refractor animation speed
      root.style.setProperty('--refractor-speed', `${5 - speeds.refractor * 2}s`);
    }
  }, []);

  // Initialize with default values
  useEffect(() => {
    setAnimationSpeed({
      motion: 0.7,
      pulse: 0.8,
      shimmer: 5.0,
      gold: 0.8,
      chrome: 0.8,
      vintage: 0.8,
      refractor: 1.0
    });
  }, []);

  return {
    cardRef,
    containerRef,
    canvasRef,
    isMoving,
    mousePosition,
    handleCanvasMouseMove,
    handleMouseMove,
    handleMouseLeave,
    setAnimationSpeed
  };
};
