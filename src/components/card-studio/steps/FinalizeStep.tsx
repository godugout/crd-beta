
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SocialMediaCard } from '@/components/ui/social-media-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Printer,
  CreditCard
} from 'lucide-react';

interface FinalizeStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
  onSave?: () => void;
}

const FinalizeStep: React.FC<FinalizeStepProps> = ({ 
  cardData, 
  onUpdate,
  onSave
}) => {
  const [reviewComplete, setReviewComplete] = useState(false);
  const [sharingOptions, setSharingOptions] = useState({
    isPublic: true,
    allowComments: true,
    addToGallery: true,
    showAttribution: true
  });
  
  // Market metadata with defaults
  const marketMetadata = cardData.designMetadata?.marketMetadata || {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false
  };
  
  // Handle market metadata changes
  const handleMarketOptionChange = (property: string, value: boolean) => {
    onUpdate({
      designMetadata: {
        ...cardData.designMetadata,
        marketMetadata: {
          ...marketMetadata,
          [property]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Finalize Your Card</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review your card and prepare it for publishing
        </p>
      </div>
      
      <Tabs defaultValue="review">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>
        
        {/* Review Tab */}
        <TabsContent value="review" className="space-y-4">
          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Card Details</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Title:</span>
                <span className="text-sm font-medium">{cardData.title || 'Untitled'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Player:</span>
                <span className="text-sm font-medium">{cardData.player || 'Not specified'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Team:</span>
                <span className="text-sm font-medium">{cardData.team || 'Not specified'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Year:</span>
                <span className="text-sm font-medium">{cardData.year || 'Not specified'}</span>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {cardData.tags && cardData.tags.length > 0 ? (
                    cardData.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm italic">No tags</span>
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">Applied Effects:</span>
                <div className="flex flex-wrap gap-1">
                  {cardData.effects && cardData.effects.length > 0 ? (
                    cardData.effects.map((effect, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {effect}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm italic">No effects</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <label className="flex items-center space-x-2">
                <Switch 
                  checked={reviewComplete}
                  onCheckedChange={setReviewComplete}
                />
                <span className="text-sm font-medium">I've reviewed my card details</span>
              </label>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Quality Check</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="mr-2">
                  {cardData.imageUrl ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">Card Image</h4>
                  <p className="text-xs text-gray-500">
                    {cardData.imageUrl 
                      ? 'Image uploaded and properly sized'
                      : 'No image uploaded'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-2">
                  {cardData.title ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">Card Title</h4>
                  <p className="text-xs text-gray-500">
                    {cardData.title 
                      ? 'Title provided'
                      : 'Title is missing'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-2">
                  {cardData.tags && cardData.tags.length > 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">Card Tags</h4>
                  <p className="text-xs text-gray-500">
                    {cardData.tags && cardData.tags.length > 0 
                      ? `${cardData.tags.length} tags provided`
                      : 'No tags added (recommended)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Share Tab */}
        <TabsContent value="share" className="space-y-4">
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Visibility Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is-public" className="cursor-pointer">
                  <div>
                    <span className="font-medium">Make card public</span>
                    <p className="text-xs text-gray-500">
                      Allow your card to be viewed by others
                    </p>
                  </div>
                </Label>
                <Switch 
                  id="is-public"
                  checked={sharingOptions.isPublic}
                  onCheckedChange={(checked) => 
                    setSharingOptions({...sharingOptions, isPublic: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-comments" className="cursor-pointer">
                  <div>
                    <span className="font-medium">Allow comments</span>
                    <p className="text-xs text-gray-500">
                      Let others comment on your card
                    </p>
                  </div>
                </Label>
                <Switch 
                  id="allow-comments"
                  checked={sharingOptions.allowComments}
                  onCheckedChange={(checked) => 
                    setSharingOptions({...sharingOptions, allowComments: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="add-to-gallery" className="cursor-pointer">
                  <div>
                    <span className="font-medium">Add to gallery</span>
                    <p className="text-xs text-gray-500">
                      Include your card in the public gallery
                    </p>
                  </div>
                </Label>
                <Switch 
                  id="add-to-gallery"
                  checked={sharingOptions.addToGallery}
                  onCheckedChange={(checked) => 
                    setSharingOptions({...sharingOptions, addToGallery: checked})
                  }
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Sharing Options</h3>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1"
              >
                <Share2 className="h-4 w-4" />
                <span>Social Media</span>
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <QrCode className="h-4 w-4" />
                <span>QR Code</span>
              </Button>
            </div>
            
            <div className="mt-4">
              <Input 
                readOnly
                value="https://cardshow.com/card/abcdef123"
                className="bg-gray-100"
              />
            </div>
          </div>
        </TabsContent>
        
        {/* Market Tab */}
        <TabsContent value="market" className="space-y-4">
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Market Options</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is-printable" className="cursor-pointer">
                  <div>
                    <span className="font-medium">Enable printing</span>
                    <p className="text-xs text-gray-500">
                      Allow users to order physical prints of this card
                    </p>
                  </div>
                </Label>
                <Switch 
                  id="is-printable"
                  checked={marketMetadata.isPrintable}
                  onCheckedChange={(checked) => 
                    handleMarketOptionChange('isPrintable', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="is-for-sale" className="cursor-pointer">
                  <div>
                    <span className="font-medium">List for sale</span>
                    <p className="text-xs text-gray-500">
                      Make this card available for purchase as a digital collectible
                    </p>
                  </div>
                </Label>
                <Switch 
                  id="is-for-sale"
                  checked={marketMetadata.isForSale}
                  onCheckedChange={(checked) => 
                    handleMarketOptionChange('isForSale', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-catalog" className="cursor-pointer">
                  <div>
                    <span className="font-medium">Include in catalog</span>
                    <p className="text-xs text-gray-500">
                      Add to the searchable marketplace catalog
                    </p>
                  </div>
                </Label>
                <Switch 
                  id="include-catalog"
                  checked={marketMetadata.includeInCatalog}
                  onCheckedChange={(checked) => 
                    handleMarketOptionChange('includeInCatalog', checked)
                  }
                />
              </div>
            </div>
          </div>
          
          {marketMetadata.isForSale && (
            <div className="bg-gray-50 border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Pricing & Availability</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input 
                      id="price" 
                      type="number" 
                      className="pl-7" 
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="edition-size">Edition Size</Label>
                  <Input 
                    id="edition-size" 
                    type="number" 
                    placeholder="Limited edition size (leave empty for unlimited)"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set the total number of copies available
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Set Up Payment Details
                </Button>
              </div>
            </div>
          )}
          
          {marketMetadata.isPrintable && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Printer className="h-4 w-4 mr-1" />
                Print Options
              </h3>
              <p className="text-xs">
                Print services are enabled for this card. Configure print options and quality settings
                in the full marketplace dashboard after saving.
              </p>
              <Button 
                variant="link" 
                size="sm"
                className="text-blue-600 p-0 h-auto text-xs mt-1"
              >
                Learn more about printing
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="pt-4 border-t flex justify-between">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-1" />
          Download Draft
        </Button>
        
        <Button
          disabled={!reviewComplete}
          onClick={onSave}
        >
          <Save className="h-4 w-4 mr-1" />
          Finalize Card
        </Button>
      </div>
    </div>
  );
};

export default FinalizeStep;
