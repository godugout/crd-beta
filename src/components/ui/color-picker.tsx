
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileTouchButton } from './mobile-controls';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  label?: string;
  colors?: string[];
}

const ColorPicker = ({ 
  color, 
  onChange, 
  className, 
  title = 'Select color', 
  size = 'md',
  id,
  label,
  colors = []
}: ColorPickerProps) => {
  const isMobile = useIsMobile();
  
  // Determine sizes based on the size prop
  const sizesMap = {
    sm: { circle: 'w-5 h-5', container: 'gap-1' },
    md: { circle: 'w-6 h-6', container: 'gap-2' },
    lg: { circle: 'w-8 h-8', container: 'gap-3' }
  };
  
  const sizeClasses = sizesMap[size];

  return (
    <div className={cn("flex flex-wrap", sizeClasses.container, className)}>
      {/* Predefined color palette */}
      {colors.length > 0 && (
        <div className="flex gap-1 flex-wrap items-center">
          {colors.map((presetColor) => (
            isMobile ? (
              <MobileTouchButton
                key={presetColor}
                type="button"
                variant="ghost"
                className={cn(
                  sizeClasses.circle, 
                  "flex-shrink-0 rounded-full p-0 border",
                  color === presetColor ? 'ring-2 ring-blue-500' : 'border-gray-300'
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => onChange(presetColor)}
                title={presetColor}
                hapticFeedback={true}
              />
            ) : (
              <button
                key={presetColor}
                type="button"
                className={cn(
                  sizeClasses.circle,
                  "rounded-full border transition-transform hover:scale-110",
                  color === presetColor ? 'ring-2 ring-blue-500' : 'border-gray-300'
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => onChange(presetColor)}
                title={presetColor}
              />
            )
          ))}
        </div>
      )}
      
      {/* Custom color input */}
      <div className="relative">
        <input
          id={id}
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-8 h-8 p-0 border-0 rounded-md cursor-pointer",
            isMobile && "w-10 h-10" // Larger touch target on mobile
          )}
          title={title}
          aria-label={label || title}
        />
        {isMobile && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default ColorPicker;

// Add named export to fix import errors
export { ColorPicker };
