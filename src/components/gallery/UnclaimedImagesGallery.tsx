
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type DigitalAsset = {
  id: string;
  original_filename: string;
  storage_path: string;
  mime_type: string;
  created_at: string;
}

export const UnclaimedImagesGallery: React.FC = () => {
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnclaimedAssets = async () => {
      try {
        setLoading(true);
        // Explicitly type the return value to avoid deep instantiation
        const { data, error } = await supabase
          .from('digital_assets')
          .select('*')
          .is('reference_id', null)
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) throw error;
        setAssets(data || []);
      } catch (err) {
        console.error('Error fetching unclaimed assets:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUnclaimedAssets();
  }, []);
  
  const handleCreateCard = (assetId: string) => {
    navigate(`/cards/create?assetId=${assetId}`);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recently Uploaded Images</h2>
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No unclaimed images found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {assets.map(asset => (
            <Card key={asset.id} className="overflow-hidden">
              <div className="aspect-square bg-muted relative">
                {asset.mime_type.startsWith('image/') ? (
                  <img
                    src={`https://wxlwhqlbxyuyujhqeyur.supabase.co/storage/v1/object/public/card-images/${asset.storage_path}`}
                    alt={asset.original_filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    <span>{asset.mime_type}</span>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-sm truncate" title={asset.original_filename}>
                  {asset.original_filename}
                </p>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="w-full mt-2 h-8"
                  onClick={() => handleCreateCard(asset.id)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Create Card
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
