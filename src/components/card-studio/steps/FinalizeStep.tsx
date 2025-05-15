
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { toastUtils } from '@/lib/utils/toast-utils';

interface FinalizeStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const FinalizeStep: React.FC<FinalizeStepProps> = ({ cardData, onUpdate }) => {
  const [tagInput, setTagInput] = useState<string>('');
  
  // Metadata defaults with fallbacks
  const marketMetadata = cardData.designMetadata?.marketMetadata || {
    price: 0,
    currency: 'USD',
    availableForSale: false,
    editionSize: 1,
    editionNumber: 1,
  };
  
  const cardMetadata = cardData.designMetadata?.cardMetadata || {
    category: 'general',
    series: 'base',
    cardType: 'standard',
  };

  // Handle adding a new tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tagInput.trim()) return;
    
    // Check if tag already exists
    const currentTags = cardData.tags || [];
    if (currentTags.includes(tagInput.trim().toLowerCase())) {
      toastUtils.info(
        "Tag already exists",
        "This tag is already added to the card"
      );
      return;
    }
    
    // Add the new tag
    onUpdate({ 
      tags: [...currentTags, tagInput.trim().toLowerCase()]
    });
    
    // Reset input
    setTagInput('');
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = (cardData.tags || []).filter(tag => tag !== tagToRemove);
    onUpdate({ tags: updatedTags });
  };
  
  // Update market metadata
  const handleMarketMetadataChange = (key: keyof typeof marketMetadata, value: any) => {
    onUpdate({
      designMetadata: {
        ...cardData.designMetadata,
        marketMetadata: {
          ...marketMetadata,
          [key]: value
        }
      }
    });
  };
  
  // Update card metadata
  const handleCardMetadataChange = (key: keyof typeof cardMetadata, value: any) => {
    onUpdate({
      designMetadata: {
        ...cardData.designMetadata,
        cardMetadata: {
          ...cardMetadata,
          [key]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Finalize Card</h2>
      
      {/* Basic card details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Card Title</Label>
          <Input
            id="title"
            value={cardData.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter card title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={cardData.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Brief description of the card"
          />
        </div>
      </div>
      
      {/* Tags input */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <form onSubmit={handleAddTag} className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tags to help find your card"
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </form>
        
        {/* Display tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {(cardData.tags || []).map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {(cardData.tags || []).length === 0 && (
            <p className="text-sm text-gray-500">No tags added yet</p>
          )}
        </div>
      </div>
      
      {/* Card metadata */}
      <div className="space-y-4">
        <h3 className="font-medium">Card Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={cardMetadata.category || ''}
              onChange={(e) => handleCardMetadataChange('category', e.target.value)}
              placeholder="e.g., Sports, Collectible, Special"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="series">Series</Label>
            <Input
              id="series"
              value={cardMetadata.series || ''}
              onChange={(e) => handleCardMetadataChange('series', e.target.value)}
              placeholder="e.g., Base, Limited Edition"
            />
          </div>
        </div>
      </div>
      
      {/* Market metadata */}
      <div className="space-y-4">
        <h3 className="font-medium">Market Information</h3>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="available-for-sale"
            checked={!!marketMetadata.availableForSale}
            onCheckedChange={(checked) => 
              handleMarketMetadataChange('availableForSale', checked)
            }
          />
          <Label htmlFor="available-for-sale">Available for sale</Label>
        </div>
        
        {marketMetadata.availableForSale && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={marketMetadata.price?.toString() || '0'}
                onChange={(e) => handleMarketMetadataChange('price', parseFloat(e.target.value) || 0)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={marketMetadata.currency || 'USD'}
                onChange={(e) => handleMarketMetadataChange('currency', e.target.value)}
                placeholder="USD"
              />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edition-size">Edition Size</Label>
            <Input
              id="edition-size"
              type="number"
              min="1"
              value={marketMetadata.editionSize?.toString() || '1'}
              onChange={(e) => handleMarketMetadataChange('editionSize', parseInt(e.target.value) || 1)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edition-number">Edition Number</Label>
            <Input
              id="edition-number"
              type="number"
              min="1"
              max={marketMetadata.editionSize || 1}
              value={marketMetadata.editionNumber?.toString() || '1'}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                const max = marketMetadata.editionSize || 1;
                handleMarketMetadataChange('editionNumber', Math.min(value, max));
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizeStep;
