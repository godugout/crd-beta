
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export interface DigitalAsset {
  id: string;
  title?: string;
  description?: string;
  mimeType: string;
  storagePath: string;
  publicUrl: string;
  thumbnailPath?: string;
  fileSize: number;
  width?: number;
  height?: number;
  userId: string;
  tags?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface AssetUploadOptions {
  title?: string;
  description?: string;
  tags?: string[];
  cardId?: string;
  collectionId?: string;
  metadata?: any;
}

/**
 * Service for managing digital assets in the DAM system
 */
export const assetService = {
  /**
   * Upload a file to storage and create a database entry
   */
  uploadAsset: async (file: File, options: AssetUploadOptions = {}): Promise<DigitalAsset | null> => {
    try {
      // 1. Generate a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const folderPath = 'cards'; // Organize assets by type
      const filePath = `${folderPath}/${fileName}`;
      
      // 2. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('card-images')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('Failed to upload image: ' + uploadError.message);
        return null;
      }
      
      // 3. Get the public URL
      const { data: urlData } = supabase.storage
        .from('card-images')
        .getPublicUrl(filePath);
        
      // 4. Create asset record in database
      const insertData = {
        title: options.title || file.name,
        description: options.description,
        mime_type: file.type,
        storage_path: filePath,
        file_size: file.size,
        tags: options.tags || [],
        metadata: options.metadata || {},
        original_filename: file.name,
        card_id: options.cardId,
        collection_id: options.collectionId,
        asset_type: file.type.startsWith('image/') ? 'image' : 'document'
      };
      
      // Add the public URL separately if it exists
      const publicUrl = urlData?.publicUrl || '';
      
      // Create the database record
      const { data: asset, error: dbError } = await supabase
        .from('digital_assets')
        .insert({
          ...insertData
        })
        .select('*')
        .single();
      
      if (dbError) {
        console.error('Error creating asset record:', dbError);
        // Try to clean up the uploaded file if database record fails
        await supabase.storage
          .from('card-images')
          .remove([filePath]);
        toast.error('Failed to save asset metadata');
        return null;
      }
      
      toast.success('Asset uploaded successfully');
      
      // 5. Transform database schema to our model
      return {
        id: asset.id,
        title: asset.title,
        description: asset.description || undefined,
        mimeType: asset.mime_type,
        storagePath: asset.storage_path,
        publicUrl: publicUrl, // Use the separately obtained public URL
        thumbnailPath: asset.thumbnail_path || undefined,
        fileSize: asset.file_size,
        width: asset.width || undefined,
        height: asset.height || undefined,
        userId: asset.user_id,
        tags: asset.tags || [],
        metadata: asset.metadata || {},
        createdAt: asset.created_at,
        updatedAt: asset.updated_at
      };
    } catch (err) {
      console.error('Unexpected error during asset upload:', err);
      toast.error('Failed to upload file');
      return null;
    }
  },
  
  /**
   * Get all assets with optional filtering
   */
  getAssets: async (options: { cardId?: string; collectionId?: string; tags?: string[] } = {}): Promise<DigitalAsset[]> => {
    try {
      let query = supabase
        .from('digital_assets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (options.cardId) {
        query = query.eq('card_id', options.cardId);
      }
      
      if (options.collectionId) {
        query = query.eq('collection_id', options.collectionId);
      }
      
      if (options.tags && options.tags.length > 0) {
        query = query.contains('tags', options.tags);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching assets:', error);
        return [];
      }
      
      // Get public URLs for all assets
      return data.map(asset => {
        const { data: urlData } = supabase.storage
          .from('card-images')
          .getPublicUrl(asset.storage_path);
          
        return {
          id: asset.id,
          title: asset.title,
          description: asset.description || undefined,
          mimeType: asset.mime_type,
          storagePath: asset.storage_path,
          publicUrl: urlData?.publicUrl || '', // Use the storage URL
          thumbnailPath: asset.thumbnail_path || undefined,
          fileSize: asset.file_size,
          width: asset.width || undefined,
          height: asset.height || undefined,
          userId: asset.user_id,
          tags: asset.tags || [],
          metadata: asset.metadata || {},
          createdAt: asset.created_at,
          updatedAt: asset.updated_at
        };
      });
    } catch (err) {
      console.error('Error fetching assets:', err);
      return [];
    }
  },
  
  /**
   * Delete an asset and its storage file
   */
  deleteAsset: async (assetId: string): Promise<boolean> => {
    try {
      // Get the asset to retrieve its storage path
      const { data: asset, error: fetchError } = await supabase
        .from('digital_assets')
        .select('storage_path')
        .eq('id', assetId)
        .single();
      
      if (fetchError || !asset) {
        console.error('Error finding asset:', fetchError);
        return false;
      }
      
      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('card-images')
        .remove([asset.storage_path]);
      
      if (storageError) {
        console.error('Error removing file from storage:', storageError);
      }
      
      // Delete the database record
      const { error: dbError } = await supabase
        .from('digital_assets')
        .delete()
        .eq('id', assetId);
      
      if (dbError) {
        console.error('Error deleting asset record:', dbError);
        return false;
      }
      
      toast.success('Asset deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting asset:', err);
      toast.error('Failed to delete asset');
      return false;
    }
  }
};
