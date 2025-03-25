
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sliders, Palette, Sticker, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface CardDesignCustomizationProps {
  imageUrl: string;
  cardStyle: CardStyle;
  setCardStyle: (style: CardStyle) => void;
}

export interface CardStyle {
  effect: 'classic' | 'refractor' | 'prism' | 'chrome' | 'gold' | 'vintage';
  brightness: number;
  contrast: number;
  saturation: number;
  borderWidth: number;
  borderRadius: number;
  borderColor: string;
  backgroundColor: string;
}

const effectOptions = [
  { id: 'classic', name: 'Classic', icon: '✨' },
  { id: 'refractor', name: 'Refractor', icon: '🌈' },
  { id: 'prism', name: 'Prism', icon: '💎' },
  { id: 'chrome', name: 'Chrome', icon: '🔮' },
  { id: 'gold', name: 'Gold', icon: '🏆' },
  { id: 'vintage', name: 'Vintage', icon: '📜' },
];

const colorOptions = [
  { id: '#2563eb', name: 'Blue' },
  { id: '#dc2626', name: 'Red' },
  { id: '#16a34a', name: 'Green' },
  { id: '#eab308', name: 'Yellow' },
  { id: '#9333ea', name: 'Purple' },
  { id: '#f97316', name: 'Orange' },
  { id: '#ffffff', name: 'White' },
  { id: '#000000', name: 'Black' },
];

const CardDesignCustomization: React.FC<CardDesignCustomizationProps> = ({
  imageUrl,
  cardStyle,
  setCardStyle
}) => {
  const updateStyle = (key: keyof CardStyle, value: any) => {
    setCardStyle({ ...cardStyle, [key]: value });
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="flex justify-center">
        <div className="relative w-full max-w-xs">
          <div 
            className={cn(
              "w-full aspect-[2.5/3.5] overflow-hidden shadow-lg transition-all duration-300",
              cardStyle.effect === 'refractor' && "bg-gradient-to-br from-blue-400 to-purple-500 p-[2px]",
              cardStyle.effect === 'prism' && "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-[2px]",
              cardStyle.effect === 'chrome' && "bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 p-[2px]",
              cardStyle.effect === 'gold' && "bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 p-[2px]",
              cardStyle.effect === 'vintage' && "bg-amber-800/30 p-[2px]"
            )}
            style={{ 
              borderRadius: `${cardStyle.borderRadius}px`,
              borderWidth: `${cardStyle.borderWidth}px`,
              borderColor: cardStyle.borderColor,
              borderStyle: 'solid'
            }}
          >
            <div 
              className="w-full h-full relative overflow-hidden"
              style={{ 
                borderRadius: `${Math.max(0, cardStyle.borderRadius - cardStyle.borderWidth)}px`,
                backgroundColor: cardStyle.backgroundColor
              }}
            >
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt="Card preview" 
                  className={cn(
                    "w-full h-full object-cover transition-all duration-300",
                    cardStyle.effect === 'vintage' && "sepia brightness-90 contrast-125"
                  )}
                  style={{ 
                    filter: `brightness(${cardStyle.brightness}%) contrast(${cardStyle.contrast}%) saturate(${cardStyle.saturation}%)`
                  }}
                />
              )}
              
              {cardStyle.effect === 'refractor' && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/20 mix-blend-overlay pointer-events-none" />
              )}
              
              {cardStyle.effect === 'prism' && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/20 mix-blend-overlay pointer-events-none" />
              )}
              
              {cardStyle.effect === 'chrome' && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200/20 via-white/10 to-gray-200/20 mix-blend-overlay pointer-events-none" />
              )}
              
              {cardStyle.effect === 'gold' && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/30 via-yellow-400/20 to-yellow-200/30 mix-blend-overlay pointer-events-none" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <Tabs defaultValue="effects">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="effects" className="flex-1">
              <Sparkles className="mr-2 h-4 w-4" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="adjustments" className="flex-1">
              <Sliders className="mr-2 h-4 w-4" />
              Adjustments
            </TabsTrigger>
            <TabsTrigger value="borders" className="flex-1">
              <Palette className="mr-2 h-4 w-4" />
              Border & Background
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="effects" className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Card Effect</h3>
              <div className="grid grid-cols-3 gap-2">
                {effectOptions.map((effect) => (
                  <button
                    key={effect.id}
                    onClick={() => updateStyle('effect', effect.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
                      cardStyle.effect === effect.id 
                        ? "border-primary bg-primary/5" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className="text-2xl mb-1">{effect.icon}</span>
                    <span className="text-xs">{effect.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="adjustments" className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Brightness</label>
                <span className="text-xs text-gray-500">{cardStyle.brightness}%</span>
              </div>
              <Slider 
                value={[cardStyle.brightness]} 
                min={50} 
                max={150} 
                step={1}
                onValueChange={(value) => updateStyle('brightness', value[0])}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Contrast</label>
                <span className="text-xs text-gray-500">{cardStyle.contrast}%</span>
              </div>
              <Slider 
                value={[cardStyle.contrast]} 
                min={50} 
                max={150} 
                step={1}
                onValueChange={(value) => updateStyle('contrast', value[0])}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Saturation</label>
                <span className="text-xs text-gray-500">{cardStyle.saturation}%</span>
              </div>
              <Slider 
                value={[cardStyle.saturation]} 
                min={50} 
                max={150} 
                step={1}
                onValueChange={(value) => updateStyle('saturation', value[0])}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="borders" className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Border Width</label>
                <span className="text-xs text-gray-500">{cardStyle.borderWidth}px</span>
              </div>
              <Slider 
                value={[cardStyle.borderWidth]} 
                min={0} 
                max={10} 
                step={1}
                onValueChange={(value) => updateStyle('borderWidth', value[0])}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Border Radius</label>
                <span className="text-xs text-gray-500">{cardStyle.borderRadius}px</span>
              </div>
              <Slider 
                value={[cardStyle.borderRadius]} 
                min={0} 
                max={20} 
                step={1}
                onValueChange={(value) => updateStyle('borderRadius', value[0])}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Border Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateStyle('borderColor', color.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg border transition-all",
                      cardStyle.borderColor === color.id 
                        ? "border-primary" 
                        : "border-gray-200"
                    )}
                  >
                    <div 
                      className="w-6 h-6 rounded mb-1" 
                      style={{ backgroundColor: color.id }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Background Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateStyle('backgroundColor', color.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg border transition-all",
                      cardStyle.backgroundColor === color.id 
                        ? "border-primary" 
                        : "border-gray-200"
                    )}
                  >
                    <div 
                      className="w-6 h-6 rounded mb-1" 
                      style={{ backgroundColor: color.id }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CardDesignCustomization;
