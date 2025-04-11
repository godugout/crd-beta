
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  colors?: string[];
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <div className="flex gap-2 items-center">
        <div
          className="w-10 h-10 rounded-md border border-gray-200 cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
        />
        
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-1 text-sm"
          />
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 p-2 bg-white rounded-md shadow-md border border-gray-100">
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <Button
                key={color}
                type="button"
                className="w-8 h-8 rounded-md p-0 m-0 border border-gray-200"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                variant="ghost"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
