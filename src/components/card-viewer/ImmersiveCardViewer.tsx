
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useProgress, Html } from '@react-three/drei';
import { Card } from '@/lib/types';
import Card3DRenderer from './Card3DRenderer';
import CardMetadataPanel from './CardMetadataPanel';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, RefreshCw, Sparkles, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

// Loading indicator for Suspense fallback
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
        <p className="mt-4 text-white text-lg font-medium">
          Loading {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}

interface ImmersiveCardViewerProps {
  card: Card;
  onClose?: () => void;
}

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({ card, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({
    Holographic: 0.7,
    Refractor: 0.5,
    Chrome: 0.6,
    Vintage: 0.4
  });
  
  // Track render container for fullscreen
  const containerRef = useRef<HTMLDivElement>(null);

  // Available effects
  const availableEffects = [
    { id: 'Holographic', label: 'Holographic' },
    { id: 'Refractor', label: 'Refractor' },
    { id: 'Chrome', label: 'Chrome' },
    { id: 'Vintage', label: 'Vintage' }
  ];

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        toast.error('Could not enter fullscreen mode');
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Monitor fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Toggle card flip animation
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    toast.info(`Showing card ${isFlipped ? 'front' : 'back'}`);
  };

  // Toggle metadata display
  const toggleMetadata = () => {
    setShowMetadata(!showMetadata);
    toast.info(showMetadata ? 'Metadata hidden' : 'Metadata displayed');
  };

  // Toggle effects on/off
  const toggleEffect = (effectId: string) => {
    setActiveEffects(prev => {
      if (prev.includes(effectId)) {
        return prev.filter(id => id !== effectId);
      } else {
        return [...prev, effectId];
      }
    });
  };

  // Update effect intensity
  const updateEffectIntensity = (effectId: string, intensity: number[]) => {
    setEffectIntensities(prev => ({
      ...prev,
      [effectId]: intensity[0]
    }));
  };

  // Log that the component has mounted with the current card
  useEffect(() => {
    console.log('ImmersiveCardViewer mounted with card:', card);
  }, [card]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px] bg-gray-900 overflow-hidden rounded-lg">
      {/* 3D Canvas with improved lighting and environment */}
      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={[0x0a0a0a]} />
        
        {/* Camera with optimal positioning */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        
        {/* Environmental lighting for realistic card rendering */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
        <spotLight position={[-10, -10, 10]} angle={0.15} penumbra={1} intensity={0.3} />
        
        {/* Environment for reflections */}
        <Environment preset="city" />
        
        {/* Interactive controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
          autoRotateSpeed={1}
        />
        
        {/* Card renderer with Suspense for proper loading */}
        <Suspense fallback={<Loader />}>
          <Card3DRenderer
            card={card}
            isFlipped={isFlipped}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
          />
          
          {/* Metadata panel that can be toggled */}
          <CardMetadataPanel
            card={card}
            isVisible={showMetadata}
          />
        </Suspense>
      </Canvas>

      {/* Control panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-4 flex flex-col">
        {/* Card thumbnail and info */}
        <div className="flex mb-4">
          <div className="w-16 h-24 mr-3">
            <img 
              src={card.imageUrl || '/images/card-placeholder.png'} 
              alt={card.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">{card.title}</h3>
            {card.player && <p className="text-gray-300 text-sm">{card.player}</p>}
            {card.team && <p className="text-gray-300 text-sm">{card.team}</p>}
          </div>
        </div>
        
        {/* Effects controls */}
        <div>
          <h4 className="text-white font-medium mb-2">Visual Effects</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableEffects.map((effect) => (
              <div key={effect.id}>
                <div className="flex items-center mb-1">
                  <Button
                    size="sm"
                    variant={activeEffects.includes(effect.id) ? "default" : "outline"}
                    className={`w-full ${activeEffects.includes(effect.id) ? "" : "text-gray-300"}`}
                    onClick={() => toggleEffect(effect.id)}
                  >
                    <Sparkles className="mr-1 h-4 w-4" />
                    {effect.label}
                  </Button>
                </div>
                
                {activeEffects.includes(effect.id) && (
                  <div className="px-2">
                    <Slider
                      value={[effectIntensities[effect.id] || 0.5]}
                      min={0}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => updateEffectIntensity(effect.id, value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top right controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button 
          variant="outline" 
          size="icon"
          className="bg-black/30 text-white hover:bg-black/50"
          onClick={handleFlip}
          title="Flip Card"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          className="bg-black/30 text-white hover:bg-black/50"
          onClick={toggleMetadata}
          title="Show Card Metadata"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          className="bg-black/30 text-white hover:bg-black/50"
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        
        {onClose && (
          <Button 
            variant="outline" 
            size="icon"
            className="bg-black/30 text-white hover:bg-black/50"
            onClick={onClose}
            title="Close Viewer"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Keyboard shortcuts help */}
      <div className="absolute bottom-4 right-4 z-20 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-xs max-w-xs">
        <h4 className="font-medium mb-2">Keyboard Controls:</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div><kbd className="bg-gray-800 px-1 rounded">F</kbd> <span className="ml-1">Flip card</span></div>
          <div><kbd className="bg-gray-800 px-1 rounded">D</kbd> <span className="ml-1">Show diagnostics</span></div>
          <div><kbd className="bg-gray-800 px-1 rounded">M</kbd> <span className="ml-1">Show metadata</span></div>
          <div><kbd className="bg-gray-800 px-1 rounded">ESC</kbd> <span className="ml-1">Close fullscreen</span></div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveCardViewer;
