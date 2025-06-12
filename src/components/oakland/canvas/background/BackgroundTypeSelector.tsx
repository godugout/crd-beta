
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mountain, Palette } from 'lucide-react';
import { BackgroundSettings } from '../BackgroundSelector';

interface BackgroundTypeSelectorProps {
  selectedType: BackgroundSettings['type'];
  onTypeChange: (type: BackgroundSettings['type']) => void;
}

const BackgroundTypeSelector: React.FC<BackgroundTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-gray-300 text-sm font-medium">Background Type</Label>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant={selectedType === 'preset' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('preset')}
          className={selectedType === 'preset' 
            ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-yellow-400" 
            : "border-gray-600 text-gray-300 hover:bg-gray-800"
          }
        >
          <Mountain className="h-3 w-3 mr-1" />
          HDR
        </Button>
        <Button
          variant={selectedType === 'gradient' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('gradient')}
          className={selectedType === 'gradient' 
            ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-yellow-400" 
            : "border-gray-600 text-gray-300 hover:bg-gray-800"
          }
        >
          <Palette className="h-3 w-3 mr-1" />
          Gradient
        </Button>
        <Button
          variant={selectedType === 'solid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('solid')}
          className={selectedType === 'solid' 
            ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-yellow-400" 
            : "border-gray-600 text-gray-300 hover:bg-gray-800"
          }
        >
          Solid
        </Button>
      </div>
    </div>
  );
};

export default BackgroundTypeSelector;
