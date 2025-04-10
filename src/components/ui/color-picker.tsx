
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
  colors = [
    '#FF7E33', // design-primary-500
    '#8970FF', // design-secondary-500
    '#10B981', // design-success-500
    '#F59E0B', // design-warning-500
    '#EF4444', // design-error-500
    '#6B7280', // design-neutral-500
    '#FFFFFF', 
    '#000000'
  ],
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
