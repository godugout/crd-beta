
import { supabase } from './client';
import { toast } from 'sonner';

// Media/Storage operations
export const storageOperations = {
  /**
   * Upload an image to Supabase Storage
   */
  uploadImage: async (file: File, path: string): Promise<{ data: { path: string; url: string } | null; error: any }> => {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('card-images')
      .upload(filePath, file);
      
    if (data) {
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('card-images')
        .getPublicUrl(data.path);
        
      return { 
        data: { 
          path: data.path,
          url: publicUrl 
        }, 
        error 
      };
    }
    
    return { data: null, error };
  },
  
  /**
   * Save an extracted card to the global catalog
   */
  saveExtractedCard: async (file: File, metadata: {
    title?: string;
    description?: string;
    tags?: string[];
    cardType?: string;
    originalImageId?: string;
  }): Promise<{ data: { path: string; url: string; id: string } | null; error: any }> => {
    try {
      // 1. Upload the extracted image
      const { data, error } = await storageOperations.uploadImage(file, 'extracted-cards');
      
      if (error) throw error;
      if (!data) throw new Error('Failed to upload image');
      
      // 2. Add entry to digital_assets table if we have Supabase access
      // This would be expanded when we integrate with Supabase
      const assetId = `temp-${Date.now()}`;
      
      // TODO: When Supabase is connected, save to digital_assets table
      // For now we'll just return the simplified data
      
      return {
        data: {
          path: data.path,
          url: data.url,
          id: assetId
        },
        error: null
      };
    } catch (error) {
      console.error('Error saving extracted card:', error);
      toast.error('Failed to save extracted card');
      return { data: null, error };
    }
  },
  
  /**
   * Delete an image from storage
   */
  deleteImage: async (path: string): Promise<{ error: any }> => {
    const { error } = await supabase.storage
      .from('card-images')
      .remove([path]);
      
    return { error };
  }
};
