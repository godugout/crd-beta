
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface CardTextCustomizationProps {
  imageUrl: string;
  textStyle: TextStyle;
  setTextStyle: (style: TextStyle) => void;
  cardTitle: string;
  setCardTitle: (title: string) => void;
  cardDescription: string;
  setCardDescription: (description: string) => void;
}

export interface TextStyle {
  titleFont: string;
  titleSize: number;
  titleColor: string;
  titleAlignment: 'left' | 'center' | 'right';
  titleWeight: 'normal' | 'bold';
  titleStyle: 'normal' | 'italic';
  descriptionFont: string;
  descriptionSize: number;
  descriptionColor: string;
  showOverlay: boolean;
  overlayOpacity: number;
  overlayColor: string;
  overlayPosition: 'top' | 'bottom' | 'full';
}

const fontOptions = [
  { id: 'sans', name: 'Sans-serif' },
  { id: 'serif', name: 'Serif' },
  { id: 'mono', name: 'Monospace' },
];

const colorOptions = [
  { id: '#ffffff', name: 'White' },
  { id: '#000000', name: 'Black' },
  { id: '#2563eb', name: 'Blue' },
  { id: '#dc2626', name: 'Red' },
  { id: '#16a34a', name: 'Green' },
  { id: '#eab308', name: 'Yellow' },
  { id: '#9333ea', name: 'Purple' },
  { id: '#f97316', name: 'Orange' },
];

const CardTextCustomization: React.FC<CardTextCustomizationProps> = ({
  imageUrl,
  textStyle,
  setTextStyle,
  cardTitle,
  setCardTitle,
  cardDescription,
  setCardDescription
}) => {
  const updateTextStyle = (key: keyof TextStyle, value: any) => {
    setTextStyle({ ...textStyle, [key]: value });
  };
  
  const getFontClass = (font: string) => {
    switch (font) {
      case 'sans': return 'font-sans';
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };
  
  const getAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };
  
  const getOverlayClass = (position: string) => {
    switch (position) {
      case 'top': return 'top-0 left-0 right-0 h-1/3';
      case 'bottom': return 'bottom-0 left-0 right-0 h-1/3';
      case 'full': return 'inset-0';
      default: return 'bottom-0 left-0 right-0 h-1/3';
    }
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="flex justify-center">
        <div className="relative w-full max-w-xs">
          <div className="w-full aspect-[2.5/3.5] overflow-hidden rounded-lg shadow-lg relative">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Card preview" 
                className="w-full h-full object-cover"
              />
            )}
            
            {textStyle.showOverlay && (
              <div 
                className={cn("absolute", getOverlayClass(textStyle.overlayPosition))}
                style={{ 
                  backgroundColor: textStyle.overlayColor,
                  opacity: textStyle.overlayOpacity / 100
                }}
              />
            )}
            
            <div className="absolute inset-0 p-4 flex flex-col">
              <h3 
                className={cn(
                  getFontClass(textStyle.titleFont),
                  getAlignmentClass(textStyle.titleAlignment),
                  textStyle.titleWeight === 'bold' ? 'font-bold' : 'font-normal',
                  textStyle.titleStyle === 'italic' ? 'italic' : 'not-italic'
                )}
                style={{ 
                  color: textStyle.titleColor,
                  fontSize: `${textStyle.titleSize}px`,
                }}
              >
                {cardTitle}
              </h3>
              
              <div className="mt-auto">
                <p 
                  className={cn(
                    getFontClass(textStyle.descriptionFont),
                    'text-sm'
                  )}
                  style={{ 
                    color: textStyle.descriptionColor,
                    fontSize: `${textStyle.descriptionSize}px`,
                  }}
                >
                  {cardDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <Tabs defaultValue="title">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="title" className="flex-1">
              <Type className="mr-2 h-4 w-4" />
              Title
            </TabsTrigger>
            <TabsTrigger value="description" className="flex-1">
              <AlignLeft className="mr-2 h-4 w-4" />
              Description
            </TabsTrigger>
            <TabsTrigger value="overlay" className="flex-1">
              <Bold className="mr-2 h-4 w-4" />
              Text Overlay
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="title" className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Card Title</label>
              <input
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Font Family</h3>
              <div className="grid grid-cols-3 gap-2">
                {fontOptions.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => updateTextStyle('titleFont', font.id)}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      textStyle.titleFont === font.id 
                        ? "border-primary bg-primary/5" 
                        : "border-gray-200 hover:border-gray-300",
                      getFontClass(font.id)
                    )}
                  >
                    <span className="text-sm">{font.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Font Size</label>
                <span className="text-xs text-gray-500">{textStyle.titleSize}px</span>
              </div>
              <Slider 
                value={[textStyle.titleSize]} 
                min={12} 
                max={36} 
                step={1}
                onValueChange={(value) => updateTextStyle('titleSize', value[0])}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Text Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateTextStyle('titleColor', color.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg border transition-all",
                      textStyle.titleColor === color.id 
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
              <h3 className="text-sm font-medium mb-3">Text Alignment</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateTextStyle('titleAlignment', 'left')}
                  className={cn(
                    "flex-1 p-3 rounded-lg border transition-all",
                    textStyle.titleAlignment === 'left' 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <AlignLeft className="mx-auto h-5 w-5" />
                </button>
                <button
                  onClick={() => updateTextStyle('titleAlignment', 'center')}
                  className={cn(
                    "flex-1 p-3 rounded-lg border transition-all",
                    textStyle.titleAlignment === 'center' 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <AlignCenter className="mx-auto h-5 w-5" />
                </button>
                <button
                  onClick={() => updateTextStyle('titleAlignment', 'right')}
                  className={cn(
                    "flex-1 p-3 rounded-lg border transition-all",
                    textStyle.titleAlignment === 'right' 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <AlignRight className="mx-auto h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Text Style</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateTextStyle('titleWeight', textStyle.titleWeight === 'bold' ? 'normal' : 'bold')}
                  className={cn(
                    "flex-1 p-3 rounded-lg border transition-all",
                    textStyle.titleWeight === 'bold' 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Bold className="mx-auto h-5 w-5" />
                </button>
                <button
                  onClick={() => updateTextStyle('titleStyle', textStyle.titleStyle === 'italic' ? 'normal' : 'italic')}
                  className={cn(
                    "flex-1 p-3 rounded-lg border transition-all",
                    textStyle.titleStyle === 'italic' 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Italic className="mx-auto h-5 w-5" />
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="description" className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Card Description</label>
              <textarea
                value={cardDescription}
                onChange={(e) => setCardDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-md h-24"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Font Family</h3>
              <div className="grid grid-cols-3 gap-2">
                {fontOptions.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => updateTextStyle('descriptionFont', font.id)}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      textStyle.descriptionFont === font.id 
                        ? "border-primary bg-primary/5" 
                        : "border-gray-200 hover:border-gray-300",
                      getFontClass(font.id)
                    )}
                  >
                    <span className="text-sm">{font.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Font Size</label>
                <span className="text-xs text-gray-500">{textStyle.descriptionSize}px</span>
              </div>
              <Slider 
                value={[textStyle.descriptionSize]} 
                min={8} 
                max={18} 
                step={1}
                onValueChange={(value) => updateTextStyle('descriptionSize', value[0])}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Text Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateTextStyle('descriptionColor', color.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg border transition-all",
                      textStyle.descriptionColor === color.id 
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
          
          <TabsContent value="overlay" className="space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-overlay"
                checked={textStyle.showOverlay}
                onChange={(e) => updateTextStyle('showOverlay', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="show-overlay" className="text-sm font-medium">Show text overlay</label>
            </div>
            
            {textStyle.showOverlay && (
              <>
                <div>
                  <h3 className="text-sm font-medium mb-3">Overlay Position</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateTextStyle('overlayPosition', 'top')}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        textStyle.overlayPosition === 'top' 
                          ? "border-primary bg-primary/5" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <span className="text-sm">Top</span>
                    </button>
                    <button
                      onClick={() => updateTextStyle('overlayPosition', 'bottom')}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        textStyle.overlayPosition === 'bottom' 
                          ? "border-primary bg-primary/5" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <span className="text-sm">Bottom</span>
                    </button>
                    <button
                      onClick={() => updateTextStyle('overlayPosition', 'full')}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        textStyle.overlayPosition === 'full' 
                          ? "border-primary bg-primary/5" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <span className="text-sm">Full</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Overlay Opacity</label>
                    <span className="text-xs text-gray-500">{textStyle.overlayOpacity}%</span>
                  </div>
                  <Slider 
                    value={[textStyle.overlayOpacity]} 
                    min={10} 
                    max={90} 
                    step={5}
                    onValueChange={(value) => updateTextStyle('overlayOpacity', value[0])}
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Overlay Color</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => updateTextStyle('overlayColor', color.id)}
                        className={cn(
                          "flex flex-col items-center justify-center p-2 rounded-lg border transition-all",
                          textStyle.overlayColor === color.id 
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
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CardTextCustomization;
