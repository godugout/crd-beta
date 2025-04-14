
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { CardDesignState } from '../CardMakerWizard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TagInput from '../elements/TagInput';

interface TextTabProps {
  onContinue: () => void;
  cardData?: CardDesignState;
  setCardData?: (data: CardDesignState) => void;
}

const TextTab: React.FC<TextTabProps> = ({
  onContinue,
  cardData = {
    title: '',
    description: '',
    tags: [],
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    imageUrl: null,
  },
  setCardData = () => {}
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({...cardData, title: e.target.value});
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCardData({...cardData, description: e.target.value});
  };

  const handleTagsChange = (tags: string[]) => {
    setCardData({...cardData, tags});
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">Add Card Text</h2>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="title">Card Title</Label>
          <Input
            id="title"
            placeholder="Enter a title for your card"
            value={cardData.title}
            onChange={handleTitleChange}
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="description">Card Description</Label>
          <Textarea
            id="description"
            placeholder="Enter a description for your card"
            rows={4}
            value={cardData.description}
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="tags">Tags</Label>
          <TagInput 
            tags={cardData.tags} 
            setTags={(tags) => handleTagsChange(tags)}
            placeholder="Add tags and press Enter"
          />
          <p className="text-xs text-gray-500">Add relevant tags to help organize and find your card</p>
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
