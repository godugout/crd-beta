
// This is just a placeholder since we didn't see the original EffectControlPanel.tsx
// You'll need to integrate the holographic controls with your existing component

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import RefractorControls from './RefractorControls';
import HolographicControls from './HolographicControls';

interface EffectControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEffectsCombination: (name: string) => void;
  activeEffects: string[];
  motionSpeed: number;
  pulseIntensity: number;
  shimmerSpeed: number;
  goldIntensity: number;
  chromeIntensity: number;
  vintageIntensity: number;
  refractorIntensity: number;
  refractorSpeed?: number;
  refractorColors?: string[];
  refractorAngle?: number;
  refractorAnimationEnabled?: boolean;
  spectralIntensity?: number;
  holographicIntensity?: number;
  holographicPattern?: string;
  holographicColorMode?: string;
  holographicCustomColors?: string[];
  holographicSparklesEnabled?: boolean;
  holographicBorderWidth?: number;
  showRefractorControls: boolean;
  showHolographicControls: boolean;
  onMotionSpeedChange: (value: number[]) => void;
  onPulseIntensityChange: (value: number[]) => void;
  onShimmerSpeedChange: (value: number[]) => void;
  onGoldIntensityChange: (value: number[]) => void;
  onChromeIntensityChange: (value: number[]) => void;
  onVintageIntensityChange: (value: number[]) => void;
  onRefractorIntensityChange: (value: number[]) => void;
  onRefractorSpeedChange?: (value: number[]) => void;
  onRefractorAnimationToggle?: (enabled: boolean) => void;
  onRefractorColorChange?: (colorIndex: number, color: string) => void;
  onRefractorAngleChange?: (value: number[]) => void;
  onSpectralIntensityChange?: (value: number[]) => void;
  onHolographicIntensityChange?: (value: number[]) => void;
  onHolographicPatternChange?: (pattern: string) => void;
  onHolographicColorModeChange?: (mode: string) => void;
  onHolographicCustomColorChange?: (colorIndex: number, color: string) => void;
  onHolographicSparklesToggle?: (enabled: boolean) => void;
  onHolographicBorderWidthChange?: (value: number[]) => void;
  activeColorIndex: number | null;
  onActiveColorChange: (index: number | null) => void;
  activeHolographicColorIndex?: number | null;
  onActiveHolographicColorChange?: (index: number | null) => void;
}

const EffectControlPanel: React.FC<EffectControlPanelProps> = ({
  isOpen,
  onClose,
  onSaveEffectsCombination,
  activeEffects,
  // Basic effects
  motionSpeed,
  pulseIntensity,
  shimmerSpeed,
  goldIntensity,
  chromeIntensity,
  vintageIntensity,
  // Refractor effects
  refractorIntensity,
  refractorSpeed = 1,
  refractorColors = [],
  refractorAngle,
  refractorAnimationEnabled = true,
  // Spectral effect
  spectralIntensity = 1,
  // Holographic effects
  holographicIntensity = 0.8,
  holographicPattern = 'linear',
  holographicColorMode = 'rainbow',
  holographicCustomColors = ['#ff0080', '#00ffff', '#ffff00'],
  holographicSparklesEnabled = true,
  holographicBorderWidth = 1,
  // Control visibility
  showRefractorControls,
  showHolographicControls,
  // Event handlers for basic effects
  onMotionSpeedChange,
  onPulseIntensityChange,
  onShimmerSpeedChange,
  onGoldIntensityChange,
  onChromeIntensityChange,
  onVintageIntensityChange,
  // Event handlers for refractor effects
  onRefractorIntensityChange,
  onRefractorSpeedChange = () => {},
  onRefractorAnimationToggle = () => {},
  onRefractorColorChange = () => {},
  onRefractorAngleChange = () => {},
  // Event handler for spectral effect
  onSpectralIntensityChange = () => {},
  // Event handlers for holographic effects
  onHolographicIntensityChange = () => {},
  onHolographicPatternChange = () => {},
  onHolographicColorModeChange = () => {},
  onHolographicCustomColorChange = () => {},
  onHolographicSparklesToggle = () => {},
  onHolographicBorderWidthChange = () => {},
  // Color picker states
  activeColorIndex,
  onActiveColorChange,
  activeHolographicColorIndex = null,
  onActiveHolographicColorChange = () => {}
}) => {
  const [effectsName, setEffectsName] = useState("");
  const [activeTab, setActiveTab] = useState("base");
  
  const handleSave = () => {
    if (effectsName.trim()) {
      onSaveEffectsCombination(effectsName.trim());
      setEffectsName("");
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[350px] sm:w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Effects Controls</SheetTitle>
        </SheetHeader>
        
        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="base">Base Effects</TabsTrigger>
              {showRefractorControls && <TabsTrigger value="refractor">Refractor</TabsTrigger>}
              {showHolographicControls && <TabsTrigger value="holographic">Holographic</TabsTrigger>}
            </TabsList>
            
            {/* Base effects controls */}
            <TabsContent value="base" className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="motion-speed" className="text-sm font-medium">Motion Speed</Label>
                  <span className="text-xs text-muted-foreground">{motionSpeed.toFixed(1)}</span>
                </div>
                <Slider 
                  id="motion-speed" 
                  value={[motionSpeed]} 
                  min={0.1} 
                  max={2.0} 
                  step={0.1} 
                  onValueChange={onMotionSpeedChange} 
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="shimmer-speed" className="text-sm font-medium">Shimmer Speed</Label>
                  <span className="text-xs text-muted-foreground">{shimmerSpeed.toFixed(1)}</span>
                </div>
                <Slider 
                  id="shimmer-speed" 
                  value={[shimmerSpeed]} 
                  min={1} 
                  max={10} 
                  step={0.5} 
                  onValueChange={onShimmerSpeedChange} 
                />
              </div>

              {activeEffects.includes('Electric') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pulse-intensity" className="text-sm font-medium">Pulse Intensity</Label>
                    <span className="text-xs text-muted-foreground">{pulseIntensity.toFixed(1)}</span>
                  </div>
                  <Slider 
                    id="pulse-intensity" 
                    value={[pulseIntensity]} 
                    min={0.1} 
                    max={2} 
                    step={0.1} 
                    onValueChange={onPulseIntensityChange} 
                  />
                </div>
              )}

              {activeEffects.includes('Gold Foil') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gold-intensity" className="text-sm font-medium">Gold Intensity</Label>
                    <span className="text-xs text-muted-foreground">{goldIntensity.toFixed(1)}</span>
                  </div>
                  <Slider 
                    id="gold-intensity" 
                    value={[goldIntensity]} 
                    min={0.1} 
                    max={2} 
                    step={0.1} 
                    onValueChange={onGoldIntensityChange} 
                  />
                </div>
              )}

              {activeEffects.includes('Chrome') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chrome-intensity" className="text-sm font-medium">Chrome Intensity</Label>
                    <span className="text-xs text-muted-foreground">{chromeIntensity.toFixed(1)}</span>
                  </div>
                  <Slider 
                    id="chrome-intensity" 
                    value={[chromeIntensity]} 
                    min={0.1} 
                    max={2} 
                    step={0.1} 
                    onValueChange={onChromeIntensityChange} 
                  />
                </div>
              )}

              {activeEffects.includes('Vintage') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="vintage-intensity" className="text-sm font-medium">Vintage Intensity</Label>
                    <span className="text-xs text-muted-foreground">{vintageIntensity.toFixed(1)}</span>
                  </div>
                  <Slider 
                    id="vintage-intensity" 
                    value={[vintageIntensity]} 
                    min={0.1} 
                    max={2} 
                    step={0.1} 
                    onValueChange={onVintageIntensityChange} 
                  />
                </div>
              )}

              {activeEffects.includes('Spectral') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="spectral-intensity" className="text-sm font-medium">Spectral Intensity</Label>
                    <span className="text-xs text-muted-foreground">{spectralIntensity.toFixed(1)}</span>
                  </div>
                  <Slider 
                    id="spectral-intensity" 
                    value={[spectralIntensity]} 
                    min={0.1} 
                    max={2} 
                    step={0.1} 
                    onValueChange={onSpectralIntensityChange} 
                  />
                </div>
              )}
            </TabsContent>
            
            {/* Refractor effect controls */}
            {showRefractorControls && (
              <TabsContent value="refractor" className="space-y-6">
                <RefractorControls 
                  intensity={refractorIntensity}
                  speed={refractorSpeed}
                  colors={refractorColors}
                  angle={refractorAngle || 0}
                  animationEnabled={refractorAnimationEnabled}
                  onIntensityChange={onRefractorIntensityChange}
                  onSpeedChange={onRefractorSpeedChange}
                  onAnimationToggle={onRefractorAnimationToggle}
                  onColorChange={onRefractorColorChange}
                  onAngleChange={onRefractorAngleChange}
                  activeColorIndex={activeColorIndex}
                  onActiveColorChange={onActiveColorChange}
                />
              </TabsContent>
            )}
            
            {/* Holographic effect controls */}
            {showHolographicControls && (
              <TabsContent value="holographic" className="space-y-6">
                <HolographicControls 
                  intensity={holographicIntensity}
                  pattern={holographicPattern}
                  colorMode={holographicColorMode}
                  customColors={holographicCustomColors}
                  sparklesEnabled={holographicSparklesEnabled}
                  borderWidth={holographicBorderWidth}
                  onIntensityChange={onHolographicIntensityChange}
                  onPatternChange={onHolographicPatternChange}
                  onColorModeChange={onHolographicColorModeChange}
                  onCustomColorChange={onHolographicCustomColorChange}
                  onSparklesToggle={onHolographicSparklesToggle}
                  onBorderWidthChange={onHolographicBorderWidthChange}
                  activeColorIndex={activeHolographicColorIndex || null}
                  onActiveColorChange={onActiveHolographicColorChange}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <div className="pt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="effects-name" className="text-sm font-medium">Save Effect Combination</Label>
            <div className="flex gap-2">
              <Input 
                id="effects-name" 
                value={effectsName} 
                onChange={(e) => setEffectsName(e.target.value)}
                placeholder="Enter a name for this combination"
              />
              <Button onClick={handleSave} disabled={!effectsName.trim()}>Save</Button>
            </div>
          </div>
          
          <div className="pt-2">
            <SheetClose asChild>
              <Button variant="outline" className="w-full">Close</Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EffectControlPanel;
