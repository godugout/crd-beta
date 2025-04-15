
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ColorPicker } from './tools/ColorPicker';
import { ImageFilters } from './tools/ImageFilters';
import { LayerControls } from './tools/LayerControls';
import { toast } from 'sonner';

interface AdvancedToolsProps {
  imageUrl: string | null;
  onApplyChanges: (changes: any) => void;
}

const AdvancedTools: React.FC<AdvancedToolsProps> = ({ 
  imageUrl,
  onApplyChanges
}) => {
  const [activeTab, setActiveTab] = useState('filters');
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hueRotate: 0
  });
  const [cropSettings, setCropSettings] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });
  const [overlayColor, setOverlayColor] = useState('rgba(0, 0, 0, 0)');
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  
  const handleFilterChange = (filter: string, value: number) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };
  
  const handleCropChange = (property: string, value: number) => {
    setCropSettings(prev => ({
      ...prev,
      [property]: value
    }));
  };
  
  const handleOverlayColorChange = (color: string) => {
    setOverlayColor(color);
  };
  
  const handleOverlayOpacityChange = (value: number[]) => {
    setOverlayOpacity(value[0]);
  };
  
  const getFilterStyle = () => {
    return {
      filter: `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%) 
        blur(${filters.blur}px) 
        hue-rotate(${filters.hueRotate}deg)
      `
    };
  };
  
  const handleApplyChanges = () => {
    const changes = {
      filters,
      cropSettings,
      overlay: {
        color: overlayColor,
        opacity: overlayOpacity
      }
    };
    
    onApplyChanges(changes);
    toast.success('Changes applied to the card');
  };
  
  const handleResetChanges = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      hueRotate: 0
    });
    
    setCropSettings({
      x: 0,
      y: 0,
      width: 100,
      height: 100
    });
    
    setOverlayColor('rgba(0, 0, 0, 0)');
    setOverlayOpacity(0);
    
    toast.info('Changes reset');
  };
  
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Advanced Card Tools</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="filters">Filters & Effects</TabsTrigger>
          <TabsTrigger value="crop">Crop & Position</TabsTrigger>
          <TabsTrigger value="overlay">Overlay & Texture</TabsTrigger>
        </TabsList>
        
        <TabsContent value="filters" className="space-y-4">
          <ImageFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </TabsContent>
        
        <TabsContent value="crop" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="crop-x">Position X</Label>
                <span className="text-xs text-muted-foreground">{cropSettings.x}%</span>
              </div>
              <Slider
                id="crop-x"
                min={0}
                max={100}
                step={1}
                value={[cropSettings.x]}
                onValueChange={(value) => handleCropChange('x', value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="crop-y">Position Y</Label>
                <span className="text-xs text-muted-foreground">{cropSettings.y}%</span>
              </div>
              <Slider
                id="crop-y"
                min={0}
                max={100}
                step={1}
                value={[cropSettings.y]}
                onValueChange={(value) => handleCropChange('y', value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="crop-width">Width</Label>
                <span className="text-xs text-muted-foreground">{cropSettings.width}%</span>
              </div>
              <Slider
                id="crop-width"
                min={10}
                max={100}
                step={1}
                value={[cropSettings.width]}
                onValueChange={(value) => handleCropChange('width', value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="crop-height">Height</Label>
                <span className="text-xs text-muted-foreground">{cropSettings.height}%</span>
              </div>
              <Slider
                id="crop-height"
                min={10}
                max={100}
                step={1}
                value={[cropSettings.height]}
                onValueChange={(value) => handleCropChange('height', value[0])}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="overlay" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="overlay-color">Overlay Color</Label>
              <ColorPicker
                id="overlay-color"
                color={overlayColor}
                onChange={handleOverlayColorChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="overlay-opacity">Opacity</Label>
                <span className="text-xs text-muted-foreground">{overlayOpacity}%</span>
              </div>
              <Slider
                id="overlay-opacity"
                min={0}
                max={100}
                step={1}
                value={[overlayOpacity]}
                onValueChange={handleOverlayOpacityChange}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Preview Area */}
      <div className="mt-6 mb-6">
        <Label className="block mb-2">Preview</Label>
        <div className="relative aspect-[2.5/3.5] max-w-xs mx-auto border rounded-lg overflow-hidden">
          {imageUrl ? (
            <>
              <img 
                src={imageUrl} 
                alt="Card preview" 
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  ...getFilterStyle(),
                  objectPosition: `${cropSettings.x}% ${cropSettings.y}%`,
                  width: `${cropSettings.width}%`,
                  height: `${cropSettings.height}%`,
                  left: `${(100 - cropSettings.width) / 2}%`,
                  top: `${(100 - cropSettings.height) / 2}%`,
                }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  backgroundColor: overlayColor,
                  opacity: overlayOpacity / 100
                }}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              No image selected
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleResetChanges}>
          Reset
        </Button>
        <Button onClick={handleApplyChanges}>
          Apply Changes
        </Button>
      </div>
    </div>
  );
};

export default AdvancedTools;
