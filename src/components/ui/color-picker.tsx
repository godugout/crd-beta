
import React from 'react';
import { Input } from './input';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
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
  );
};
