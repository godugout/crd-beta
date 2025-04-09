
import { supabase } from '@/lib/supabase';
import { DigitalAsset, AssetUploadOptions } from '@/lib/dam/assetService';

export const assetApi = {
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
        query = query.overlaps('tags', options.tags);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching assets:', error);
        throw new Error(error.message);
      }
      
      if (!data) {
        return [];
      }
      
      // Transform to DigitalAsset format
      return data.map(item => ({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        mimeType: item.mime_type,
        storagePath: item.storage_path,
        publicUrl: supabase.storage.from('assets').getPublicUrl(item.storage_path).data.publicUrl,
        thumbnailUrl: item.thumbnail_path ? 
          supabase.storage.from('assets').getPublicUrl(item.thumbnail_path).data.publicUrl :
          supabase.storage.from('assets').getPublicUrl(item.storage_path).data.publicUrl,
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
      }));
    } catch (err) {
      console.error('Unexpected error in getAssets:', err);
      throw err;
    }
  },
  
  /**
   * Upload an asset
   */
  uploadAsset: async (file: File, options: AssetUploadOptions = {}): Promise<{ url: string, id: string } | null> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
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
        throw new Error(`Error uploading file: ${uploadError.message}`);
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
        // Try to delete the uploaded file to avoid orphaned files
        await supabase.storage.from('assets').remove([filePath]);
        throw new Error(`Error creating asset record: ${assetError.message}`);
      }
      
      return {
        url: publicUrl,
        id: asset.id
      };
    } catch (err: any) {
      console.error('Error in uploadAsset:', err);
      throw err;
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
        throw new Error(`Error fetching asset: ${fetchError?.message}`);
      }
      
      // Delete the file from storage
      const filesToDelete = [asset.storage_path];
      if (asset.thumbnail_path) {
        filesToDelete.push(asset.thumbnail_path);
      }
      
      await supabase.storage
        .from('assets')
        .remove(filesToDelete);
      
      // Delete the record
      const { error: deleteError } = await supabase
        .from('digital_assets')
        .delete()
        .eq('id', assetId);
      
      if (deleteError) {
        throw new Error(`Error deleting asset record: ${deleteError.message}`);
      }
      
      return true;
    } catch (err) {
      console.error('Error in deleteAsset:', err);
      throw err;
    }
  },
  
  /**
   * Update asset tags
   */
  updateAssetTags: async (assetId: string, tags: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('digital_assets')
        .update({ tags })
        .eq('id', assetId);
      
      if (error) {
        throw new Error(`Error updating asset tags: ${error.message}`);
      }
      
      return true;
    } catch (err) {
      console.error('Error in updateAssetTags:', err);
      throw err;
    }
  }
};
