
import React from 'react';
import { Button } from '@/components/ui/button';

// Define DEFAULT_COLORS in the component file itself to avoid import errors
const DEFAULT_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#F87171', // Red
  '#FB923C', // Orange
  '#FBBF24', // Amber
  '#34D399', // Green
  '#22D3EE', // Cyan
  '#60A5FA', // Blue
  '#818CF8', // Indigo
  '#A78BFA', // Violet
  '#E879F9', // Pink
];

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ColorPicker({
  color,
  onChange,
  className = '',
  title = 'Select color',
  size = 'md',
}: ColorPickerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleOpenNativeColorPicker = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = color;
    input.addEventListener('input', (e) => {
      onChange((e.target as HTMLInputElement).value);
    });
    input.click();
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {DEFAULT_COLORS.map((colorOption) => (
        <Button
          key={colorOption}
          type="button"
          variant="ghost"
          className={`p-1 rounded-full ${sizeClasses[size]} ${color === colorOption ? 'ring-2 ring-offset-1' : ''}`}
          style={{ backgroundColor: colorOption }}
          onClick={() => onChange(colorOption)}
          title={title}
        />
      ))}
      <Button
        type="button"
        variant="ghost"
        className={`p-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 ${sizeClasses[size]}`}
        onClick={handleOpenNativeColorPicker}
        title="Custom color"
      />
    </div>
  );
}
