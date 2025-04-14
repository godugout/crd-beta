
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardDesignState } from './types/cardTypes';
import { Upload } from 'lucide-react';

interface CardEditorSidebarProps {
  cardData: CardDesignState;
  onChange: React.Dispatch<React.SetStateAction<CardDesignState>>;
  onImageUpload: (imageUrl: string) => void;
}

const CardEditorSidebar: React.FC<CardEditorSidebarProps> = ({
  cardData,
  onChange,
  onImageUpload
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      onChange(prev => ({ ...prev, imageUrl }));
      onImageUpload(imageUrl);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Card Design</h3>
        
        {/* Image Upload */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="image-upload">Card Image</Label>
          <div className="relative">
            {cardData.imageUrl ? (
              <div className="relative w-full aspect-[2.5/3.5] rounded-lg overflow-hidden border">
                <img 
                  src={cardData.imageUrl} 
                  alt="Card" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="w-full aspect-[2.5/3.5] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium">Upload Card Image</p>
                <p className="text-xs text-gray-500">Click to browse</p>
              </div>
            )}
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        {/* Border Color */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="borderColor">Border Color</Label>
          <div className="flex gap-2">
            <div
              className="w-10 h-10 rounded-md overflow-hidden border"
              style={{ backgroundColor: cardData.borderColor }}
            >
              <input
                type="color"
                id="borderColor"
                name="borderColor"
                value={cardData.borderColor}
                onChange={handleInputChange}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </div>
            <Input
              type="text"
              name="borderColor"
              value={cardData.borderColor}
              onChange={handleInputChange}
              className="flex-1"
            />
          </div>
        </div>
        
        {/* Background Color */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <div className="flex gap-2">
            <div
              className="w-10 h-10 rounded-md overflow-hidden border"
              style={{ backgroundColor: cardData.backgroundColor }}
            >
              <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={cardData.backgroundColor}
                onChange={handleInputChange}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </div>
            <Input
              type="text"
              name="backgroundColor"
              value={cardData.backgroundColor}
              onChange={handleInputChange}
              className="flex-1"
            />
          </div>
        </div>
        
        {/* Border Radius */}
        <div className="space-y-2">
          <Label htmlFor="borderRadius">Border Radius</Label>
          <div className="flex items-center gap-2">
            <Input
              type="range"
              min="0"
              max="30"
              step="1"
              name="borderRadius"
              value={parseInt(cardData.borderRadius) || "0"}
              onChange={(e) => onChange(prev => ({ ...prev, borderRadius: `${e.target.value}px` }))}
              className="flex-1"
            />
            <span className="text-sm w-10 text-center">{parseInt(cardData.borderRadius) || "0"}px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEditorSidebar;
