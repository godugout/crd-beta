
import { supabase } from '../supabase';
import { PostgrestError } from '@supabase/supabase-js';

export interface Asset {
  id: string;
  title: string;
  description?: string;
  mimeType: string;
  storagePath: string;
  fileSize: number;
  width?: number;
  height?: number;
  thumbnailPath?: string;
  tags?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt?: string;
  userId: string;
  originalFilename: string;
  cardId?: string;
  collectionId?: string;
  assetType?: string;
}

export interface AssetFilter {
  userId?: string;
  cardId?: string;
  collectionId?: string;
  assetType?: string;
  tags?: string[];
  mimeType?: string;
}

export interface AssetUploadResult {
  asset?: Asset;
  url?: string;
  thumbnailUrl?: string;
  error?: string;
}

/**
 * Service for managing digital assets
 */
export const assetService = {
  /**
   * Upload an asset to storage and register it in the database
   */
  async uploadAsset(
    file: File,
    metadata: {
      title: string;
      description?: string;
      tags?: string[];
      userId: string;
      cardId?: string;
      collectionId?: string;
      assetType?: string;
      width?: number;
      height?: number;
    }
  ): Promise<AssetUploadResult> {
    try {
      // Generate a unique path for the file in storage
      const fileExt = file.name.split('.').pop();
      const filePath = `uploads/${metadata.userId}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return { error: uploadError.message };
      }
      
      // Create database entry for the asset
      const assetData = {
        title: metadata.title,
        description: metadata.description || '',
        mime_type: file.type,
        storage_path: filePath,
        file_size: file.size,
        width: metadata.width,
        height: metadata.height,
        tags: metadata.tags || [],
        metadata: {
          originalName: file.name,
          assetType: metadata.assetType || 'image'
        },
        original_filename: file.name,
        user_id: metadata.userId
      };

      // We need to handle additional fields separately to avoid type errors
      const dbInsertData: any = { ...assetData };
      
      // Add optional fields conditionally
      if (metadata.cardId) {
        dbInsertData.card_id = metadata.cardId;
      }
      
      if (metadata.collectionId) {
        dbInsertData.collection_id = metadata.collectionId;
      }
      
      if (metadata.assetType) {
        dbInsertData.asset_type = metadata.assetType;
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('digital_assets')
        .insert(dbInsertData)
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating asset record:', insertError);
        // Try to clean up the uploaded file
        await supabase.storage.from('assets').remove([filePath]);
        return { error: insertError.message };
      }
      
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
      
      const asset: Asset = {
        id: insertData.id,
        title: insertData.title,
        description: insertData.description,
        mimeType: insertData.mime_type,
        storagePath: insertData.storage_path,
        fileSize: insertData.file_size,
        width: insertData.width,
        height: insertData.height,
        thumbnailPath: insertData.thumbnail_path,
        tags: insertData.tags,
        metadata: insertData.metadata,
        createdAt: insertData.created_at,
        updatedAt: insertData.updated_at,
        userId: insertData.user_id,
        originalFilename: insertData.original_filename,
        cardId: insertData.card_id,
        collectionId: insertData.collection_id,
        assetType: insertData.asset_type
      };
      
      return {
        asset,
        url: publicUrlData.publicUrl,
        thumbnailUrl: asset.thumbnailPath
          ? supabase.storage.from('assets').getPublicUrl(asset.thumbnailPath).data.publicUrl
          : undefined
      };
    } catch (err: any) {
      console.error('Unexpected error uploading asset:', err);
      return { error: err.message || 'Failed to upload asset' };
    }
  },
  
  /**
   * Get assets matching the filter criteria
   */
  async getAssets(filter: AssetFilter = {}) {
    try {
      let query = supabase
        .from('digital_assets')
        .select('*');
      
      // Apply filters
      if (filter.userId) {
        query = query.eq('user_id', filter.userId);
      }
      
      if (filter.cardId) {
        query = query.eq('card_id', filter.cardId);
      }
      
      if (filter.collectionId) {
        query = query.eq('collection_id', filter.collectionId);
      }
      
      if (filter.assetType) {
        query = query.eq('asset_type', filter.assetType);
      }
      
      if (filter.mimeType) {
        query = query.eq('mime_type', filter.mimeType);
      }
      
      if (filter.tags && filter.tags.length > 0) {
        // For tags, look for assets that have ANY of the provided tags
        query = query.contains('tags', filter.tags);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      // Map to our Asset interface
      const assets: Asset[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        mimeType: item.mime_type,
        storagePath: item.storage_path,
        fileSize: item.file_size,
        width: item.width,
        height: item.height,
        thumbnailPath: item.thumbnail_path,
        tags: item.tags,
        metadata: item.metadata,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        userId: item.user_id,
        originalFilename: item.original_filename,
        cardId: item.card_id,
        collectionId: item.collection_id,
        assetType: item.asset_type
      }));
      
      // Get public URLs for all assets
      const assetsWithUrls = assets.map(asset => {
        const url = supabase.storage.from('assets').getPublicUrl(asset.storagePath).data.publicUrl;
        const thumbnailUrl = asset.thumbnailPath
          ? supabase.storage.from('assets').getPublicUrl(asset.thumbnailPath).data.publicUrl
          : undefined;
          
        return {
          ...asset,
          url,
          thumbnailUrl
        };
      });
      
      return { data: assetsWithUrls, error: null };
    } catch (err: any) {
      console.error('Error getting assets:', err);
      return { data: null, error: err.message || 'Failed to get assets' };
    }
  },
  
  /**
   * Delete an asset and its associated file
   */
  async deleteAsset(assetId: string) {
    try {
      // First, get the asset to find its storage path
      const { data, error } = await supabase
        .from('digital_assets')
        .select('storage_path, thumbnail_path')
        .eq('id', assetId)
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      // Delete the file from storage
      const paths = [data.storage_path];
      if (data.thumbnail_path) {
        paths.push(data.thumbnail_path);
      }
      
      const { error: storageError } = await supabase.storage
        .from('assets')
        .remove(paths);
      
      if (storageError) {
        console.error('Error deleting files from storage:', storageError);
        // Continue anyway to try to delete the database record
      }
      
      // Delete the database record
      const { error: deleteError } = await supabase
        .from('digital_assets')
        .delete()
        .eq('id', assetId);
      
      if (deleteError) {
        return { success: false, error: deleteError.message };
      }
      
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error deleting asset:', err);
      return { success: false, error: err.message || 'Failed to delete asset' };
    }
  }
};
