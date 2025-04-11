
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CardDesignState } from './CardCreator';
import { ColorPicker } from '@/components/ui/color-picker';
import TagInput from './elements/TagInput';

interface CardEditorSidebarProps {
  cardData: CardDesignState;
  onChange: (data: CardDesignState) => void;
  onImageUpload: (url: string) => void;
}

const CardEditorSidebar: React.FC<CardEditorSidebarProps> = ({
  cardData,
  onChange,
  onImageUpload
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          onImageUpload(event.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleBorderRadiusChange = (value: number[]) => {
    onChange({
      ...cardData,
      borderRadius: `${value[0]}px`
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Card Information</h3>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={cardData.title}
            onChange={(e) => onChange({...cardData, title: e.target.value})}
            placeholder="Card Title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={cardData.description}
            onChange={(e) => onChange({...cardData, description: e.target.value})}
            placeholder="Card Description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <TagInput
            value={cardData.tags}
            onChange={(tags) => onChange({...cardData, tags})}
            placeholder="Add tags (press Enter)"
            maxTags={5}
          />
        </div>

        {!cardData.imageUrl && (
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-md">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-gray-500">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span className="text-sm font-medium">Upload Image</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG or GIF</span>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium mb-4">Card Style</h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Border Radius</Label>
              <span className="text-sm text-gray-500">{cardData.borderRadius}</span>
            </div>
            <Slider
              defaultValue={[parseInt(cardData.borderRadius || '12')]}
              min={0}
              max={24}
              step={2}
              onValueChange={handleBorderRadiusChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Border Color</Label>
            <ColorPicker
              value={cardData.borderColor || '#48BB78'}
              onChange={(color) => onChange({...cardData, borderColor: color})}
              colors={['#48BB78', '#F97316', '#2563EB', '#8B5CF6', '#EC4899', '#FFFFFF', '#000000']}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <ColorPicker
              value={cardData.backgroundColor || '#FFFFFF'}
              onChange={(color) => onChange({...cardData, backgroundColor: color})}
              colors={['#FFFFFF', '#F2FCE2', '#FEC6A1', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#111827']}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEditorSidebar;
