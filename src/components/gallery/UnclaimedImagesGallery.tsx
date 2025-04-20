
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Image, Heart } from 'lucide-react';
import { toast } from 'sonner';

// Define the type to match the actual structure from Supabase
interface DigitalAsset {
  id: string;
  title: string | null;
  description: string | null;
  storage_path: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  original_filename: string;
  metadata: Record<string, any> | null;
  thumbnail_path: string | null;
}

export const UnclaimedImagesGallery = () => {
  const { data: unclaimedAssets, isLoading } = useQuery({
    queryKey: ['unclaimedAssets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('digital_assets')
        .select('*')
        .eq('claimed', false)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
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
