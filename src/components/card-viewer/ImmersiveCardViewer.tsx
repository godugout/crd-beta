import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import Card3DRenderer from './Card3DRenderer';
import CssEffectsLayer from '../card-effects/CssEffectsLayer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lightingSettings } = useCardLighting('studio');
  const frameCounterRef = useRef(0);
  const lastFrameTimeRef = useRef(Date.now());
  const [fps, setFps] = useState(60);
  const [showControls, setShowControls] = useState(true);
  const [qualityLevel, setQualityLevel] = useState<'high'|'medium'|'low'>('medium');
  
  const updatePerformanceStats = () => {
    const now = Date.now();
    const elapsed = now - lastFrameTimeRef.current;
    
    frameCounterRef.current++;
    if (frameCounterRef.current % 10 === 0) {
      if (elapsed > 0) {
        const currentFps = Math.round(1000 / (elapsed / 10));
        setFps(currentFps);
        
        if (currentFps < 30 && qualityLevel !== 'low') {
          setQualityLevel('low');
          console.log('Auto-switching to low quality mode for better performance');
        } else if (currentFps > 45 && currentFps < 55 && qualityLevel === 'high') {
          setQualityLevel('medium');
        } else if (currentFps > 58 && qualityLevel === 'low') {
          setQualityLevel('medium');
        }
      }
      lastFrameTimeRef.current = now;
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    if (frameCounterRef.current % 3 !== 0) return;
    
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
  
  const toggleQuality = () => {
    const levels: Array<'high'|'medium'|'low'> = ['high', 'medium', 'low'];
    const currentIndex = levels.indexOf(qualityLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    setQualityLevel(levels[nextIndex]);
    toast.info(`Quality set to ${levels[nextIndex]}`);
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
      ref={containerRef} 
      className="fixed inset-0 w-full h-full bg-black overflow-hidden" 
      onMouseMove={handleMouseMove}
    >
      {use3D ? (
        <Canvas
          ref={canvasRef}
          className="w-full h-full"
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, qualityLevel === 'high' ? 2 : qualityLevel === 'medium' ? 1.5 : 1]}
          frameloop={qualityLevel === 'low' ? 'demand' : 'always'}
          gl={{ 
            powerPreference: 'high-performance',
            antialias: qualityLevel !== 'low',
            alpha: false,
            stencil: false,
            depth: true,
            precision: qualityLevel === 'high' ? 'highp' : 'mediump'
          }}
          performance={{
            min: qualityLevel === 'low' ? 0.5 : qualityLevel === 'medium' ? 0.75 : 1
          }}
        >
          <ambientLight intensity={0.7} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1} 
            castShadow={qualityLevel === 'high'} 
          />
          
          <Suspense fallback={null}>
            <Card3DRenderer 
              card={cardWithFallback}
              isFlipped={isFlipped} 
              activeEffects={activeEffects}
              effectIntensities={effectIntensities}
              onRenderFrame={updatePerformanceStats}
              qualityLevel={qualityLevel}
            />
          </Suspense>
          
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={8}
            autoRotate={false}
            enableDamping={qualityLevel !== 'low'}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.75}
            minPolarAngle={Math.PI / 3}
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
                  src={cardWithFallback.backImageUrl} 
                  alt="Card Back" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={cn(
        "fixed top-0 left-0 right-0 p-4 transition-transform duration-300 z-10 bg-gradient-to-b from-black/50 to-transparent",
        showControls ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-semibold">{card.title || 'Untitled Card'}</h1>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {isFlipped ? 'Show Front' : 'Show Back'}
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={toggleQuality}
            >
              {qualityLevel.charAt(0).toUpperCase() + qualityLevel.slice(1)} Quality
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setShowControls(false)}
            >
              Hide Controls
            </Button>
          </div>
        </div>
      </div>

      {!showControls && (
        <Button
          className="fixed top-4 right-4 z-10 bg-black/50 hover:bg-black/70"
          onClick={() => setShowControls(true)}
        >
          Show Controls
        </Button>
      )}
      
      <div className="fixed top-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded z-20">
        {fps} FPS ({qualityLevel})
      </div>
    </div>
  );
};

export default ImmersiveCardViewer;
