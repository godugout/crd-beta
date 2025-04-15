
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  id?: string;
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  id, 
  color, 
  onChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(color);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setInputValue(color);
  }, [color]);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputValue(newColor);
    onChange(newColor);
  };
  
  const parseColorInput = (input: string): string => {
    // Check if the input is a valid hex color
    const hexRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;
    if (hexRegex.test(input)) {
      return input;
    }
    
    // Check if the input is a valid rgb/rgba color
    const rgbRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*\d*\.?\d+\s*)?\)$/;
    if (rgbRegex.test(input)) {
      return input;
    }
    
    // Default fallback color
    return '#000000';
  };
  
  const handleInputBlur = () => {
    const validColor = parseColorInput(inputValue);
    setInputValue(validColor);
    onChange(validColor);
  };
  
  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080',
    '#800000', '#808000', '#008000', '#800080', '#008080',
  ];
  
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          id={id}
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleColorChange}
          onBlur={handleInputBlur}
          className="w-full"
          placeholder="#000000 or rgba(0,0,0,0)"
        />
      </div>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-10 p-0 border-2"
            style={{ backgroundColor: color }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div>
            <div className="mb-2">
              <Input
                type="color"
                value={color.startsWith('#') ? color : '#000000'} 
                onChange={handleColorChange}
                className="w-full h-8"
              />
            </div>
            
            <div className="grid grid-cols-5 gap-2 mt-3">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    onChange(presetColor);
                    setInputValue(presetColor);
                    setIsOpen(false);
                  }}
                  aria-label={`Color ${presetColor}`}
                />
              ))}
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                size="sm" 
                className="w-full"
                onClick={() => {
                  onChange('rgba(0, 0, 0, 0)');
                  setInputValue('rgba(0, 0, 0, 0)');
                  setIsOpen(false);
                }}
              >
                Transparent
              </Button>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
