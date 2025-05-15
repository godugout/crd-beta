
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCardEffectsEngine } from '@/hooks/card-effects/useCardEffectsEngine';
import EffectsControlPanel from './EffectsControlPanel';
import { Badge } from '@/components/ui/badge';
import { CardEffect } from '@/lib/types/cardEffects';

interface CardEffectsDemoProps {
  cardImageUrl?: string;
}

const CardEffectsDemo: React.FC<CardEffectsDemoProps> = ({
  cardImageUrl = 'https://images.unsplash.com/photo-1546519638-68e109acd27d'
}) => {
  const { 
    engine, 
    activeEffects, 
    toggleEffect, 
    updateEffectSettings, 
    canvasRef, 
    cardRef 
  } = useCardEffectsEngine();
  
  const [presets, setPresets] = useState<{ id: string; name: string }[]>([
    { id: 'preset-premium', name: 'Premium' },
    { id: 'preset-vintage', name: 'Vintage' }
  ]);
  
  const [showDebug, setShowDebug] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  
  // Add mouse move handler for interactive effects
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // Update card rotation based on mouse position
      if (viewMode === '3d') {
        setRotation({
          x: (y - 0.5) * 20,
          y: (x - 0.5) * 20,
          z: 0
        });
      }
      
      // Update CSS variables for effects
      containerRef.current.style.setProperty('--mouse-x', x.toString());
      containerRef.current.style.setProperty('--mouse-y', y.toString());
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [viewMode]);
  
  // Add keydown handler for debug mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.shiftKey) {
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Handle saving presets
  const handleSavePreset = () => {
    const presetName = `Custom ${presets.length + 1}`;
    const presetId = engine.createPreset(presetName, activeEffects);
    
    setPresets(prev => [...prev, { id: presetId, name: presetName }]);
  };
  
  // Handle loading presets
  const handleLoadPreset = (presetId: string) => {
    const effectsFromPreset = engine.loadPreset(presetId);
    // No need to set active effects here as the engine hook handles this
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Card Visual Effects System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Preview */}
        <div className="space-y-4">
          <Card className="border shadow-lg">
            <CardContent className="p-0">
              <Tabs defaultValue="preview" className="w-full">
                <div className="border-b px-4">
                  <TabsList className="pb-0">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="webgl">WebGL</TabsTrigger>
                    <TabsTrigger value="code">Generated CSS</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="preview" className="pt-0 px-0">
                  <div className="aspect-[2.5/3.5] relative">
                    <div
                      ref={containerRef}
                      className="w-full h-full p-6 flex items-center justify-center perspective-1000"
                    >
                      {/* Card with effects */}
                      <div
                        ref={cardRef}
                        className="w-[250px] h-[350px] rounded-xl overflow-hidden shadow-lg relative preserve-3d"
                        style={{
                          transform: viewMode === '3d' 
                            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`
                            : 'none',
                          transition: 'transform 0.1s ease-out'
                        }}
                      >
                        {/* Card content */}
                        <img
                          src={cardImageUrl}
                          alt="Card"
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Effect overlays - these will be managed by the effect engine */}
                        <div className="absolute inset-0 pointer-events-none holographic-overlay"></div>
                        <div className="absolute inset-0 pointer-events-none prismatic-overlay"></div>
                        <div className="absolute inset-0 pointer-events-none metallic-overlay"></div>
                        
                        {/* Debug overlay */}
                        {showDebug && (
                          <div className="absolute top-0 left-0 bg-black/70 text-white text-xs p-2 font-mono max-w-full overflow-auto">
                            <div>Effects: {activeEffects.map(e => e.name).join(', ')}</div>
                            <div>Rot: X:{rotation.x.toFixed(1)}° Y:{rotation.y.toFixed(1)}°</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t flex justify-between items-center">
                    <div className="space-x-1">
                      {activeEffects.map(effect => (
                        <Badge key={effect.id} variant="secondary">
                          {effect.name}
                        </Badge>
                      ))}
                      {activeEffects.length === 0 && (
                        <span className="text-sm text-muted-foreground">No effects applied</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === '2d' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('2d')}
                      >
                        2D
                      </Button>
                      <Button
                        variant={viewMode === '3d' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('3d')}
                      >
                        3D
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="webgl" className="pt-0">
                  <div className="aspect-[2.5/3.5] relative">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full"
                      width={500}
                      height={700}
                    />
                  </div>
                  <div className="p-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      WebGL rendering provides hardware-accelerated effects with real-time performance.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="p-4">
                  <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md font-mono text-sm overflow-auto max-h-[400px]">
                    <pre>
                      {`/* Generated CSS for ${activeEffects.length} effect${activeEffects.length !== 1 ? 's' : ''} */\n`}
                      {activeEffects.map(effect => `
/* ${effect.name} Effect */
.effect-${effect.id.toLowerCase()} {
  --effect-intensity: ${effect.settings.intensity || 1};
  --effect-speed: ${effect.settings.speed || 1};
  --effect-color: ${effect.settings.color || '#ffffff'};
  
  /* Effect specific properties */
  ${getEffectCss(effect)}
}
                      `).join('\n')}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Effects Controls */}
        <div>
          <EffectsControlPanel
            availableEffects={Array.from(engine.effects.values())}
            activeEffects={activeEffects}
            onToggleEffect={toggleEffect}
            onUpdateEffectSettings={updateEffectSettings}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            presets={presets}
          />
        </div>
      </div>
    </div>
  );
};

// Helper function to generate example CSS for each effect
function getEffectCss(effect: CardEffect): string {
  switch (effect.id) {
    case 'holographic':
      return `  background: linear-gradient(
    135deg,
    hsla(0, 100%, 50%, var(--effect-intensity)),
    hsla(60, 100%, 50%, var(--effect-intensity)),
    hsla(120, 100%, 50%, var(--effect-intensity)),
    hsla(180, 100%, 50%, var(--effect-intensity)),
    hsla(240, 100%, 50%, var(--effect-intensity))
  );
  mix-blend-mode: overlay;
  opacity: ${(effect.settings.intensity || 1) * 0.6};
  animation: holographic-shift ${10 / (effect.settings.speed || 1)}s linear infinite;`;
      
    case 'prismatic':
      return `  background: repeating-conic-gradient(
    from calc(var(--mouse-x, 0.5) * 360deg),
    hsl(0, 100%, 60%),
    hsl(30, 100%, 60%),
    hsl(60, 100%, 60%),
    hsl(90, 100%, 60%),
    hsl(120, 100%, 60%),
    hsl(150, 100%, 60%),
    hsl(180, 100%, 60%),
    hsl(210, 100%, 60%),
    hsl(240, 100%, 60%),
    hsl(270, 100%, 60%),
    hsl(300, 100%, 60%),
    hsl(330, 100%, 60%),
    hsl(360, 100%, 60%)
  );
  background-size: ${(effect.settings.intensity || 1) * 50 + 100}%;
  mix-blend-mode: color-dodge;
  opacity: ${(effect.settings.intensity || 1) * 0.5};`;
      
    case 'metallic':
      return `  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.9) calc(var(--mouse-x, 0.5) * 100%),
    rgba(220, 220, 220, 0.5) calc(var(--mouse-x, 0.5) * 100% + 10%),
    rgba(170, 170, 170, 0.3)
  );
  mix-blend-mode: overlay;
  opacity: ${(effect.settings.intensity || 1) * 0.7};`;
      
    default:
      return '';
  }
}

// For the UI
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'default' | 'outline'; 
  size?: 'sm' | 'md';
}> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-primary text-white hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2'
  };
  
  return (
    <button
      className={`rounded-md font-medium transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CardEffectsDemo;
