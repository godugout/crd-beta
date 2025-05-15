
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

// Define a type for recent colors
type RecentColor = {
  id: string;
  value: string;
};

// Define props for the ColorPicker component
export interface ColorPickerProps {
  color: string; // Currently selected color
  onChange: (color: string) => void; // Callback when color changes
  id?: string; // Optional ID for the input
  value?: string; // Optional alias for color
  label?: string; // Optional label for the picker
  className?: string; // Additional classes
  colors?: string[]; // Optional predefined colors
  allowTransparent?: boolean; // Whether to allow transparent color selection
}

// Common colors for picker
const DEFAULT_COLORS = [
  '#000000', '#FFFFFF', '#F44336', '#E91E63', '#9C27B0',
  '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
  '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
  '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E',
  '#607D8B',
];

export function ColorPicker({
  color,
  onChange,
  id,
  value,
  label,
  className,
  colors = DEFAULT_COLORS,
  allowTransparent = false,
}: ColorPickerProps) {
  // Use either provided color or value prop
  const currentColor = value || color;
  
  // State for storing recently used colors
  const [recentColors, setRecentColors] = useState<RecentColor[]>([]);

  // Handle color selection
  const handleColorChange = (newColor: string) => {
    onChange(newColor);
    
    // Add to recent colors if not already there
    if (!recentColors.some(rc => rc.value === newColor)) {
      setRecentColors(prev => [
        { id: `recent-${Date.now()}`, value: newColor },
        ...prev.slice(0, 5) // Keep only the 6 most recent colors
      ]);
    }
  };

  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className="w-full justify-start text-left font-normal h-10"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border border-gray-200"
                style={{ backgroundColor: currentColor }}
              />
              <span>{currentColor}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-5 gap-1">
              {colors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={cn(
                    "h-6 w-6 rounded-md border border-gray-200",
                    colorOption === currentColor && "ring-2 ring-gray-800"
                  )}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => handleColorChange(colorOption)}
                  aria-label={`Select color ${colorOption}`}
                />
              ))}
            </div>
            
            {recentColors.length > 0 && (
              <>
                <div className="my-1 border-t" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Recent</span>
                  <div className="grid grid-cols-5 gap-1">
                    {recentColors.map((rc) => (
                      <button
                        key={rc.id}
                        type="button"
                        className={cn(
                          "h-6 w-6 rounded-md border border-gray-200",
                          rc.value === currentColor && "ring-2 ring-gray-800"
                        )}
                        style={{ backgroundColor: rc.value }}
                        onClick={() => handleColorChange(rc.value)}
                        aria-label={`Select color ${rc.value}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {allowTransparent && (
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={() => handleColorChange('transparent')}
              >
                Transparent
              </Button>
            )}
            
            <div className="mt-2 flex items-center">
              <input
                type="color"
                value={currentColor === 'transparent' ? '#ffffff' : currentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-8 w-8 cursor-pointer appearance-none overflow-hidden rounded-md border border-gray-200"
              />
              <input
                type="text"
                value={currentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="ml-2 flex-1 rounded-md border border-gray-200 px-2 py-1 text-xs"
                placeholder="#RRGGBB"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
