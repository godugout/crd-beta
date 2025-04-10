
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CardTextOverlayProps {
  imageUrl: string;
}

const FONT_FAMILIES = [
  "Arial", "Helvetica", "Georgia", "Impact", "Tahoma", "Times New Roman", "Verdana"
];

const TEXT_POSITIONS = [
  "Top", "Center", "Bottom"
];

const CardTextOverlay: React.FC<CardTextOverlayProps> = ({ imageUrl }) => {
  const [overlayText, setOverlayText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textPosition, setTextPosition] = useState('Bottom');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">Text Overlay</h3>
        <p className="text-gray-500 mb-6">
          Add text to personalize your CRD
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="overlay-text">Text Content</Label>
            <Input
              id="overlay-text"
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              placeholder="Enter text for overlay"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="font-family">Font</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map(font => (
                  <SelectItem key={font} value={font}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="font-size">Font Size</Label>
              <span className="text-sm">{fontSize}px</span>
            </div>
            <Slider
              id="font-size"
              min={12}
              max={72}
              step={1}
              defaultValue={[fontSize]}
              onValueChange={(values) => setFontSize(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text-position">Position</Label>
            <Select value={textPosition} onValueChange={setTextPosition}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {TEXT_POSITIONS.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text-color">Text Color</Label>
            <div className="grid grid-cols-7 gap-2">
              {['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map(color => (
                <div
                  key={color}
                  className={`h-8 w-8 rounded-full cursor-pointer border-2 ${textColor === color ? 'border-black' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setTextColor(color)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <Label className="text-base font-semibold block mb-4">Preview</Label>
        <div className="aspect-[2.5/3.5] max-w-xs mx-auto border-2 border-litmus-green overflow-hidden rounded-lg relative">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="Card preview"
                className="w-full h-full object-cover"
              />
              {overlayText && (
                <div 
                  className={`absolute w-full px-4 text-center
                    ${textPosition === 'Top' ? 'top-4' : 
                      textPosition === 'Center' ? 'top-1/2 transform -translate-y-1/2' : 
                      'bottom-4'}`}
                >
                  <p style={{
                    fontFamily,
                    fontSize: `${fontSize}px`,
                    color: textColor,
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                  }}>
                    {overlayText}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full border border-dashed rounded-lg flex items-center justify-center bg-gray-50">
              <p className="text-gray-400">Upload an image to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardTextOverlay;
