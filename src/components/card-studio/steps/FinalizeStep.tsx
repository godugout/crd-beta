
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FinalizeStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const FinalizeStep: React.FC<FinalizeStepProps> = ({ cardData, onUpdate }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Ensure we have designMetadata with empty values as needed
  const designMetadata = cardData.designMetadata || {
    cardStyle: {
      template: 'classic',
      effect: 'none',
      borderRadius: '8px',
      borderColor: '#000000',
      shadowColor: 'rgba(0,0,0,0.2)',
      frameWidth: 2,
      frameColor: '#000000'
    },
    textStyle: {
      fontFamily: 'Inter',
      titleColor: '#000000',
      titleAlignment: 'center',
      titleWeight: 'bold',
      descriptionColor: '#333333'
    },
    cardMetadata: {
      category: 'general',
      series: 'base',
      cardType: 'standard'
    },
    marketMetadata: {
      isPrintable: false,
      isForSale: false,
      includeInCatalog: false,
      price: 0,
      currency: 'USD',
      availableForSale: false,
      editionSize: 1,
      editionNumber: 1
    }
  };
  
  // Get market metadata with fallback
  const marketMetadata = designMetadata.marketMetadata || {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false,
    price: 0,
    currency: 'USD',
    availableForSale: false,
    editionSize: 1,
    editionNumber: 1
  };

  // Handle market metadata changes
  const handleMarketChange = (property: keyof typeof marketMetadata, value: any) => {
    onUpdate({
      designMetadata: {
        ...designMetadata,
        marketMetadata: {
          ...marketMetadata,
          [property]: value
        }
      }
    });
  };
  
  // Handle card metadata changes
  const handleMetadataChange = (property: string, value: any) => {
    onUpdate({
      designMetadata: {
        ...designMetadata,
        cardMetadata: {
          ...(designMetadata.cardMetadata || {}),
          [property]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Finalize Details</h2>
      
      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Card Details</TabsTrigger>
          <TabsTrigger value="market">Market Settings</TabsTrigger>
          {showAdvanced && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={(designMetadata.cardMetadata?.category as string) || 'general'}
                onValueChange={(value) => handleMetadataChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="collectibles">Collectibles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Series</Label>
              <Input 
                value={(designMetadata.cardMetadata?.series as string) || 'base'}
                onChange={(e) => handleMetadataChange('series', e.target.value)}
                placeholder="e.g. Base Set, Limited Edition"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Card Type</Label>
              <Select
                value={(designMetadata.cardMetadata?.cardType as string) || 'standard'}
                onValueChange={(value) => handleMetadataChange('cardType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                  <SelectItem value="limited">Limited Edition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Card Edition</Label>
              <Input 
                value={(designMetadata.cardMetadata?.edition as string) || ''}
                onChange={(e) => handleMetadataChange('edition', e.target.value)}
                placeholder="e.g. First Edition, Rookie"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="market" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="isPrintable">Enable Physical Printing</Label>
              <Switch
                id="isPrintable"
                checked={marketMetadata.isPrintable}
                onCheckedChange={(checked) => handleMarketChange('isPrintable', checked)}
              />
            </div>
            <p className="text-xs text-gray-500">
              Allow this card to be printed as a physical product
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="isForSale">Available For Sale</Label>
              <Switch
                id="isForSale"
                checked={marketMetadata.isForSale}
                onCheckedChange={(checked) => handleMarketChange('isForSale', checked)}
              />
            </div>
            <p className="text-xs text-gray-500">
              Make this card available for purchase by others
            </p>
          </div>
          
          {marketMetadata.isForSale && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <div className="flex">
                  <Input
                    type="number"
                    value={marketMetadata.price || 0}
                    onChange={(e) => handleMarketChange('price', parseFloat(e.target.value))}
                    min={0}
                    step={0.01}
                    className="rounded-r-none"
                  />
                  <Select
                    value={marketMetadata.currency || 'USD'}
                    onValueChange={(value) => handleMarketChange('currency', value)}
                  >
                    <SelectTrigger className="w-24 rounded-l-none border-l-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Edition Size</Label>
                <Input
                  type="number"
                  value={marketMetadata.editionSize || 1}
                  onChange={(e) => handleMarketChange('editionSize', parseInt(e.target.value))}
                  min={1}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="includeInCatalog">Include in Public Catalog</Label>
              <Switch
                id="includeInCatalog"
                checked={marketMetadata.includeInCatalog}
                onCheckedChange={(checked) => handleMarketChange('includeInCatalog', checked)}
              />
            </div>
            <p className="text-xs text-gray-500">
              Display this card in public galleries and search results
            </p>
          </div>
        </TabsContent>
        
        {showAdvanced && (
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea 
                placeholder="Add any additional notes or details about this card..."
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      <div className="pt-4">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>
      </div>
    </div>
  );
};

export default FinalizeStep;
