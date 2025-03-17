import { useState, useRef, RefObject, useCallback, useEffect } from 'react';

interface AnimationSpeed {
  motion: number;
  pulse: number;
  shimmer: number;
  gold?: number;
  chrome?: number;
  vintage?: number;
  refractor?: number;
  spectral?: number;
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
    motion: 0.7,
    pulse: 0.8,
    shimmer: 5.0,
    gold: 0.8,
    chrome: 0.8,
    vintage: 0.8,
    refractor: 1.0,
    spectral: 0.7
  });

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    setMousePosition({ x: relativeX, y: relativeY });
    
    if (containerRef.current) {
      const moveX = relativeX * 10 * animationSpeed.motion;
      const moveY = relativeY * 10 * animationSpeed.motion;
      containerRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  }, [animationSpeed.motion]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !containerRef.current) return;
    
    setIsMoving(true);
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    const rotateY = relativeX * 15 * animationSpeed.motion;
    const rotateX = -relativeY * 15 * animationSpeed.motion;
    
    cardRef.current.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    
    if (cardRef.current) {
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
      
      cardRef.current.style.setProperty('--mouse-x', `${mouseX}%`);
      cardRef.current.style.setProperty('--mouse-y', `${mouseY}%`);
    }
    
    if (cardRef.current) {
      const shine = cardRef.current.querySelector('.card-holographic::before') as HTMLElement;
      if (shine) {
        const shinePositionX = 50 + relativeX * 50;
        shine.style.backgroundPosition = `${shinePositionX}% 0`;
      }
      
      const refractor = cardRef.current.querySelector('.card-refractor::before') as HTMLElement;
      if (refractor) {
        const refractorPositionX = 50 + relativeX * 60;
        refractor.style.backgroundPosition = `${refractorPositionX}% 0`;
      }
      
      const goldShine = cardRef.current.querySelector('.card-gold-foil::before') as HTMLElement;
      if (goldShine) {
        const goldShinePositionX = 50 + relativeX * 60;
        goldShine.style.backgroundPosition = `${goldShinePositionX}% 0`;
      }
      
      const chromeShine = cardRef.current.querySelector('.card-chrome::before') as HTMLElement;
      if (chromeShine) {
        const chromeShinePositionX = 50 + relativeX * 70;
        chromeShine.style.backgroundPosition = `${chromeShinePositionX}% 0`;
      }
    }
  }, [animationSpeed.motion]);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      setIsMoving(false);
      cardRef.current.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
      cardRef.current.style.transform = '';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = '';
        }
      }, 800);
    }
    
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
      containerRef.current.style.transform = '';
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = '';
        }
      }, 800);
    }
  }, []);

  const setAnimationSpeed = useCallback((speeds: AnimationSpeed) => {
    setAnimationSpeedState(prev => ({
      ...prev,
      ...speeds
    }));
    
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
      root.style.setProperty('--refractor-speed', `${5 - speeds.refractor * 2}s`);
    }
    
    if (speeds.spectral !== undefined) {
      root.style.setProperty('--hologram-intensity', speeds.spectral.toString());
    }
  }, []);

  useEffect(() => {
    setAnimationSpeed({
      motion: 0.7,
      pulse: 0.8,
      shimmer: 5.0,
      gold: 0.8,
      chrome: 0.8,
      vintage: 0.8,
      refractor: 1.0,
      spectral: 0.7
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
