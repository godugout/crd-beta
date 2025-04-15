
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload } from 'lucide-react';
import { ColorPicker } from '@/components/ui/color-picker';
import TagInput from '@/components/card-creation/elements/TagInput';
import { CardDesignState } from './CardCreator';

interface CardEditorSidebarProps {
  cardData: CardDesignState;
  onChange: (data: CardDesignState) => void;
  onImageUpload: (imageUrl: string) => void;
}

const CardEditorSidebar: React.FC<CardEditorSidebarProps> = ({
  cardData,
  onChange,
  onImageUpload
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Card Details Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Card Title</Label>
          <Input
            id="title"
            value={cardData.title}
            onChange={(e) => onChange({ ...cardData, title: e.target.value })}
            placeholder="Enter card title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={cardData.description}
            onChange={(e) => onChange({ ...cardData, description: e.target.value })}
            placeholder="Enter card description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <TagInput
            value={cardData.tags}
            onChange={(tags) => onChange({ ...cardData, tags })}
            placeholder="Add tags..."
            maxTags={10}
          />
        </div>
      </div>

      {/* Card Appearance Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium">Card Appearance</h3>

        <div className="space-y-2">
          <Label htmlFor="border-color">Border Color</Label>
          <ColorPicker
            value={cardData.borderColor}
            onChange={(color) => onChange({ ...cardData, borderColor: color })}
            colors={['#000000', '#48BB78', '#4299E1', '#F56565', '#ED8936', '#ECC94B', '#9F7AEA', '#ED64A6']}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="background-color">Background Color</Label>
          <ColorPicker
            value={cardData.backgroundColor}
            onChange={(color) => onChange({ ...cardData, backgroundColor: color })}
            colors={['#FFFFFF', '#F7FAFC', '#E2E8F0', '#EDF2F7', '#EBF4FF', '#E6FFFA', '#F0FFF4', '#FFF5F5']}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="border-radius">Border Radius</Label>
          <div className="flex gap-2">
            {['0px', '4px', '8px', '12px', '16px', '20px'].map((radius) => (
              <button
                key={radius}
                className={`flex-1 border py-1 px-2 text-xs rounded hover:bg-gray-100 ${
                  cardData.borderRadius === radius ? 'border-primary bg-primary/10' : 'border-gray-200'
                }`}
                onClick={() => onChange({ ...cardData, borderRadius: radius })}
              >
                {radius}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium">Card Image</h3>

        <div>
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {cardData.imageUrl ? (
            <div className="space-y-2">
              <div className="aspect-[2.5/3.5] rounded-md overflow-hidden bg-gray-100">
                <img
                  src={cardData.imageUrl}
                  alt="Card"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="aspect-[2.5/3.5] rounded-md border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4">
                <div className="text-gray-400 text-center">
                  <Upload className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">Upload an image for your card</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardEditorSidebar;
