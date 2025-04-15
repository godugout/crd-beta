
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ImageFiltersProps {
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    hueRotate: number;
  };
  onFilterChange: (filter: string, value: number) => void;
}

export const ImageFilters: React.FC<ImageFiltersProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="filter-brightness">Brightness</Label>
          <span className="text-xs text-muted-foreground">{filters.brightness}%</span>
        </div>
        <Slider
          id="filter-brightness"
          min={0}
          max={200}
          step={1}
          value={[filters.brightness]}
          onValueChange={(value) => onFilterChange('brightness', value[0])}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="filter-contrast">Contrast</Label>
          <span className="text-xs text-muted-foreground">{filters.contrast}%</span>
        </div>
        <Slider
          id="filter-contrast"
          min={0}
          max={200}
          step={1}
          value={[filters.contrast]}
          onValueChange={(value) => onFilterChange('contrast', value[0])}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="filter-saturation">Saturation</Label>
          <span className="text-xs text-muted-foreground">{filters.saturation}%</span>
        </div>
        <Slider
          id="filter-saturation"
          min={0}
          max={200}
          step={1}
          value={[filters.saturation]}
          onValueChange={(value) => onFilterChange('saturation', value[0])}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="filter-blur">Blur</Label>
          <span className="text-xs text-muted-foreground">{filters.blur}px</span>
        </div>
        <Slider
          id="filter-blur"
          min={0}
          max={10}
          step={0.1}
          value={[filters.blur]}
          onValueChange={(value) => onFilterChange('blur', value[0])}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="filter-hue-rotate">Hue Rotate</Label>
          <span className="text-xs text-muted-foreground">{filters.hueRotate}°</span>
        </div>
        <Slider
          id="filter-hue-rotate"
          min={0}
          max={360}
          step={1}
          value={[filters.hueRotate]}
          onValueChange={(value) => onFilterChange('hueRotate', value[0])}
        />
      </div>
    </div>
  );
};
