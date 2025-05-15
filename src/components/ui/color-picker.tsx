
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  preset?: boolean;
  colors?: string[];
  id?: string;
  value?: string; // For compatibility with ThemeCustomizer
  label?: string;
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
  preset = true,
  colors = PRESET_COLORS,
  id,
  value, // For ThemeCustomizer compatibility
  label
}) => {
  // If value is provided (for backward compatibility with ThemeCustomizer), use it instead of color
  const actualColor = value || color;
  
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

  // Handle onChange calls whether coming as color or value
  const handleChange = (newColor: string) => {
    onChange(newColor);
  };
  
  return (
    <div className={cn("relative", className)} ref={colorPickerRef}>
      {label && <span className="text-sm block mb-1">{label}</span>}
      
      {/* Color display */}
      <div 
        className="h-8 w-full rounded-md border cursor-pointer flex items-center"
        onClick={toggleColorPicker}
      >
        <div 
          className="h-full aspect-square rounded-l-md border-r"
          style={{ backgroundColor: actualColor }}
        />
        <span className="px-3 text-sm">{actualColor}</span>
      </div>
      
      {/* Color picker popup */}
      {showColorPicker && (
        <div className="absolute top-full mt-1 left-0 bg-white rounded-md border shadow-lg p-3 z-50 w-full">
          {/* Color input */}
          <div className="mb-3">
            <input
              id={id}
              type="color"
              value={actualColor}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-8"
            />
          </div>
          
          {/* Presets */}
          {preset && (
            <div className="grid grid-cols-5 gap-2">
              {colors.map((presetColor, index) => (
                <button
                  key={`${presetColor}-${index}`}
                  type="button"
                  className={cn(
                    "w-6 h-6 rounded-full border", 
                    actualColor === presetColor && "ring-2 ring-primary"
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    handleChange(presetColor);
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
