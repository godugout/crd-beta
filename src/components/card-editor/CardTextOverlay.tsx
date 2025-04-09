
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';

interface CardTextOverlayProps {
  imageUrl: string;
}

const CardTextOverlay: React.FC<CardTextOverlayProps> = ({ imageUrl }) => {
  const [showTitle, setShowTitle] = useState(true);
  const [showPlayerName, setShowPlayerName] = useState(true);
  const [textPosition, setTextPosition] = useState('bottom');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textOpacity, setTextOpacity] = useState(100);
  const [textShadow, setTextShadow] = useState(true);
  const [fontStyle, setFontStyle] = useState('modern');
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Text & Overlay</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-title" className="cursor-pointer">Show Title</Label>
            <Switch 
              id="show-title" 
              checked={showTitle} 
              onCheckedChange={setShowTitle}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="show-player" className="cursor-pointer">Show Player Name</Label>
            <Switch 
              id="show-player" 
              checked={showPlayerName} 
              onCheckedChange={setShowPlayerName} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Text Position</Label>
            <RadioGroup 
              value={textPosition} 
              onValueChange={setTextPosition}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="top" id="top" />
                <Label htmlFor="top">Top</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bottom" id="bottom" />
                <Label htmlFor="bottom">Bottom</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="center" id="center" />
                <Label htmlFor="center">Center</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text-color">Text Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1"
                maxLength={7}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Text Opacity: {textOpacity}%</Label>
            </div>
            <Slider
              value={[textOpacity]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => setTextOpacity(values[0])}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="text-shadow" className="cursor-pointer">Text Shadow</Label>
            <Switch 
              id="text-shadow" 
              checked={textShadow} 
              onCheckedChange={setTextShadow}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="font-style">Font Style</Label>
            <Select value={fontStyle} onValueChange={setFontStyle}>
              <SelectTrigger id="font-style">
                <SelectValue placeholder="Select font style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Preview Card with Text Overlay */}
        <div>
          <p className="mb-2 text-gray-600 text-sm">Preview</p>
          <div className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-md border">
            {imageUrl ? (
              <>
                <img 
                  src={imageUrl} 
                  alt="Card preview" 
                  className="w-full h-full object-cover"
                />
                
                {textPosition !== 'none' && (
                  <div 
                    className={`absolute left-0 right-0 p-4 ${
                      textPosition === 'top' ? 'top-0 bg-gradient-to-b from-black/60 to-transparent' : 
                      textPosition === 'bottom' ? 'bottom-0 bg-gradient-to-t from-black/60 to-transparent' : 
                      'inset-0 flex items-center justify-center bg-black/30'
                    }`}
                  >
                    <div className="space-y-1">
                      {showTitle && (
                        <div 
                          className={`text-lg font-bold ${
                            fontStyle === 'vintage' ? 'font-serif' : 
                            fontStyle === 'bold' ? 'font-black uppercase tracking-wider' : 
                            fontStyle === 'modern' ? 'font-sans tracking-tight' : ''
                          }`}
                          style={{ 
                            color: textColor,
                            opacity: textOpacity / 100,
                            textShadow: textShadow ? '1px 1px 3px rgba(0,0,0,0.8)' : 'none'
                          }}
                        >
                          Card Title
                        </div>
                      )}
                      
                      {showPlayerName && (
                        <div 
                          className={`${
                            fontStyle === 'vintage' ? 'font-serif' : 
                            fontStyle === 'bold' ? 'font-bold uppercase tracking-wide' : 
                            fontStyle === 'modern' ? 'font-sans' : ''
                          }`}
                          style={{ 
                            color: textColor,
                            opacity: textOpacity / 100,
                            textShadow: textShadow ? '1px 1px 3px rgba(0,0,0,0.8)' : 'none'
                          }}
                        >
                          Player Name
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                No image uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTextOverlay;
