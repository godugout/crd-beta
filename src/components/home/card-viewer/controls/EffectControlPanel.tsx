
import React from 'react';
import { X } from 'lucide-react';
import EffectSliders from './EffectSliders';
import SaveCombination from './SaveCombination';

interface EffectControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  motionSpeed: number;
  pulseIntensity: number;
  shimmerSpeed: number;
  goldIntensity: number;
  chromeIntensity: number;
  vintageIntensity: number;
  refractorIntensity: number;
  spectralIntensity: number;
  onMotionSpeedChange: (value: number[]) => void;
  onPulseIntensityChange: (value: number[]) => void;
  onShimmerSpeedChange: (value: number[]) => void;
  onGoldIntensityChange: (value: number[]) => void;
  onChromeIntensityChange: (value: number[]) => void;
  onVintageIntensityChange: (value: number[]) => void;
  onRefractorIntensityChange: (value: number[]) => void;
  onSpectralIntensityChange: (value: number[]) => void;
  onSaveEffectsCombination: (name: string) => void;
  activeEffects: string[];
}

const EffectControlPanel = ({
  isOpen,
  onClose,
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
  onSpectralIntensityChange,
  onSaveEffectsCombination,
  activeEffects
}: EffectControlPanelProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 right-4 w-72 bg-white rounded-lg shadow-lg p-4 animate-fade-in max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold">Advanced Controls</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <EffectSliders 
          motionSpeed={motionSpeed}
          pulseIntensity={pulseIntensity}
          shimmerSpeed={shimmerSpeed}
          goldIntensity={goldIntensity}
          chromeIntensity={chromeIntensity}
          vintageIntensity={vintageIntensity}
          refractorIntensity={refractorIntensity}
          spectralIntensity={spectralIntensity}
          onMotionSpeedChange={onMotionSpeedChange}
          onPulseIntensityChange={onPulseIntensityChange}
          onShimmerSpeedChange={onShimmerSpeedChange}
          onGoldIntensityChange={onGoldIntensityChange}
          onChromeIntensityChange={onChromeIntensityChange}
          onVintageIntensityChange={onVintageIntensityChange}
          onRefractorIntensityChange={onRefractorIntensityChange}
          onSpectralIntensityChange={onSpectralIntensityChange}
          activeEffects={activeEffects}
        />

        {/* Save Combination Section */}
        {activeEffects.length > 0 && (
          <SaveCombination onSave={onSaveEffectsCombination} />
        )}
      </div>
    </div>
  );
};

export default EffectControlPanel;
