
import { supabase } from '@/lib/supabase';

export interface DigitalAsset {
  id: string;
  title: string;
  description?: string;
  mimeType: string;
  storagePath: string;
  publicUrl: string;
  thumbnailUrl: string;
  fileSize: number;
  width?: number;
  height?: number;
  thumbnailPath?: string;
  tags: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  userId: string;
  originalFilename: string;
  cardId?: string;
  collectionId?: string;
  assetType?: string;
}

export interface AssetUploadOptions {
  title?: string;
  description?: string;
  tags?: string[];
  cardId?: string;
  collectionId?: string;
  assetType?: string;
  metadata?: any;
}

export interface AssetUploadResult {
  url: string;
  id: string;
}

/**
 * Service for managing digital assets in the application
 */
export const assetService = {
  /**
   * Upload a file to the storage and create an asset record
   */
  uploadAsset: async (file: File, options: AssetUploadOptions = {}): Promise<AssetUploadResult | null> => {
    try {
      if (!file) {
        console.error('No file provided for upload');
        return null;
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return null;
      }
      
      // Create a unique path for the file
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `uploads/${user.id}/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Error uploading file to storage:', uploadError);
        return null;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
      
      // Create asset record in DB
      const assetData = {
        title: options.title || file.name,
        description: options.description || '',
        mime_type: file.type,
        storage_path: filePath,
        file_size: file.size,
        tags: options.tags || [],
        metadata: options.metadata || {},
        original_filename: file.name,
        user_id: user.id,
        card_id: options.cardId,
        collection_id: options.collectionId,
        asset_type: options.assetType || 'image'
      };
      
      const { data: asset, error: assetError } = await supabase
        .from('digital_assets')
        .insert(assetData)
        .select()
        .single();
      
      if (assetError) {
        console.error('Error creating asset record:', assetError);
        // Attempt to delete the uploaded file to avoid orphaned files
        await supabase.storage.from('assets').remove([filePath]);
        return null;
      }
      
      return {
        url: publicUrl,
        id: asset.id
      };
    } catch (err) {
      console.error('Unexpected error in uploadAsset:', err);
      return null;
    }
  },
  
  /**
   * Get assets with optional filtering
   */
  getAssets: async (options: {
    cardId?: string;
    collectionId?: string;
    tags?: string[];
  } = {}): Promise<DigitalAsset[]> => {
    try {
      let query = supabase
        .from('digital_assets')
        .select('*');
      
      if (options.cardId) {
        query = query.eq('card_id', options.cardId);
      }
      
      if (options.collectionId) {
        query = query.eq('collection_id', options.collectionId);
      }
      
      if (options.tags && options.tags.length > 0) {
        // Find assets that have ANY of the specified tags
        query = query.overlaps('tags', options.tags);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching assets:', error);
        return [];
      }
      
      if (!data) {
        return [];
      }
      
      // Transform results to DigitalAsset format and get public URLs
      return data.map(item => {
        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(item.storage_path);
        
        let thumbnailUrl = publicUrl;
        if (item.thumbnail_path) {
          const { data: { publicUrl: thumbUrl } } = supabase.storage
            .from('assets')
            .getPublicUrl(item.thumbnail_path);
          thumbnailUrl = thumbUrl;
        }
        
        return {
          id: item.id,
          title: item.title || '',
          description: item.description,
          mimeType: item.mime_type,
          storagePath: item.storage_path,
          publicUrl: publicUrl,
          thumbnailUrl: thumbnailUrl,
          fileSize: item.file_size,
          width: item.width,
          height: item.height,
          thumbnailPath: item.thumbnail_path,
          tags: item.tags || [],
          metadata: item.metadata || {},
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          userId: item.user_id,
          originalFilename: item.original_filename,
          cardId: item.card_id,
          collectionId: item.collection_id,
          assetType: item.asset_type
        };
      });
    } catch (err) {
      console.error('Unexpected error in getAssets:', err);
      return [];
    }
  },
  
  /**
   * Delete an asset
   */
  deleteAsset: async (assetId: string): Promise<boolean> => {
    try {
      // First get the asset to know the file path
      const { data: asset, error: fetchError } = await supabase
        .from('digital_assets')
        .select('storage_path, thumbnail_path')
        .eq('id', assetId)
        .single();
      
      if (fetchError || !asset) {
        console.error('Error fetching asset for deletion:', fetchError);
        return false;
      }
      
      // Delete the file from storage
      const filesToDelete = [asset.storage_path];
      if (asset.thumbnail_path) {
        filesToDelete.push(asset.thumbnail_path);
      }
      
      const { error: storageError } = await supabase.storage
        .from('assets')
        .remove(filesToDelete);
      
      if (storageError) {
        console.error('Error deleting asset files:', storageError);
        // Continue with deletion of the record anyway
      }
      
      // Delete the record
      const { error: deleteError } = await supabase
        .from('digital_assets')
        .delete()
        .eq('id', assetId);
      
      if (deleteError) {
        console.error('Error deleting asset record:', deleteError);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Unexpected error in deleteAsset:', err);
      return false;
    }
  }
};
