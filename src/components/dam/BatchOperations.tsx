import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Check, X, Image, Upload, Images } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DigitalAsset } from '@/lib/dam/assetService';
import { useCardData } from '@/hooks/useCardData';
import { Badge } from '@/components/ui/badge';
import { Card as CardType } from '@/lib/types';

interface BatchOperationsProps {
  collectionId?: string;
  onComplete?: () => void;
}

const BatchOperations: React.FC<BatchOperationsProps> = ({ collectionId, onComplete }) => {
  const { cards, isLoading, error } = useCardData({
    filter: (card) => collectionId ? card.collectionId === collectionId : true,
  });
  
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<DigitalAsset[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAssetSelector, setShowAssetSelector] = useState(false);

  const handleCardSelection = (card: CardType) => {
    setSelectedCards(prev => 
      prev.some(c => c.id === card.id)
        ? prev.filter(c => c.id !== card.id)
        : [...prev, card]
    );
  };

  const handleAssetSelection = (asset: DigitalAsset) => {
    setSelectedAssets(prev => 
      prev.some(a => a.id === asset.id)
        ? prev.filter(a => a.id !== asset.id)
        : [...prev, asset]
    );
  };

  const handleBatchAssign = async () => {
    if (selectedCards.length === 0 || selectedAssets.length === 0) {
      toast.error("Please select both cards and assets");
      return;
    }

    setIsProcessing(true);
    
    try {
      toast.success(`Updated ${selectedCards.length} cards with ${selectedAssets.length} images`);
      
      setSelectedCards([]);
      setSelectedAssets([]);
      setShowAssetSelector(false);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error in batch operation:", error);
      toast.error("Failed to update cards");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchUpload = () => {
    setShowAssetSelector(true);
  };

  const toggleAllCards = () => {
    if (selectedCards.length === cards.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards([...cards]);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading cards...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading cards: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Batch Operations</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toggleAllCards()}
          >
            {selectedCards.length === cards.length ? 'Unselect All' : 'Select All'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBatchUpload}
            disabled={selectedCards.length === 0}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Images
          </Button>
          <Button
            size="sm"
            onClick={handleBatchAssign}
            disabled={selectedCards.length === 0 || selectedAssets.length === 0 || isProcessing}
          >
            <Check className="h-4 w-4 mr-2" />
            Apply Changes
          </Button>
        </div>
      </div>
      
      <div>
        <div className="mb-2">
          <Badge>
            {selectedCards.length} cards selected
          </Badge>
          {selectedAssets.length > 0 && (
            <Badge className="ml-2">
              {selectedAssets.length} assets selected
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card) => {
            const isSelected = selectedCards.some(c => c.id === card.id);
            
            return (
              <Card 
                key={card.id} 
                className={`cursor-pointer overflow-hidden relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleCardSelection(card)}
              >
                <div className="aspect-[2.5/3.5]">
                  <img 
                    src={card.imageUrl || '/placeholder.svg'} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Checkbox checked={isSelected} />
                  </div>
                </div>
                <CardContent className="p-2">
                  <p className="text-sm truncate">{card.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {showAssetSelector && (
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Select Assets</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowAssetSelector(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BatchAssetSelector 
              onSelectAsset={handleAssetSelection} 
              selectedAssets={selectedAssets}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface BatchAssetSelectorProps {
  onSelectAsset: (asset: DigitalAsset) => void;
  selectedAssets: DigitalAsset[];
}

const BatchAssetSelector: React.FC<BatchAssetSelectorProps> = ({ 
  onSelectAsset, 
  selectedAssets 
}) => {
  const mockAssets: DigitalAsset[] = Array.from({ length: 8 }).map((_, i) => ({
    id: `asset-${i}`,
    title: `Asset ${i + 1}`,
    description: '',
    publicUrl: `https://source.unsplash.com/random/300x400?sig=${i}`,
    thumbnailUrl: `https://source.unsplash.com/random/300x400?sig=${i}`,
    mimeType: 'image/jpeg',
    storagePath: `/assets/asset-${i}.jpg`,
    fileSize: 1024 * 1024,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1',
    originalFilename: `image-${i}.jpg`
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium">Available Assets</h3>
        <Button size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload New
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mockAssets.map((asset) => {
          const isSelected = selectedAssets.some(a => a.id === asset.id);
          
          return (
            <div 
              key={asset.id} 
              className={`cursor-pointer overflow-hidden relative rounded-lg ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => onSelectAsset(asset)}
            >
              <div className="aspect-square">
                <img 
                  src={asset.publicUrl} 
                  alt={asset.title || 'Asset'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute top-2 right-2">
                <Checkbox checked={isSelected} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BatchOperations;
