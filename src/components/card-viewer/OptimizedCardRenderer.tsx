
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { convertEffectsToCSS } from '@/utils/effectUtils';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

// Performance settings presets
const QUALITY_PRESETS = {
  high: {
    shadowQuality: 'high',
    textureSize: 2048,
    reflectionQuality: 'high',
    effectDensity: 1.0,
    lighting: 'pbr'
  },
  medium: {
    shadowQuality: 'medium',
    textureSize: 1024,
    reflectionQuality: 'medium',
    effectDensity: 0.7,
    lighting: 'basic'
  },
  low: {
    shadowQuality: 'low',
    textureSize: 512,
    reflectionQuality: 'low',
    effectDensity: 0.4,
    lighting: 'minimal'
  }
};

interface OptimizedCardRendererProps {
  card: Card;
  isFlipped?: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
  onCapture?: () => void;
  onShare?: () => void;
  onClose?: () => void;
}

const OptimizedCardRenderer: React.FC<OptimizedCardRendererProps> = ({
  card,
  isFlipped = false,
  activeEffects = [],
  effectIntensities = {},
  fullscreen = false,
  onFullscreenToggle,
  onCapture,
  onShare,
  onClose
}) => {
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [qualityLevel, setQualityLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [zoom, setZoom] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameCountRef = useRef(0);
  const fpsRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const { toast } = useToast();

  // Detect device capabilities on mount and set appropriate quality level
  useEffect(() => {
    const detectPerformance = () => {
      // Simple device capability detection
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isOlderDevice = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : true;
      
      if (isMobile || isOlderDevice) {
        setQualityLevel('low');
      } else {
        const highEndDevice = navigator.hardwareConcurrency ? navigator.hardwareConcurrency >= 8 : false;
        setQualityLevel(highEndDevice ? 'high' : 'medium');
      }
      
      console.log(`Device performance detected: ${qualityLevel} (${navigator.hardwareConcurrency || 'unknown'} cores)`);
    };
    
    detectPerformance();
  }, []);

  // Monitor frame rate and adjust quality if needed
  useEffect(() => {
    let frameId: number;
    let frameCount = 0;
    let lastCheck = performance.now();
    
    const monitorPerformance = () => {
      frameCount++;
      const now = performance.now();
      const elapsed = now - lastCheck;
      
      // Calculate FPS every second
      if (elapsed >= 1000) {
        const fps = frameCount * 1000 / elapsed;
        fpsRef.current = fps;
        frameCount = 0;
        lastCheck = now;
        
        // Auto-adjust quality if performance is poor
        if (fps < 30 && qualityLevel !== 'low') {
          setQualityLevel('low');
          toast({
            title: 'Performance Optimization',
            description: 'Reducing visual quality for better performance'
          });
        } else if (fps > 55 && fps < 58 && qualityLevel === 'low') {
          setQualityLevel('medium');
        }
      }
      
      frameId = requestAnimationFrame(monitorPerformance);
    };
    
    frameId = requestAnimationFrame(monitorPerformance);
    return () => cancelAnimationFrame(frameId);
  }, [qualityLevel, toast]);

  // Generate effect styles based on active effects and quality presets
  const effectStyle = useMemo(() => {
    const intensity = QUALITY_PRESETS[qualityLevel].effectDensity;
    const effectStyles = convertEffectsToCSS ? 
      convertEffectsToCSS(activeEffects, effectIntensities, intensity) : '';
    
    return {
      filter: effectStyles || '',
      transition: 'transform 0.3s ease-out',
      transform: `
        perspective(1000px)
        rotateX(${rotation.x}deg)
        rotateY(${rotation.y}deg)
        rotateZ(${rotation.z}deg)
        scale(${zoom})
      `
    };
  }, [activeEffects, effectIntensities, rotation, zoom, qualityLevel]);

  const handleImageLoad = () => {
    setLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setImageError(true);
    toast({
      title: "Image failed to load",
      description: "Using fallback image",
      variant: "destructive"
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (containerRef.current) {
          const dx = (moveEvent.clientX - rect.left - startX) / 5;
          const dy = (moveEvent.clientY - rect.top - startY) / 5;
          
          setRotation(prev => ({
            x: prev.x - dy,
            y: prev.y + dx,
            z: prev.z
          }));
        }
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0, z: 0 });
    setZoom(1);
  };

  return (
    <div 
      className={`relative ${fullscreen ? 'h-screen' : 'h-full'} flex items-center justify-center overflow-hidden`}
      style={{
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: fullscreen ? '0' : '1rem',
      }}
    >
      {/* Performance stats (for development) */}
      <div className="absolute top-2 left-2 text-xs text-white/70 z-50 bg-black/30 px-2 py-1 rounded">
        Quality: {qualityLevel} • FPS: {Math.round(fpsRef.current)}
      </div>
      
      {/* Card container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{ 
          perspective: '1200px',
          cursor: 'grab' 
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Lighting effects - simplified to CSS gradients for better performance */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#202040] via-transparent to-[#101020] opacity-80"></div>
          <div className="absolute top-[10%] left-[25%] w-[200px] h-[200px] rounded-full blur-[80px] bg-white/20"></div>
          <div className="absolute bottom-[20%] right-[15%] w-[150px] h-[150px] rounded-full blur-[60px] bg-blue-500/10"></div>
        </div>
        
        {/* Card */}
        <div 
          ref={cardRef}
          className={`relative transition-all ${
            isFlipped ? 'rotate-y-180' : ''
          } ${loading ? 'opacity-0' : 'opacity-100'}`}
          style={{
            width: '280px',
            height: '400px', 
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front face */}
          <div 
            className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-2xl border border-white/10"
            style={{
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, rgba(30,30,50,0.8) 0%, rgba(10,10,25,0.9) 100%)',
              ...effectStyle
            }}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                <Spinner size="lg" />
              </div>
            )}
            
            <img
              src={card.imageUrl || ''}
              alt={card.title}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Card overlay for details */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="font-bold text-xl text-white">{card.title}</h3>
              {card.description && (
                <p className="text-sm text-white/80 line-clamp-2 mt-1">{card.description}</p>
              )}
            </div>
          </div>
          
          {/* Back face */}
          <div 
            className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-2xl border border-white/10 rotate-y-180"
            style={{
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, rgba(20,20,40,0.8) 0%, rgba(10,10,20,0.9) 100%)',
            }}
          >
            {card.backImageUrl ? (
              <img 
                src={card.backImageUrl} 
                alt={`${card.title} back`}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 p-4">
                <div className="text-center text-white/70">
                  <h3 className="font-bold mb-2">{card.title}</h3>
                  <p className="text-sm">Card back image not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-sm p-2 rounded-full">
        <Button variant="ghost" size="icon" className="text-white" onClick={handleZoomOut}>
          <ZoomOut size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" onClick={handleZoomIn}>
          <ZoomIn size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" onClick={resetView}>
          <RotateCw size={18} />
        </Button>
        {onFullscreenToggle && (
          <Button variant="ghost" size="icon" className="text-white" onClick={onFullscreenToggle}>
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
        )}
      </div>
      
      {/* Close button for fullscreen mode */}
      {fullscreen && onClose && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Button>
      )}
    </div>
  );
};

export default OptimizedCardRenderer;
