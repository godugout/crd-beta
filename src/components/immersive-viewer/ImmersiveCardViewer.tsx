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
  
  const cardWithFallback = {
    ...card,
    imageUrl: card.imageUrl || FALLBACK_IMAGE_URL,
    backImageUrl: card.backImageUrl || '/card-back-texture.jpg'
  };
  
  const toggleRenderMode = () => {
    setCssOnly(!cssOnly);
    setUse3D(cssOnly);
    toast.info(`Switched to ${!cssOnly ? 'performance' : '3D'} mode`);
  };
  
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
    <div 
      className="w-full h-full relative" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {(!cssOnly && use3D) ? (
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
          <ambientLight intensity={0.7} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1} 
          />
          
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
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="relative w-64 h-96 perspective-800">
            <div 
              className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={cardWithFallback.imageUrl} 
                  alt={cardWithFallback.title || 'Card'} 
                  className="w-full h-full object-cover"
                />
                <CssEffectsLayer 
                  activeEffects={activeEffects}
                  effectIntensities={effectIntensities}
                  isFlipped={false}
                  mousePosition={mousePosition}
                />
              </div>
              
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg overflow-hidden shadow-xl bg-gray-800">
                <img 
                  src={cardWithFallback.backImageUrl || '/card-back-texture.jpg'} 
                  alt="Card Back" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
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
