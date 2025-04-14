import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EffectControlsProps {
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
  spectralIntensity: number;
  onMotionSpeedChange: (value: number) => void;
  onPulseIntensityChange: (value: number) => void;
  onShimmerSpeedChange: (value: number) => void;
  onGoldIntensityChange: (value: number) => void;
  onChromeIntensityChange: (value: number) => void;
  onVintageIntensityChange: (value: number) => void;
  onRefractorIntensityChange: (value: number) => void;
  onSpectralIntensityChange: (value: number) => void;
}

const EffectControls: React.FC<EffectControlsProps> = ({
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
  spectralIntensity,
  onMotionSpeedChange,
  onPulseIntensityChange,
  onShimmerSpeedChange,
  onGoldIntensityChange,
  onChromeIntensityChange,
  onVintageIntensityChange,
  onRefractorIntensityChange,
  onSpectralIntensityChange
}) => {
  const [combinationName, setCombinationName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-0 h-[calc(100%-4rem)] w-80 bg-gray-900/95 backdrop-blur-md text-white z-30 shadow-lg transition-transform duration-300 transform-gpu overflow-y-auto">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Advanced Controls</h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Base motion controls */}
          <div>
            <h4 className="text-gray-300 mb-4 pb-2 border-b border-gray-800">Base Motion</h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Motion Speed</span>
                  <span className="text-xs text-gray-400">{Math.round(motionSpeed * 100)}%</span>
                </div>
                <Slider
                  value={[motionSpeed * 100]}
                  max={100}
                  step={1}
                  onValueChange={handleMotionSpeedChange}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Pulse Intensity</span>
                  <span className="text-xs text-gray-400">{Math.round(pulseIntensity * 100)}%</span>
                </div>
                <Slider
                  value={[pulseIntensity * 100]}
                  max={100}
                  step={1}
                  onValueChange={handlePulseIntensityChange}
                />
              </div>
            </div>
          </div>
          
          {/* Effect specific controls */}
          {activeEffects.length > 0 && (
            <div>
              <h4 className="text-gray-300 mb-4 pb-2 border-b border-gray-800">Effect Parameters</h4>
              
              <div className="space-y-4">
                {activeEffects.includes('Shimmer') && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Shimmer Speed</span>
                      <span className="text-xs text-gray-400">{shimmerSpeed.toFixed(1)}s</span>
                    </div>
                    <Slider
                      value={[shimmerSpeed * 10]}
                      max={50}
                      step={1}
                      onValueChange={handleShimmerSpeedChange}
                    />
                  </div>
                )}
                
                {activeEffects.includes('Gold Foil') && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Gold Intensity</span>
                      <span className="text-xs text-gray-400">{Math.round(goldIntensity * 100)}%</span>
                    </div>
                    <Slider
                      value={[goldIntensity * 100]}
                      max={100}
                      step={1}
                      onValueChange={handleGoldIntensityChange}
                    />
                  </div>
                )}
                
                {activeEffects.includes('Chrome') && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Chrome Intensity</span>
                      <span className="text-xs text-gray-400">{Math.round(chromeIntensity * 100)}%</span>
                    </div>
                    <Slider
                      value={[chromeIntensity * 100]}
                      max={100}
                      step={1}
                      onValueChange={handleChromeIntensityChange}
                    />
                  </div>
                )}
                
                {activeEffects.includes('Vintage') && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Vintage Intensity</span>
                      <span className="text-xs text-gray-400">{Math.round(vintageIntensity * 100)}%</span>
                    </div>
                    <Slider
                      value={[vintageIntensity * 100]}
                      max={100}
                      step={1}
                      onValueChange={handleVintageIntensityChange}
                    />
                  </div>
                )}
                
                {activeEffects.includes('Refractor') && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Refractor Intensity</span>
                      <span className="text-xs text-gray-400">{Math.round(refractorIntensity * 100)}%</span>
                    </div>
                    <Slider
                      value={[refractorIntensity * 100]}
                      max={100}
                      step={1}
                      onValueChange={handleRefractorIntensityChange}
                    />
                  </div>
                )}
                
                {activeEffects.includes('Holographic') && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Holographic Intensity</span>
                      <span className="text-xs text-gray-400">{Math.round(spectralIntensity * 100)}%</span>
                    </div>
                    <Slider
                      value={[spectralIntensity * 100]}
                      max={100}
                      step={1}
                      onValueChange={handleSpectralIntensityChange}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Save combination */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <div className="flex flex-col space-y-3">
              <h4 className="text-sm font-medium">Save This Combination</h4>
              <Input
                placeholder="Enter a name for this preset"
                value={combinationName}
                onChange={(e) => setCombinationName(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
              <Button 
                onClick={() => {
                  if (combinationName.trim()) {
                    onSaveEffectsCombination(combinationName);
                    setCombinationName('');
                  }
                }}
                disabled={!combinationName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Preset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EffectControls;
