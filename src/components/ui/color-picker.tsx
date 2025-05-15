
import React from 'react';
import { Input } from './input';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  colors?: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, className = '', colors = [] }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10">
          <Input
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
