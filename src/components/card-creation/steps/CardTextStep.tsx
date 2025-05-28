
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CardTextStepProps {
  cardData: any;
  setCardData: (data: any) => void;
  onContinue: () => void;
}

const CARD_CATEGORIES = ['Sports', 'Movies', 'Music', 'Art', 'Collectibles'];
const CARD_SERIES = ['80s VCR', 'Retro', 'Modern', 'Vintage', 'Limited Edition'];

const CardTextStep: React.FC<CardTextStepProps> = ({
  cardData,
  setCardData,
  onContinue
}) => {
  const [tagInput, setTagInput] = useState('');
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCategoryChange = (value: string) => {
    setCardData({
      ...cardData,
      category: value
    });
  };
  
  const handleSeriesChange = (value: string) => {
    setCardData({
      ...cardData,
      series: value
    });
  };
  
  const handleToggleChange = (field: string, value: boolean) => {
    setCardData({
      ...cardData,
      [field]: value
    });
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!cardData.tags.includes(tagInput.trim())) {
        setCardData({
          ...cardData,
          tags: [...cardData.tags, tagInput.trim()]
        });
        setTagInput('');
      }
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setCardData({
      ...cardData,
      tags: cardData.tags.filter((t: string) => t !== tag)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Text & Details</h2>
        <p className="text-gray-500 mb-4">
          Add information and details to your card
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={cardData.title}
            onChange={handleTextChange}
            placeholder="Enter title for your card"
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={cardData.description}
            onChange={handleTextChange}
            placeholder="Describe your card"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={cardData.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {CARD_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="series">Series</Label>
            <Select 
              value={cardData.series} 
              onValueChange={handleSeriesChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Series" />
              </SelectTrigger>
              <SelectContent>
                {CARD_SERIES.map(series => (
                  <SelectItem key={series} value={series.toLowerCase()}>{series}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Year/Edition</Label>
            <Input
              id="year"
              name="year"
              value={cardData.year}
              onChange={handleTextChange}
              placeholder="Year or edition"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {cardData.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                #{tag}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveTag(tag)}
                  className="h-auto p-0 ml-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex items-center">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags and press Enter"
              className="flex-1"
            />
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => {
                if (tagInput.trim() && !cardData.tags.includes(tagInput.trim())) {
                  setCardData({
                    ...cardData,
                    tags: [...cardData.tags, tagInput.trim()]
                  });
                  setTagInput('');
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-4 border">
          <h3 className="font-medium">Card Options</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Make available for printing</h4>
              <p className="text-sm text-gray-500">
                Let us know if anyone requests prints and you can work with a printer
              </p>
            </div>
            <Switch 
              checked={cardData.makePrintAvailable} 
              onCheckedChange={(value) => handleToggleChange('makePrintAvailable', value)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Include in CRD Catalog</h4>
              <p className="text-sm text-gray-500">
                Contribute to our official CRD Catalog for limited print releases
              </p>
            </div>
            <Switch 
              checked={cardData.includeInCatalog} 
              onCheckedChange={(value) => handleToggleChange('includeInCatalog', value)} 
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button onClick={onContinue} className="flex items-center gap-2">
          Continue <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CardTextStep;
