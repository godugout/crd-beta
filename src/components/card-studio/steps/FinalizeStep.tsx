
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus } from 'lucide-react';

interface FinalizeStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const FinalizeStep: React.FC<FinalizeStepProps> = ({ cardData, onUpdate }) => {
  const [tagInput, setTagInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle adding a tag
  const handleAddTag = () => {
    if (!tagInput.trim()) {
      return;
    }
    
    // Check if tag already exists
    if (cardData.tags?.includes(tagInput.trim())) {
      setErrorMessage('This tag already exists');
      return;
    }
    
    // Add the tag
    const newTags = [...(cardData.tags || []), tagInput.trim()];
    onUpdate({ tags: newTags });
    setTagInput('');
    setErrorMessage('');
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tag: string) => {
    const newTags = cardData.tags?.filter(t => t !== tag) || [];
    onUpdate({ tags: newTags });
  };
  
  // Handle Enter key in tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Handle player, team, year updates
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };
  
  // Handle market metadata changes
  const handleMarketMetadataChange = (field: string, value: any) => {
    const marketMetadata = {
      ...(cardData.designMetadata?.marketMetadata || {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false
      }),
      [field]: value
    };
    
    onUpdate({
      designMetadata: {
        ...(cardData.designMetadata || {}),
        marketMetadata
      }
    });
  };
  
  // Ensure we have market metadata with default values
  const marketMetadata = cardData.designMetadata?.marketMetadata || {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false,
    price: 0,
    currency: 'USD',
    availableForSale: false,
    editionSize: 1,
    editionNumber: 1
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Finalize Your Card</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="player">Player Name</Label>
            <Input
              id="player"
              value={cardData.player || ''}
              onChange={(e) => handleInputChange('player', e.target.value)}
              placeholder="Player name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="team">Team Name</Label>
            <Input
              id="team"
              value={cardData.team || ''}
              onChange={(e) => handleInputChange('team', e.target.value)}
              placeholder="Team name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              value={cardData.year || ''}
              onChange={(e) => handleInputChange('year', e.target.value)}
              placeholder="Year or season"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setErrorMessage('');
              }}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tags (e.g., rookie, special, limited)"
              className="flex-1"
            />
            <Button type="button" onClick={handleAddTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errorMessage && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {cardData.tags && cardData.tags.length > 0 ? (
              cardData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-500">No tags added yet</p>
            )}
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-4">Marketplace Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="printable" 
                checked={marketMetadata.isPrintable}
                onCheckedChange={(checked) => 
                  handleMarketMetadataChange('isPrintable', Boolean(checked))
                }
              />
              <Label htmlFor="printable">Make this card printable</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="forSale" 
                checked={marketMetadata.isForSale}
                onCheckedChange={(checked) => 
                  handleMarketMetadataChange('isForSale', Boolean(checked))
                }
              />
              <Label htmlFor="forSale">Offer this card for sale</Label>
            </div>
            
            {marketMetadata.isForSale && (
              <div className="pl-6 border-l-2 border-gray-100 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={marketMetadata.price || 0}
                      onChange={(e) => handleMarketMetadataChange('price', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={marketMetadata.currency || 'USD'}
                      onChange={(e) => handleMarketMetadataChange('currency', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editionSize">Edition Size</Label>
                    <Input
                      id="editionSize"
                      type="number"
                      min="1"
                      value={marketMetadata.editionSize || 1}
                      onChange={(e) => handleMarketMetadataChange('editionSize', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editionNumber">Edition Number</Label>
                    <Input
                      id="editionNumber"
                      type="number"
                      min="1"
                      max={marketMetadata.editionSize || 1}
                      value={marketMetadata.editionNumber || 1}
                      onChange={(e) => handleMarketMetadataChange('editionNumber', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="catalog" 
                checked={marketMetadata.includeInCatalog}
                onCheckedChange={(checked) => 
                  handleMarketMetadataChange('includeInCatalog', Boolean(checked))
                }
              />
              <Label htmlFor="catalog">Include in public catalog</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizeStep;
