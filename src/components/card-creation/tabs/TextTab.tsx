
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextTabProps {
  onContinue: () => void;
}

const TextTab: React.FC<TextTabProps> = ({ onContinue }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [titleText, setTitleText] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [titleFont, setTitleFont] = useState('Inter');
  const [descriptionFont, setDescriptionFont] = useState('Inter');
  const [titleColor, setTitleColor] = useState('#000000');
  const [descriptionColor, setDescriptionColor] = useState('#000000');
  
  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4 ${isMobile ? 'text-center' : 'text-left'}`}>Add Text & Details</h2>
      
      <div className="space-y-6">
        {/* Title Text */}
        <div className="space-y-2">
          <Label htmlFor="title-text">Card Title</Label>
          <Input 
            id="title-text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            placeholder="Enter card title"
          />
        </div>
        
        {/* Title Font */}
        <div className="space-y-2">
          <Label>Title Font</Label>
          <Select value={titleFont} onValueChange={setTitleFont}>
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="PlayfairDisplay">Playfair Display</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Title Color */}
        <div className="space-y-2">
          <Label htmlFor="title-color">Title Color</Label>
          <div className="flex items-center gap-3">
            <Input 
              id="title-color"
              type="color"
              value={titleColor}
              onChange={(e) => setTitleColor(e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input 
              value={titleColor}
              onChange={(e) => setTitleColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description-text">Description</Label>
          <Textarea 
            id="description-text"
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
            placeholder="Enter card description"
            rows={4}
          />
        </div>
        
        {/* Description Font */}
        <div className="space-y-2">
          <Label>Description Font</Label>
          <Select value={descriptionFont} onValueChange={setDescriptionFont}>
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="PlayfairDisplay">Playfair Display</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Description Color */}
        <div className="space-y-2">
          <Label htmlFor="description-color">Description Color</Label>
          <div className="flex items-center gap-3">
            <Input 
              id="description-color"
              type="color"
              value={descriptionColor}
              onChange={(e) => setDescriptionColor(e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input 
              value={descriptionColor}
              onChange={(e) => setDescriptionColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
          onClick={onContinue}
        >
          Continue <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default TextTab;
