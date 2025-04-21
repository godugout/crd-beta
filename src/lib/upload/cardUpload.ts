
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export interface CardMetadata {
  title: string;
  description: string;
  player?: string;
  team?: string;
  year?: string;
  tags?: string[];
}

export const uploadCardImage = async (
  file: File, 
  metadata: CardMetadata
): Promise<{ imageUrl: string; assetId: string } | null> => {
  // Validate inputs
  if (!metadata.title || !metadata.description) {
    toast.error('Title and description are required');
    return null;
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    toast.error('File size must be less than 10MB');
    return null;
  }

  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `ballers/${fileName}`;

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('card-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      toast.error('Failed to upload image');
      console.error('Upload error:', uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('card-images')
      .getPublicUrl(filePath);

    // Get the authenticated user ID
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      toast.error('You must be logged in to upload images');
      return null;
    }

    // Create asset record in digital_assets with all required fields
    const { data: assetData, error: assetError } = await supabase
      .from('digital_assets')
      .insert({
        title: metadata.title,
        description: metadata.description,
        storage_path: filePath,
        original_filename: file.name,
        mime_type: file.type,
        file_size: file.size,
        user_id: userId,
        tags: metadata.tags || [],
        metadata: {
          player: metadata.player,
          team: metadata.team,
          year: metadata.year
        }
      })
      .select('id')
      .single();

    if (assetError) {
      toast.error('Failed to save asset metadata');
      console.error('Asset error:', assetError);
      return null;
    }

    return { 
      imageUrl: publicUrl, 
      assetId: assetData.id 
    };

  } catch (error) {
    console.error('Unexpected upload error:', error);
    toast.error('Failed to upload card');
    return null;
  }
};
