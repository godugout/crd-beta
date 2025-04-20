
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Image, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

// Define a simplified type for our unclaimed images
interface UnclaimedAsset {
  id: string;
  title: string | null;
  description: string | null;
  storage_path: string;
  original_filename: string;
}

// Create a dedicated function for fetching unclaimed assets with explicit typing
const fetchUnclaimedAssets = async (): Promise<UnclaimedAsset[]> => {
  const { data, error } = await supabase
    .from('digital_assets')
    .select('id, title, description, storage_path, original_filename')
    .eq('claimed', false)
    .order('created_at', { ascending: false });
    
  if (error) throw new Error(error.message);
  return (data || []) as UnclaimedAsset[];
};

export const UnclaimedImagesGallery = () => {
  // Explicitly type the query result to avoid deep type instantiation
  const { data: unclaimedAssets, isLoading } = useQuery({
    queryKey: ['unclaimedAssets'],
    queryFn: fetchUnclaimedAssets
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">
      <Spinner size="lg" />
    </div>;
  }

  if (!unclaimedAssets || unclaimedAssets.length === 0) {
    return <div className="text-center p-8">
      <Image className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium">No unclaimed images</h3>
      <p className="mt-1 text-sm text-gray-500">Upload some images to get started</p>
    </div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {unclaimedAssets.map((asset) => (
        <Card key={asset.id} className="overflow-hidden">
          <div className="aspect-square relative bg-gray-100">
            <img
              src={`https://wxlwhqlbxyuyujhqeyur.supabase.co/storage/v1/object/public/${asset.storage_path}`}
              alt={asset.title || 'Unclaimed image'}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button 
                onClick={() => {
                  toast.info("Create a card with this image to participate in the challenge! First to get 88 votes wins!");
                }}
                variant="outline"
                size="sm"
              >
                Claim & Create
              </Button>
              <div className="flex items-center text-gray-500 text-sm">
                <Heart className="h-4 w-4 mr-1" />
                <span>0/88</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UnclaimedImagesGallery;
