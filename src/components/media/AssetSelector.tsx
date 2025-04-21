
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { Image } from 'lucide-react';

interface AssetSelectorProps {
  userId: string;
  onSelect: (selectedAssets: string[]) => void;
  maxSelections?: number;
  initialSelection?: string[];
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({ 
  userId, 
  onSelect,
  maxSelections = Infinity,
  initialSelection = []
}) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(initialSelection);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAssets = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('digital_assets')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setAssets(data || []);
      } catch (err: any) {
        console.error('Error fetching assets:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserAssets();
    }
  }, [userId]);

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev => {
      // If already selected, remove it
      if (prev.includes(assetId)) {
        return prev.filter(id => id !== assetId);
      }
      
      // If at max selections, prevent adding more
      if (prev.length >= maxSelections) {
        return prev;
      }
      
      // Add the new selection
      const updatedSelection = [...prev, assetId];
      onSelect(updatedSelection); // Notify parent component
      return updatedSelection;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading assets: {error}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center p-8">
        <Image className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium">No assets found</h3>
        <p className="mt-1 text-sm text-gray-500">Upload some images to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-sm">
          Select assets ({selectedAssets.length}/{maxSelections === Infinity ? 'unlimited' : maxSelections})
        </h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {assets.map((asset) => {
          const isSelected = selectedAssets.includes(asset.id);
          const imageUrl = `https://wxlwhqlbxyuyujhqeyur.supabase.co/storage/v1/object/public/card-images/${asset.storage_path}`;
          
          return (
            <Card 
              key={asset.id} 
              className={`overflow-hidden cursor-pointer ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleAssetToggle(asset.id)}
            >
              <div className="aspect-square relative bg-gray-100">
                <img
                  src={imageUrl}
                  alt={asset.title || asset.original_filename || 'Asset'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Checkbox checked={isSelected} />
                </div>
              </div>
              <CardContent className="p-2">
                <p className="text-xs truncate">
                  {asset.title || asset.original_filename || 'Untitled'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button
          onClick={() => onSelect(selectedAssets)}
          disabled={selectedAssets.length === 0}
        >
          Use Selected Assets ({selectedAssets.length})
        </Button>
      </div>
    </div>
  );
};
