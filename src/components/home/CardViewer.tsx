
import React, { useState, useEffect } from 'react';
import { CardData } from '@/types/card';
import { toast } from 'sonner';
import './CardEffects.css';
import CardCanvas from './card-viewer/CardCanvas';
import CardControls from './card-viewer/CardControls';
import EffectControls from './card-viewer/EffectControls';
import EffectsPresets, { EffectPreset } from './card-viewer/EffectsPresets';
import { useCardEffects } from './card-viewer/useCardEffects';

interface CardViewerProps {
  card: CardData;
  isFlipped: boolean;
  flipCard: () => void;
  onBackToCollection: () => void;
  activeEffects: string[];
  onSnapshot: () => void;
}

// Define built-in presets
const BUILT_IN_PRESETS: EffectPreset[] = [
  {
    id: 'premium-sports',
    name: 'Premium Sports Card',
    description: 'High-end look for sports collectors',
    effects: ['Gold Foil', 'Refractor'],
    settings: {
      motionSpeed: 1.2,
      pulseIntensity: 1.0,
      shimmerSpeed: 3.0,
      goldIntensity: 1.3,
      chromeIntensity: 1.0,
      vintageIntensity: 1.0
    },
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'vintage-collector',
    name: 'Vintage Collector',
    description: 'Classic aged appearance for retro cards',
    effects: ['Vintage'],
    settings: {
      motionSpeed: 0.8,
      pulseIntensity: 1.0,
      shimmerSpeed: 3.0,
      goldIntensity: 1.0,
      chromeIntensity: 1.0,
      vintageIntensity: 1.5
    },
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'modern-showcase',
    name: 'Modern Showcase',
    description: 'Bold and vibrant modern card style',
    effects: ['Chrome', 'Electric'],
    settings: {
      motionSpeed: 1.5,
      pulseIntensity: 1.2,
      shimmerSpeed: 3.0,
      goldIntensity: 1.0,
      chromeIntensity: 1.4,
      vintageIntensity: 1.0
    },
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'limited-edition',
    name: 'Limited Edition',
    description: 'Premium look for special releases',
    effects: ['Prismatic', 'Gold Foil'],
    settings: {
      motionSpeed: 1.3,
      pulseIntensity: 1.0,
      shimmerSpeed: 3.0,
      goldIntensity: 1.2,
      chromeIntensity: 1.0,
      vintageIntensity: 1.0
    },
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'holographic-deluxe',
    name: 'Holographic Deluxe',
    description: 'Shimmering rainbow effect for premium cards',
    effects: ['Classic Holographic', 'Prismatic'],
    settings: {
      motionSpeed: 1.0,
      pulseIntensity: 1.0,
      shimmerSpeed: 4.0,
      goldIntensity: 1.0,
      chromeIntensity: 1.0,
      vintageIntensity: 1.0
    },
    thumbnail: '/placeholder.svg'
  }
];

const CardViewer = ({ 
  card, 
  isFlipped, 
  flipCard, 
  onBackToCollection, 
  activeEffects,
  onSnapshot
}: CardViewerProps) => {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [showPresetsPanel, setShowPresetsPanel] = useState(false);
  const [motionSpeed, setMotionSpeed] = useState(1.0);
  const [pulseIntensity, setPulseIntensity] = useState(1.0);
  const [shimmerSpeed, setShimmerSpeed] = useState(3.0);
  const [goldIntensity, setGoldIntensity] = useState(1.0);
  const [chromeIntensity, setChromeIntensity] = useState(1.0);
  const [vintageIntensity, setVintageIntensity] = useState(1.0);
  const [userPresets, setUserPresets] = useState<EffectPreset[]>([]);
  const [builtInPresets, setBuiltInPresets] = useState<EffectPreset[]>(
    BUILT_IN_PRESETS.map(preset => ({ ...preset, isFavorite: false }))
  );

  const { 
    cardRef,
    containerRef,
    canvasRef,
    isMoving,
    handleCanvasMouseMove,
    handleMouseMove,
    handleMouseLeave,
    setAnimationSpeed
  } = useCardEffects();

  useEffect(() => {
    // Update animation speeds when controls change
    setAnimationSpeed({
      motion: motionSpeed,
      pulse: pulseIntensity,
      shimmer: shimmerSpeed,
      gold: goldIntensity,
      chrome: chromeIntensity,
      vintage: vintageIntensity
    });
  }, [
    motionSpeed, 
    pulseIntensity, 
    shimmerSpeed, 
    goldIntensity, 
    chromeIntensity, 
    vintageIntensity, 
    setAnimationSpeed
  ]);
  
  const handleSnapshot = () => {
    onSnapshot();
    toast.success('Snapshot captured!', {
      description: 'Effect combination saved to gallery'
    });
  };

  const toggleAdvancedControls = () => {
    setShowAdvancedControls(prev => !prev);
    if (showPresetsPanel) setShowPresetsPanel(false);
  };

  const togglePresetsPanel = () => {
    setShowPresetsPanel(prev => !prev);
    if (showAdvancedControls) setShowAdvancedControls(false);
  };

  const handleMotionSpeedChange = (value: number[]) => {
    setMotionSpeed(value[0]);
  };

  const handlePulseIntensityChange = (value: number[]) => {
    setPulseIntensity(value[0]);
  };

  const handleShimmerSpeedChange = (value: number[]) => {
    setShimmerSpeed(value[0]);
  };

  const handleGoldIntensityChange = (value: number[]) => {
    setGoldIntensity(value[0]);
  };

  const handleChromeIntensityChange = (value: number[]) => {
    setChromeIntensity(value[0]);
  };

  const handleVintageIntensityChange = (value: number[]) => {
    setVintageIntensity(value[0]);
  };

  const handleSaveEffectsCombination = (name: string) => {
    const newPreset: EffectPreset = {
      id: `user-${Date.now()}`,
      name,
      description: `Custom combination with ${activeEffects.length} effects`,
      effects: [...activeEffects],
      settings: {
        motionSpeed,
        pulseIntensity,
        shimmerSpeed,
        goldIntensity,
        chromeIntensity,
        vintageIntensity
      },
      thumbnail: '', // Could be a screenshot of the card with effects
      isFavorite: false
    };

    setUserPresets(prev => [newPreset, ...prev]);
    toast.success('Effect combination saved!', {
      description: `"${name}" added to your presets library`
    });
  };

  const handleApplyPreset = (preset: EffectPreset) => {
    // TODO: Update this to handle setting the card effects
    // This would need to be connected to the parent component
    // that manages the activeEffects state
    
    // For now, we'll just update the local controls
    setMotionSpeed(preset.settings.motionSpeed);
    setPulseIntensity(preset.settings.pulseIntensity);
    setShimmerSpeed(preset.settings.shimmerSpeed);
    setGoldIntensity(preset.settings.goldIntensity);
    setChromeIntensity(preset.settings.chromeIntensity);
    setVintageIntensity(preset.settings.vintageIntensity);
    
    toast.success(`"${preset.name}" applied!`, {
      description: `Effects combination applied to the current card`
    });
  };

  const handleToggleFavorite = (presetId: string) => {
    // Handle both built-in and user presets
    if (presetId.startsWith('user-')) {
      setUserPresets(prev => 
        prev.map(preset => 
          preset.id === presetId 
            ? { ...preset, isFavorite: !preset.isFavorite } 
            : preset
        )
      );
    } else {
      setBuiltInPresets(prev => 
        prev.map(preset => 
          preset.id === presetId 
            ? { ...preset, isFavorite: !preset.isFavorite } 
            : preset
        )
      );
    }
  };

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-96 md:h-[500px] flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden"
      onMouseMove={handleCanvasMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic background */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
      
      {/* Card container with 3D perspective */}
      <div 
        ref={containerRef}
        className={`card-3d-container relative w-80 h-[450px] flex items-center justify-center transition-transform duration-200 ${isMoving ? 'mouse-move' : 'dynamic-card floating-card'}`}
        onMouseMove={handleMouseMove}
        style={{
          '--motion-speed': `${motionSpeed}`,
          '--pulse-intensity': `${pulseIntensity}`,
          '--shimmer-speed': `${shimmerSpeed}s`,
          '--gold-intensity': `${goldIntensity}`,
          '--chrome-intensity': `${chromeIntensity}`,
          '--vintage-intensity': `${vintageIntensity}`
        } as React.CSSProperties}
      >
        {/* Card representation */}
        <CardCanvas 
          card={card}
          isFlipped={isFlipped}
          activeEffects={activeEffects}
          containerRef={containerRef}
          cardRef={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      
      {/* Controls */}
      <CardControls 
        flipCard={flipCard}
        onBackToCollection={onBackToCollection}
        onSnapshot={handleSnapshot}
        activeEffectsCount={activeEffects.length}
        onToggleAdvancedControls={toggleAdvancedControls}
        showAdvancedControls={showAdvancedControls}
        onTogglePresetsPanel={togglePresetsPanel}
        showPresetsPanel={showPresetsPanel}
      />

      {/* Advanced Effect Controls */}
      <EffectControls 
        isOpen={showAdvancedControls}
        motionSpeed={motionSpeed}
        pulseIntensity={pulseIntensity}
        shimmerSpeed={shimmerSpeed}
        goldIntensity={goldIntensity}
        chromeIntensity={chromeIntensity}
        vintageIntensity={vintageIntensity}
        onClose={() => setShowAdvancedControls(false)}
        onMotionSpeedChange={handleMotionSpeedChange}
        onPulseIntensityChange={handlePulseIntensityChange}
        onShimmerSpeedChange={handleShimmerSpeedChange}
        onGoldIntensityChange={handleGoldIntensityChange}
        onChromeIntensityChange={handleChromeIntensityChange}
        onVintageIntensityChange={handleVintageIntensityChange}
        onSaveEffectsCombination={handleSaveEffectsCombination}
        activeEffects={activeEffects}
      />

      {/* Effects Presets Panel */}
      <EffectsPresets
        isOpen={showPresetsPanel}
        onClose={() => setShowPresetsPanel(false)}
        presets={builtInPresets}
        userPresets={userPresets}
        onApplyPreset={handleApplyPreset}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

export default CardViewer;
