
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

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
  showRefractorControls?: boolean;
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
  activeColorIndex?: number | null;
  onActiveColorChange?: (index: number | null) => void;
}

const EffectControlPanel: React.FC<EffectControlPanelProps> = ({
  isOpen,
  onClose,
  onSaveEffectsCombination,
  activeEffects,
  motionSpeed,
  pulseIntensity,
  shimmerSpeed,
  goldIntensity,
  chromeIntensity,
  vintageIntensity,
  refractorIntensity,
  refractorSpeed = 1.0,
  refractorColors = ['rgba(255, 0, 128, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(255, 255, 0, 0.2)'],
  refractorAngle,
  refractorAnimationEnabled = true,
  spectralIntensity = 1.0,
  showRefractorControls = false,
  onMotionSpeedChange,
  onPulseIntensityChange,
  onShimmerSpeedChange,
  onGoldIntensityChange,
  onChromeIntensityChange,
  onVintageIntensityChange,
  onRefractorIntensityChange,
  onRefractorSpeedChange = () => {},
  onRefractorAnimationToggle = () => {},
  onRefractorColorChange = () => {},
  onRefractorAngleChange = () => {},
  onSpectralIntensityChange = () => {},
  activeColorIndex = null,
  onActiveColorChange = () => {}
}) => {
  const [presetName, setPresetName] = useState('');

  // Format percentage for display
  const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <div className={`fixed inset-y-0 right-0 w-64 md:w-80 bg-white shadow-lg z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Effect Controls</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* General Motion Controls */}
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-2">Card Motion</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="motionSpeed">Motion Speed</Label>
                <span className="text-xs text-gray-500">{formatPercentage(motionSpeed)}</span>
              </div>
              <Slider 
                id="motionSpeed"
                min={0.1} 
                max={2} 
                step={0.1} 
                value={[motionSpeed]} 
                onValueChange={onMotionSpeedChange} 
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="pulseIntensity">Pulse Intensity</Label>
                <span className="text-xs text-gray-500">{formatPercentage(pulseIntensity)}</span>
              </div>
              <Slider 
                id="pulseIntensity"
                min={0} 
                max={1} 
                step={0.05} 
                value={[pulseIntensity]} 
                onValueChange={onPulseIntensityChange} 
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="shimmerSpeed">Shimmer Speed</Label>
                <span className="text-xs text-gray-500">{formatPercentage(shimmerSpeed)}</span>
              </div>
              <Slider 
                id="shimmerSpeed"
                min={0.1} 
                max={2} 
                step={0.1} 
                value={[shimmerSpeed]} 
                onValueChange={onShimmerSpeedChange} 
              />
            </div>
          </div>
        </div>

        {/* Effect-specific controls */}
        {activeEffects.includes('Gold Foil') && (
          <div className="mb-6">
            <h4 className="font-medium text-sm mb-2">Gold Foil Effect</h4>
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="goldIntensity">Intensity</Label>
                <span className="text-xs text-gray-500">{formatPercentage(goldIntensity)}</span>
              </div>
              <Slider 
                id="goldIntensity"
                min={0.1} 
                max={1.5} 
                step={0.1} 
                value={[goldIntensity]} 
                onValueChange={onGoldIntensityChange} 
              />
            </div>
          </div>
        )}

        {activeEffects.includes('Chrome') && (
          <div className="mb-6">
            <h4 className="font-medium text-sm mb-2">Chrome Effect</h4>
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="chromeIntensity">Intensity</Label>
                <span className="text-xs text-gray-500">{formatPercentage(chromeIntensity)}</span>
              </div>
              <Slider 
                id="chromeIntensity"
                min={0.1} 
                max={1.5} 
                step={0.1} 
                value={[chromeIntensity]} 
                onValueChange={onChromeIntensityChange} 
              />
            </div>
          </div>
        )}

        {activeEffects.includes('Vintage') && (
          <div className="mb-6">
            <h4 className="font-medium text-sm mb-2">Vintage Effect</h4>
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="vintageIntensity">Intensity</Label>
                <span className="text-xs text-gray-500">{formatPercentage(vintageIntensity)}</span>
              </div>
              <Slider 
                id="vintageIntensity"
                min={0.1} 
                max={1.5} 
                step={0.1} 
                value={[vintageIntensity]} 
                onValueChange={onVintageIntensityChange} 
              />
            </div>
          </div>
        )}

        {/* Refractor Effect Controls */}
        {showRefractorControls && (
          <div className="mb-6">
            <h4 className="font-medium text-sm mb-2">Refractor Effect</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="refractorIntensity">Intensity</Label>
                  <span className="text-xs text-gray-500">{formatPercentage(refractorIntensity)}</span>
                </div>
                <Slider 
                  id="refractorIntensity"
                  min={0.1} 
                  max={2.0} 
                  step={0.1} 
                  value={[refractorIntensity]} 
                  onValueChange={onRefractorIntensityChange} 
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="refractorSpeed">Animation Speed</Label>
                  <span className="text-xs text-gray-500">{formatPercentage(refractorSpeed)}</span>
                </div>
                <Slider 
                  id="refractorSpeed"
                  min={0.2} 
                  max={3.0} 
                  step={0.1} 
                  value={[refractorSpeed]} 
                  onValueChange={onRefractorSpeedChange} 
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="refractorAnimation">Animation</Label>
                  <Switch 
                    id="refractorAnimation" 
                    checked={refractorAnimationEnabled}
                    onCheckedChange={onRefractorAnimationToggle}
                  />
                </div>
              </div>

              {refractorAngle !== undefined && (
                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="refractorAngle">Angle</Label>
                    <span className="text-xs text-gray-500">{Math.round(refractorAngle)}°</span>
                  </div>
                  <Slider 
                    id="refractorAngle"
                    min={0} 
                    max={360} 
                    step={5} 
                    value={[refractorAngle]} 
                    onValueChange={onRefractorAngleChange} 
                  />
                </div>
              )}

              <div>
                <Label className="mb-2 block">Colors</Label>
                <div className="flex space-x-2 mb-2">
                  {refractorColors.map((color, index) => (
                    <div 
                      key={index}
                      onClick={() => onActiveColorChange(index)}
                      style={{ 
                        backgroundColor: color,
                        border: activeColorIndex === index ? '2px solid black' : '1px solid #ccc'
                      }}
                      className="w-8 h-8 rounded-full cursor-pointer"
                    />
                  ))}
                </div>
                
                {activeColorIndex !== null && (
                  <Input
                    type="color"
                    value={refractorColors[activeColorIndex].startsWith('rgba') 
                      ? rgbaToHex(refractorColors[activeColorIndex]) 
                      : refractorColors[activeColorIndex]}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      onRefractorColorChange(activeColorIndex, newColor);
                    }}
                    className="w-full h-8"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {activeEffects.includes('Spectral') && (
          <div className="mb-6">
            <h4 className="font-medium text-sm mb-2">Spectral Effect</h4>
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="spectralIntensity">Intensity</Label>
                <span className="text-xs text-gray-500">{formatPercentage(spectralIntensity)}</span>
              </div>
              <Slider 
                id="spectralIntensity"
                min={0.1} 
                max={1.5} 
                step={0.1} 
                value={[spectralIntensity]} 
                onValueChange={onSpectralIntensityChange} 
              />
            </div>
          </div>
        )}

        {/* Save Preset Section */}
        <div className="mt-8">
          <h4 className="font-medium text-sm mb-2">Save Effects Combination</h4>
          <div className="flex space-x-2">
            <Input
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              onClick={() => {
                if (presetName) {
                  onSaveEffectsCombination(presetName);
                  setPresetName('');
                }
              }}
              disabled={!presetName.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert RGBA to HEX
const rgbaToHex = (rgba: string): string => {
  // Parse rgba format - rgba(r, g, b, a)
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/);
  if (!match) return '#000000';
  
  // Convert to hex
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  
  // Convert each color component to hex and ensure it's 2 digits
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export default EffectControlPanel;
