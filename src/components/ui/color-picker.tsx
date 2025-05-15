
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  preset?: boolean;
}

const PRESET_COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#e53e3e', // Red
  '#dd6b20', // Orange
  '#d69e2e', // Yellow
  '#38a169', // Green
  '#3182ce', // Blue
  '#805ad5', // Purple
  '#d53f8c', // Pink
  '#718096', // Gray
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  onChange, 
  className,
  preset = true
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside the color picker
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
      setShowColorPicker(false);
    }
  }, []);
  
  // Add and remove event listener for clicks
  useEffect(() => {
    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker, handleClickOutside]);
  
  // Toggle color picker visibility
  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };
  
  return (
    <div className={cn("relative", className)} ref={colorPickerRef}>
      {/* Color display */}
      <div 
        className="h-8 w-full rounded-md border cursor-pointer flex items-center"
        onClick={toggleColorPicker}
      >
        <div 
          className="h-full aspect-square rounded-l-md border-r"
          style={{ backgroundColor: color }}
        />
        <span className="px-3 text-sm">{color}</span>
      </div>
      
      {/* Color picker popup */}
      {showColorPicker && (
        <div className="absolute top-full mt-1 left-0 bg-white rounded-md border shadow-lg p-3 z-50 w-full">
          {/* Color input */}
          <div className="mb-3">
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8"
            />
          </div>
          
          {/* Presets */}
          {preset && (
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  className={cn(
                    "w-6 h-6 rounded-full border", 
                    color === presetColor && "ring-2 ring-primary"
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    onChange(presetColor);
                    setShowColorPicker(false);
                  }}
                  title={presetColor}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Export both as default and named export
export default ColorPicker;
