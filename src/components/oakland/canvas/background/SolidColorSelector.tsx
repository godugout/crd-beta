
import React from 'react';
import { Label } from '@/components/ui/label';
import { SOLID_COLORS } from './constants';

interface SolidColorSelectorProps {
  selectedColor?: string;
  onColorChange: (color: string) => void;
}

const SolidColorSelector: React.FC<SolidColorSelectorProps> = ({
  selectedColor,
  onColorChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-gray-300 text-sm font-medium">Solid Color</Label>
      <div className="grid grid-cols-6 gap-2">
        {SOLID_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-8 h-8 rounded border-2 ${
              selectedColor === color ? 'border-[#EFB21E]' : 'border-gray-600'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default SolidColorSelector;
