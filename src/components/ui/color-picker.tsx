
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface ColorPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  value?: string; // For compatibility
  onChange: (color: string) => void;
  presetColors?: string[];
  label?: string;
  id?: string;
}

const DEFAULT_COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#ff0000', // Red
  '#00ff00', // Green
  '#0000ff', // Blue
  '#ffff00', // Yellow
  '#ff00ff', // Magenta
  '#00ffff', // Cyan
  '#ff8800', // Orange
  '#8800ff', // Purple
  '#0088ff', // Sky Blue
  '#88ff00', // Lime
];

export function ColorPicker({
  color,
  value,
  onChange,
  presetColors = DEFAULT_COLORS,
  label,
  id,
  className,
  ...props
}: ColorPickerProps) {
  // Use value prop if color is not provided (for compatibility)
  const currentColor = color || value || '#000000';
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handlePresetClick = (presetColor: string) => {
    onChange(presetColor);
  };

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            id={id}
            type="color"
            value={currentColor}
            onChange={handleColorChange}
            className="sr-only"
          />
          <div 
            className="w-8 h-8 rounded border border-gray-200 cursor-pointer" 
            style={{ backgroundColor: currentColor }}
            onClick={() => document.getElementById(id || 'color-picker')?.click()}
          />
        </div>
        <input
          type="text"
          value={currentColor}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-2 py-1 text-xs border border-gray-200 rounded"
        />
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {presetColors.map((presetColor) => (
          <div
            key={presetColor}
            className={`w-6 h-6 rounded cursor-pointer ${
              presetColor === currentColor ? 'ring-2 ring-offset-1 ring-black' : ''
            }`}
            style={{ backgroundColor: presetColor }}
            onClick={() => handlePresetClick(presetColor)}
          />
        ))}
      </div>
    </div>
  );
}
