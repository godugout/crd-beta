import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import Card3DRenderer from '../card-viewer/Card3DRenderer';
import CssEffectsLayer from '../card-effects/CssEffectsLayer';
import { Button } from '@/components/ui/button';
import { useCardLighting } from '@/hooks/useCardLighting';
import { FALLBACK_IMAGE_URL } from '@/lib/utils/cardDefaults';
import { LightingProvider } from '@/context/LightingContext';
import DynamicLighting from '../card-viewer/DynamicLighting';

interface ImmersiveCardViewerProps {
  card: Card;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
  initialFlipped?: boolean;
}

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  activeEffects = [],
  effectIntensities = {},
  initialFlipped = false
}) => {
  const [isFlipped, setIsFlipped] = useState(initialFlipped);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [use3D, setUse3D] = useState(true);
  const [framesSinceLastRender, setFramesSinceLastRender] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lightingSettings } = useCardLighting('studio');
  const frameRate = useRef<number[]>([]);
  const lastFrameTime = useRef(Date.now());
  const [averageFPS, setAverageFPS] = useState(60);
  const [cssOnly, setCssOnly] = useState(false);
  
  const updatePerformanceMetrics = () => {
    const now = Date.now();
    const delta = now - lastFrameTime.current;
    lastFrameTime.current = now;
    
    if (delta > 0) {
      const fps = 1000 / delta;
      frameRate.current.push(fps);
      
      if (frameRate.current.length > 60) {
        frameRate.current.shift();
      }
      
      const average = frameRate.current.reduce((sum, fps) => sum + fps, 0) / frameRate.current.length;
      setAverageFPS(Math.round(average));
      
      if (average < 25 && use3D && frameRate.current.length >= 30) {
        setCssOnly(true);
        setUse3D(false);
        toast.info("Switched to performance mode for better experience");
      }
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };
  
  // Ensure card has proper fallback images
  const cardWithFallback = {
    ...card,
    imageUrl: card.imageUrl || FALLBACK_IMAGE_URL,
    backImageUrl: card.backImageUrl || '/card-back-texture.jpg' // Use consistent fallback
  };
  
  const toggleRenderMode = () => {
    setCssOnly(!cssOnly);
    setUse3D(cssOnly);
    toast.info(`Switched to ${!cssOnly ? 'performance' : '3D'} mode`);
  };
  
  // Clean up WebGL context to prevent memory leaks
  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        const gl = canvasRef.current.getContext('webgl2') || canvasRef.current.getContext('webgl');
        if (gl) {
          const loseContext = gl.getExtension('WEBGL_lose_context');
          if (loseContext) loseContext.loseContext();
        }
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <LightingProvider>
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: '#111' }}
          frameloop={framesSinceLastRender > 60 ? 'demand' : 'always'}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          gl={{ 
            powerPreference: 'high-performance',
            antialias: false,
            alpha: false,
            stencil: false,
            depth: true
          }}
        >
          <DynamicLighting />
          
          <Suspense fallback={null}>
            <Card3DRenderer 
              card={cardWithFallback}
              isFlipped={isFlipped} 
              activeEffects={activeEffects}
              effectIntensities={effectIntensities}
              lightingPreset={lightingSettings.environmentType}
              onRenderFrame={updatePerformanceMetrics}
            />
          </Suspense>
          
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={8}
            autoRotate={false}
          />
        </Canvas>
      </LightingProvider>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        <Button 
          className="px-4 py-2 bg-gray-800/70 text-white rounded-full hover:bg-gray-700/90 transition"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {isFlipped ? 'Show Front' : 'Show Back'}
        </Button>
        
        <Button 
          className="px-4 py-2 bg-gray-800/70 text-white rounded-full hover:bg-gray-700/90 transition"
          onClick={toggleRenderMode}
        >
          {cssOnly ? '3D Mode' : 'Performance Mode'}
        </Button>
      </div>
      
      <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
        {averageFPS} FPS {cssOnly ? '(CSS)' : '(3D)'}
      </div>
    </div>
  );
};

export default ImmersiveCardViewer;
