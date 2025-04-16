
import React, { useState, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
  presetColors?: string[];
}

const DEFAULT_COLORS = [
  '#000000', '#FFFFFF', 
  '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#00FFFF', '#FF00FF',
  '#C0C0C0', '#808080', '#800000', 
  '#808000', '#008000', '#800080', 
  '#008080', '#000080', 
  '#FF6B00', '#FFD700', '#006341', 
  '#EFB21E', '#0057B8', '#4F46E5'
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  id,
  presetColors = DEFAULT_COLORS
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value);
  const [customColor, setCustomColor] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setCurrentColor(value);
  }, [value]);
  
  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    onChange(color);
    setIsOpen(false);
  };
  
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };
  
  const applyCustomColor = () => {
    if (customColor) {
      handleColorChange(customColor);
    }
  };
  
  // Opacity color indicator with border if needed
  const needsBorder = currentColor.toLowerCase() === '#ffffff';
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className="w-full justify-between h-9"
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-5 h-5 rounded-md",
                needsBorder && "border border-gray-300"
              )}
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-sm">{label || currentColor}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color) => {
            const isSelected = color.toLowerCase() === currentColor.toLowerCase();
            const colorNeedsBorder = color.toLowerCase() === '#ffffff';
            return (
              <button
                key={color}
                className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center",
                  isSelected && "ring-2 ring-offset-2 ring-primary"
                )}
                onClick={() => handleColorChange(color)}
              >
                <div
                  className={cn(
                    "w-full h-full rounded-md",
                    colorNeedsBorder && "border border-gray-300"
                  )}
                  style={{ backgroundColor: color }}
                >
                  {isSelected && (
                    <Check
                      className={cn(
                        "h-4 w-4 mx-auto my-2",
                        color.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'
                      )}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 flex space-x-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="color"
                className="h-9 w-9 cursor-pointer rounded-md border"
                value={customColor || currentColor}
                onChange={handleCustomColorChange}
              />
              <input
                type="text"
                className="ml-2 flex-1 h-9 rounded-md border px-3 text-sm"
                placeholder="#HEX"
                value={customColor || currentColor}
                onChange={handleCustomColorChange}
              />
            </div>
          </div>
          <Button size="sm" onClick={applyCustomColor}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
