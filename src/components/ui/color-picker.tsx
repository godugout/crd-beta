
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  id?: string;
  label?: string;
  colors?: string[];
}

export interface MobileTouchButtonProps {
  children?: React.ReactNode;
  type: 'button';
  variant: string;
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
  title?: string;
  hapticFeedback?: boolean;
}

const MobileTouchButton: React.FC<MobileTouchButtonProps> = ({
  children,
  ...props
}) => {
  return <button {...props}>{children}</button>;
};

export function ColorPicker({ color, onChange, className, id, label, colors = DEFAULT_COLORS }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(color || '#000000');

  useEffect(() => {
    setSelectedColor(color || '#000000');
  }, [color]);

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    onChange(newColor);
  };

  const DEFAULT_COLORS = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FF9900', '#9900FF',
    '#9999FF', '#99FF99', '#FF9999', '#B8860B', '#800000'
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn("w-full flex items-center justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded border"
              style={{ backgroundColor: selectedColor }}
            />
            {label ? <span>{label}</span> : <span>{selectedColor}</span>}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((colorOption) => (
            <MobileTouchButton
              key={colorOption}
              type="button"
              variant="ghost"
              className={cn(
                "h-8 w-8 rounded-full border",
                selectedColor === colorOption && "ring-2 ring-primary"
              )}
              style={{ backgroundColor: colorOption }}
              onClick={() => handleColorChange(colorOption)}
              title={colorOption}
              hapticFeedback={true}
            >
              {selectedColor === colorOption && (
                <span className="sr-only">Selected</span>
              )}
            </MobileTouchButton>
          ))}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm mb-1">Custom Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-8 h-8"
            />
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 text-xs p-2 border rounded"
              pattern="^#([A-Fa-f0-9]{6})$"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Export both as default and named export for compatibility
export default ColorPicker;
