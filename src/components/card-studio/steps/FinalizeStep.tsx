import React, { useState } from 'react';
import { Card, CardMetadata, MarketMetadata, DesignMetadata } from '@/lib/types/cardTypes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FinalizeStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

// Default metadata with required fields to prevent type errors
const defaultCardMetadata: CardMetadata = {
  category: 'general',
  series: 'base',
  cardType: 'standard'
};

// Default market metadata with required fields
const defaultMarketMetadata: MarketMetadata = {
  isPrintable: false,
  isForSale: false,
  includeInCatalog: false
};

// Default text style with required fields
const defaultTextStyle = {
  titleColor: '#000000',
  titleAlignment: 'center',
  titleWeight: 'bold',
  descriptionColor: '#333333'
};

// Default card style with required fields
const defaultCardStyle = {
  template: 'standard',
  effect: 'none',
  borderRadius: '8px',
  borderColor: '#000000',
  shadowColor: 'rgba(0,0,0,0.1)',
  frameWidth: 2,
  frameColor: '#000000'
};

// Create a default design metadata object
const defaultDesignMetadata: DesignMetadata = {
  cardStyle: defaultCardStyle,
  textStyle: defaultTextStyle,
  cardMetadata: defaultCardMetadata,
  marketMetadata: defaultMarketMetadata
};

const FinalizeStep: React.FC<FinalizeStepProps> = ({ cardData, onUpdate }) => {
  const [currentTab, setCurrentTab] = useState("details");
  const [isForSale, setIsForSale] = useState(
    cardData.designMetadata?.marketMetadata?.isForSale || false
  );
  const [isPrintable, setIsPrintable] = useState(
    cardData.designMetadata?.marketMetadata?.isPrintable || false
  );
  
  const handleTagChange = (tagString: string) => {
    const tags = tagString.split(',').map(tag => tag.trim()).filter(Boolean);
    onUpdate({ tags });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value);
    updateMarketMetadata({
      price: isNaN(price) ? 0 : price
    });
  };

  const handleIsForSaleChange = (checked: boolean) => {
    setIsForSale(checked);
    updateMarketMetadata({
      isForSale: checked
    });
  };

  const handleIsPrintableChange = (checked: boolean) => {
    setIsPrintable(checked);
    updateMarketMetadata({
      isPrintable: checked
    });
  };

  const updateMarketMetadata = (updates: Partial<MarketMetadata>) => {
    const currentDesignMetadata = cardData.designMetadata || {...defaultDesignMetadata};
    const currentMarketMetadata = currentDesignMetadata.marketMetadata || defaultMarketMetadata;
    
    onUpdate({
      designMetadata: {
        ...currentDesignMetadata,
        marketMetadata: {
          ...currentMarketMetadata,
          ...updates
        }
      }
    });
  };
  
  const updateCardMetadata = (updates: Partial<CardMetadata>) => {
    const currentDesignMetadata = cardData.designMetadata || {...defaultDesignMetadata};
    const currentCardMetadata = currentDesignMetadata.cardMetadata || defaultCardMetadata;
    
    onUpdate({
      designMetadata: {
        ...currentDesignMetadata,
        cardMetadata: {
          ...currentCardMetadata,
          ...updates
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Finalize Your Card</h2>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="details">Card Details</TabsTrigger>
          <TabsTrigger value="market">Market Options</TabsTrigger>
          <TabsTrigger value="publish">Publishing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="card-title">Card Title</Label>
              <Input 
                id="card-title" 
                value={cardData.title || ''} 
                onChange={(e) => onUpdate({ title: e.target.value })} 
              />
            </div>
            
            <div>
              <Label htmlFor="card-description">Description</Label>
              <Input 
                id="card-description" 
                value={cardData.description || ''} 
                onChange={(e) => onUpdate({ description: e.target.value })} 
              />
            </div>
            
            <div>
              <Label htmlFor="card-tags">Tags (comma separated)</Label>
              <Input 
                id="card-tags" 
                value={cardData.tags?.join(', ') || ''} 
                onChange={(e) => handleTagChange(e.target.value)} 
                placeholder="sports, baseball, collectible" 
              />
            </div>
            
            <div>
              <Label htmlFor="card-category">Category</Label>
              <Input 
                id="card-category" 
                value={cardData.designMetadata?.cardMetadata?.category || defaultCardMetadata.category} 
                onChange={(e) => updateCardMetadata({ category: e.target.value })} 
              />
            </div>
            
            <div>
              <Label htmlFor="card-series">Series</Label>
              <Input 
                id="card-series" 
                value={cardData.designMetadata?.cardMetadata?.series || defaultCardMetadata.series} 
                onChange={(e) => updateCardMetadata({ series: e.target.value })} 
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="market" className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is-for-sale">Available for Sale</Label>
              <Switch 
                id="is-for-sale"
                checked={isForSale}
                onCheckedChange={handleIsForSaleChange}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Make this card available for purchase in the marketplace
            </p>
          </div>
          
          {isForSale && (
            <div>
              <Label htmlFor="card-price">Price</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input 
                  id="card-price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={cardData.designMetadata?.marketMetadata?.price || 0} 
                  onChange={handlePriceChange} 
                />
              </div>
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is-printable">Printable</Label>
              <Switch 
                id="is-printable"
                checked={isPrintable}
                onCheckedChange={handleIsPrintableChange}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Allow users to order physical prints of this card
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="publish" className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is-public">Public Card</Label>
              <Switch 
                id="is-public"
                checked={cardData.isPublic !== false}
                onCheckedChange={(checked) => onUpdate({ isPublic: checked })}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              When published, your card will be visible to everyone
            </p>
            
            <div className="mt-4">
              <Button className="w-full">Publish Card</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinalizeStep;
