
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CardTextOverlayProps {
  imageUrl: string;
}

const CardTextOverlay: React.FC<CardTextOverlayProps> = ({ imageUrl }) => {
  const [overlayText, setOverlayText] = useState('');
  const [textPosition, setTextPosition] = useState('bottom');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(18);
  const [fontStyle, setFontStyle] = useState('normal');
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Text Overlay</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="text">Text Content</TabsTrigger>
              <TabsTrigger value="style">Text Style</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="overlayText">Overlay Text</Label>
                  <Textarea
                    id="overlayText"
                    value={overlayText}
                    onChange={(e) => setOverlayText(e.target.value)}
                    placeholder="Add text to overlay on your card"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Text Position</Label>
                  <Select
                    value={textPosition}
                    onValueChange={setTextPosition}
                  >
                    <SelectTrigger id="position" className="w-full">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="font-size">Font Size</Label>
                    <span className="text-sm text-gray-500">{fontSize}px</span>
                  </div>
                  <Slider
                    id="font-size"
                    min={12}
                    max={36}
                    step={1}
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-style">Font Style</Label>
                  <Select
                    value={fontStyle}
                    onValueChange={setFontStyle}
                  >
                    <SelectTrigger id="font-style" className="w-full">
                      <SelectValue placeholder="Select font style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="italic">Italic</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="bold italic">Bold Italic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex">
                    <Input
                      id="text-color"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 ml-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="w-full aspect-[2.5/3.5] rounded overflow-hidden relative">
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt="Card preview" 
                  className="w-full h-full object-cover"
                />
              )}
              
              {overlayText && (
                <div className={`absolute ${
                    textPosition === 'top' ? 'top-4' :
                    textPosition === 'middle' ? 'top-1/2 transform -translate-y-1/2' :
                    'bottom-4'
                  } left-0 right-0 p-4 text-center`}
                >
                  <div className="bg-black/40 backdrop-blur-sm p-2 rounded inline-block">
                    <p style={{ 
                      color: textColor, 
                      fontSize: `${fontSize}px`,
                      fontStyle: fontStyle.includes('italic') ? 'italic' : 'normal',
                      fontWeight: fontStyle.includes('bold') ? 'bold' : 'normal'
                    }}>
                      {overlayText}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTextOverlay;
