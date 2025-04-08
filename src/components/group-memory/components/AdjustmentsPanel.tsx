
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Layers, Sun } from 'lucide-react';

interface AdjustmentsPanelProps {
  brightness: number;
  setBrightness: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
  rotation: number;
  setRotation: (value: number) => void;
  onEnhanceImage: () => void;
  onResetAdjustments: () => void;
}

const AdjustmentsPanel: React.FC<AdjustmentsPanelProps> = ({
  brightness,
  setBrightness,
  contrast,
  setContrast,
  rotation,
  setRotation,
  onEnhanceImage,
  onResetAdjustments
}) => {
  return (
    <>
      <h3 className="font-medium mb-4">Image Adjustments</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Brightness</span>
            <span>{brightness}%</span>
          </div>
          <Slider 
            value={[brightness]}
            min={50}
            max={150}
            step={1}
            onValueChange={(value) => setBrightness(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Contrast</span>
            <span>{contrast}%</span>
          </div>
          <Slider 
            value={[contrast]}
            min={50}
            max={150}
            step={1}
            onValueChange={(value) => setContrast(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Rotation</span>
            <span>{rotation}°</span>
          </div>
          <Slider 
            value={[rotation]}
            min={-180}
            max={180}
            step={1}
            onValueChange={(value) => setRotation(value[0])}
          />
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <Button 
          onClick={onEnhanceImage}
          className="w-full"
          variant="outline"
        >
          <Sun size={18} className="mr-2" />
          Auto-Enhance for Stadium Lighting
        </Button>
      </div>
    </>
  );
};

export default AdjustmentsPanel;
