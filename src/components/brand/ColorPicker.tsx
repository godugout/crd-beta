
import React from 'react';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  id?: string;
  color: string;
  value?: never; // Explicitly disallow value prop to prevent misuse
  onChange: (color: string) => void;
  label?: string;
  className?: string;
  colors?: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  id,
  color,
  onChange,
  label,
  className = '',
  colors = []
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-sm">{label}</span>}
      
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10">
          <Input
            id={id}
            type="color"
            className="h-full"
            value={color}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <Input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {colors.map((preset, index) => (
            <button
              key={`${preset}-${index}`}
              className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
              style={{ backgroundColor: preset }}
              onClick={() => onChange(preset)}
              type="button"
              aria-label={`Color: ${preset}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
