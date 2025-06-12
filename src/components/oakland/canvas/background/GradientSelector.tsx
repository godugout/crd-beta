
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GRADIENT_PRESETS } from './constants';
import { BackgroundSettings } from '../BackgroundSelector';

interface GradientSelectorProps {
  onGradientChange: (gradient: { from: string; to: string; direction: string }) => void;
}

const GradientSelector: React.FC<GradientSelectorProps> = ({
  onGradientChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-gray-300 text-sm font-medium">Gradient Style</Label>
      <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
        {GRADIENT_PRESETS.map((gradient) => (
          <Button
            key={gradient.name}
            variant="outline"
            size="sm"
            onClick={() => onGradientChange({ 
              from: gradient.from, 
              to: gradient.to, 
              direction: 'diagonal' 
            })}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 justify-start text-xs"
          >
            <div 
              className="w-4 h-4 rounded mr-2"
              style={{ 
                background: `linear-gradient(45deg, ${gradient.from}, ${gradient.to})` 
              }}
            />
            {gradient.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GradientSelector;
