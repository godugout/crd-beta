
import React from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  colors?: string[];
  className?: string;
}

export function ColorPicker({
  value,
  onChange,
  colors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
  className,
  ...props
}: ColorPickerProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} {...props}>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`Select color ${color}`}
          style={{ backgroundColor: color }}
          className={cn(
            'h-6 w-6 rounded-full cursor-pointer transition-all',
            value === color ? 'ring-2 ring-black dark:ring-white ring-offset-2' : 'hover:scale-110'
          )}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );
}
