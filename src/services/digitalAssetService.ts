
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface DigitalAsset {
  id: string;
  userId: string;
  storagePath: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  thumbnailPath?: string;
  title?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  url?: string; // Public URL (generated on client)
  thumbnailUrl?: string; // Public thumbnail URL (generated on client)
}

export interface AssetUploadResult {
  success: boolean;
  asset?: DigitalAsset;
  error?: string;
}

export interface AssetUsage {
  id: string;
  assetId: string;
  usageType: string;
  referenceId: string;
  createdAt: string;
}

/**
 * Service for managing digital assets
 */
export const digitalAssetService = {
  /**
   * Upload a file to storage and create a digital asset record
   */
  async uploadAsset(
    file: File, 
    folder: string = 'uploads', 
    metadata: Record<string, any> = {},
    generateThumbnail: boolean = true
  ): Promise<AssetUploadResult> {
    try {
      // Current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Determine which bucket to use based on folder
      let bucketId = 'user-uploads';
      if (folder === 'cards') bucketId = 'card-images';
      if (folder === 'collections') bucketId = 'collection-covers';
      if (folder === 'avatars') bucketId = 'avatars';

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${folder}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketId)
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return { 
          success: false, 
          error: uploadError.message 
        };
      }

      // Get image dimensions if it's an image
      let width, height;
      if (file.type.startsWith('image/')) {
        const dimensions = await getImageDimensions(file);
        width = dimensions.width;
        height = dimensions.height;
      }

      // Upload thumbnail if needed and it's an image
      let thumbnailPath;
      if (generateThumbnail && file.type.startsWith('image/')) {
        const thumbnail = await createThumbnail(file);
        if (thumbnail) {
          const thumbnailName = `thumb_${fileName}`;
          const thumbnailFilePath = `${user.id}/${folder}/thumbnails/${thumbnailName}`;
          
          const { data: thumbnailData, error: thumbnailError } = await supabase.storage
            .from(bucketId)
            .upload(thumbnailFilePath, thumbnail, {
              contentType: 'image/jpeg',
              cacheControl: '3600',
              upsert: false
            });
            
          if (!thumbnailError && thumbnailData) {
            thumbnailPath = thumbnailFilePath;
          }
        }
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketId)
        .getPublicUrl(filePath);

      // Get public URL for the thumbnail
      let thumbnailUrl;
      if (thumbnailPath) {
        const { data: { publicUrl: thumbUrl } } = supabase.storage
          .from(bucketId)
          .getPublicUrl(thumbnailPath);
        thumbnailUrl = thumbUrl;
      }

      // Create a record in the digital_assets table
      const { data: assetData, error: assetError } = await supabase
        .from('digital_assets')
        .insert({
          user_id: user.id,
          storage_path: `${bucketId}/${filePath}`,
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          width,
          height,
          thumbnail_path: thumbnailPath ? `${bucketId}/${thumbnailPath}` : null,
          title: metadata.title || file.name,
          description: metadata.description || '',
          tags: metadata.tags || [],
          metadata: {
            ...metadata,
            bucketId,
            uploadedFrom: metadata.source || 'web',
          }
        })
        .select()
        .single();

      if (assetError) {
        console.error('Error creating digital asset record:', assetError);
        return { 
          success: false, 
          error: assetError.message 
        };
      }

      // Transform the response to match our interface
      const asset: DigitalAsset = {
        id: assetData.id,
        userId: assetData.user_id,
        storagePath: assetData.storage_path,
        originalFilename: assetData.original_filename,
        fileSize: assetData.file_size,
        mimeType: assetData.mime_type,
        width: assetData.width,
        height: assetData.height,
        thumbnailPath: assetData.thumbnail_path,
        title: assetData.title,
        description: assetData.description,
        tags: assetData.tags,
        metadata: assetData.metadata,
        createdAt: assetData.created_at,
        updatedAt: assetData.updated_at,
        url: publicUrl,
        thumbnailUrl: thumbnailUrl
      };

      return {
        success: true,
        asset
      };
    } catch (err: any) {
      console.error('Error in uploadAsset:', err);
      return { 
        success: false, 
        error: err.message || 'Unknown error occurred' 
      };
    }
  },

  /**
   * Get all digital assets for the current user
   */
  async getUserAssets(options: {
    limit?: number;
    offset?: number;
    tags?: string[];
    mimeType?: string;
    folder?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  } = {}): Promise<{ assets: DigitalAsset[], count: number }> {
    try {
      const {
        limit = 20,
        offset = 0,
        tags,
        mimeType,
        folder,
        sortBy = 'created_at',
        sortDirection = 'desc'
      } = options;

      let query = supabase
        .from('digital_assets')
        .select('*', { count: 'exact' });

      // Apply filters
      if (tags && tags.length > 0) {
        query = query.contains('tags', tags);
      }

      if (mimeType) {
        query = query.like('mime_type', `${mimeType}%`);
      }

      if (folder) {
        query = query.like('storage_path', `%/${folder}/%`);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortDirection === 'asc' });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching digital assets:', error);
        return { assets: [], count: 0 };
      }

      // Transform data to our interface and add URLs
      const assets: DigitalAsset[] = await Promise.all(
        (data || []).map(async (item) => {
          const [bucketId, ...pathParts] = item.storage_path.split('/');
          const path = pathParts.join('/');

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from(bucketId)
            .getPublicUrl(path);

          // Get thumbnail URL if available
          let thumbnailUrl;
          if (item.thumbnail_path) {
            const [thumbBucketId, ...thumbPathParts] = item.thumbnail_path.split('/');
            const thumbPath = thumbPathParts.join('/');
            const { data: { publicUrl: thumbUrl } } = supabase.storage
              .from(thumbBucketId)
              .getPublicUrl(thumbPath);
            thumbnailUrl = thumbUrl;
          }

          return {
            id: item.id,
            userId: item.user_id,
            storagePath: item.storage_path,
            originalFilename: item.original_filename,
            fileSize: item.file_size,
            mimeType: item.mime_type,
            width: item.width,
            height: item.height,
            thumbnailPath: item.thumbnail_path,
            title: item.title,
            description: item.description,
            tags: item.tags,
            metadata: item.metadata,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            url: publicUrl,
            thumbnailUrl: thumbnailUrl || publicUrl
          };
        })
      );

      return { assets, count: count || 0 };
    } catch (err: any) {
      console.error('Error in getUserAssets:', err);
      return { assets: [], count: 0 };
    }
  },

  /**
   * Get a single digital asset by ID
   */
  async getAsset(id: string): Promise<DigitalAsset | null> {
    try {
      const { data, error } = await supabase
        .from('digital_assets')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      const [bucketId, ...pathParts] = data.storage_path.split('/');
      const path = pathParts.join('/');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketId)
        .getPublicUrl(path);

      // Get thumbnail URL if available
      let thumbnailUrl;
      if (data.thumbnail_path) {
        const [thumbBucketId, ...thumbPathParts] = data.thumbnail_path.split('/');
        const thumbPath = thumbPathParts.join('/');
        const { data: { publicUrl: thumbUrl } } = supabase.storage
          .from(thumbBucketId)
          .getPublicUrl(thumbPath);
        thumbnailUrl = thumbUrl;
      }

      return {
        id: data.id,
        userId: data.user_id,
        storagePath: data.storage_path,
        originalFilename: data.original_filename,
        fileSize: data.file_size,
        mimeType: data.mime_type,
        width: data.width,
        height: data.height,
        thumbnailPath: data.thumbnail_path,
        title: data.title,
        description: data.description,
        tags: data.tags,
        metadata: data.metadata,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        url: publicUrl,
        thumbnailUrl: thumbnailUrl || publicUrl
      };
    } catch (err) {
      console.error('Error in getAsset:', err);
      return null;
    }
  },

  /**
   * Update a digital asset's metadata
   */
  async updateAsset(id: string, updates: Partial<DigitalAsset>): Promise<boolean> {
    try {
      const updateData: Record<string, any> = {};
      
      // Map fields from our interface to database columns
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

      const { error } = await supabase
        .from('digital_assets')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating asset:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error in updateAsset:', err);
      return false;
    }
  },

  /**
   * Delete a digital asset and its storage file
   */
  async deleteAsset(id: string): Promise<boolean> {
    try {
      // Get the asset first to get storage path
      const { data, error } = await supabase
        .from('digital_assets')
        .select('storage_path, thumbnail_path')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error getting asset for deletion:', error);
        return false;
      }

      // Delete from storage
      if (data.storage_path) {
        const [bucketId, ...pathParts] = data.storage_path.split('/');
        const path = pathParts.join('/');
        
        const { error: storageError } = await supabase.storage
          .from(bucketId)
          .remove([path]);
        
        if (storageError) {
          console.error('Error removing file from storage:', storageError);
        }
      }

      // Delete thumbnail if exists
      if (data.thumbnail_path) {
        const [thumbBucketId, ...thumbPathParts] = data.thumbnail_path.split('/');
        const thumbPath = thumbPathParts.join('/');
        
        const { error: thumbStorageError } = await supabase.storage
          .from(thumbBucketId)
          .remove([thumbPath]);
        
        if (thumbStorageError) {
          console.error('Error removing thumbnail from storage:', thumbStorageError);
        }
      }

      // Delete from digital_assets table
      const { error: deleteError } = await supabase
        .from('digital_assets')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting asset record:', deleteError);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error in deleteAsset:', err);
      return false;
    }
  },

  /**
   * Create an asset usage record
   */
  async createAssetUsage(
    assetId: string, 
    usageType: string, 
    referenceId: string
  ): Promise<AssetUsage | null> {
    try {
      const { data, error } = await supabase
        .from('asset_usages')
        .insert({
          asset_id: assetId,
          usage_type: usageType,
          reference_id: referenceId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating asset usage:', error);
        return null;
      }

      return {
        id: data.id,
        assetId: data.asset_id,
        usageType: data.usage_type,
        referenceId: data.reference_id,
        createdAt: data.created_at
      };
    } catch (err) {
      console.error('Error in createAssetUsage:', err);
      return null;
    }
  },

  /**
   * Get asset usages for a specific asset
   */
  async getAssetUsages(assetId: string): Promise<AssetUsage[]> {
    try {
      const { data, error } = await supabase
        .from('asset_usages')
        .select('*')
        .eq('asset_id', assetId);

      if (error) {
        console.error('Error fetching asset usages:', error);
        return [];
      }

      return (data || []).map(item => ({
        id: item.id,
        assetId: item.asset_id,
        usageType: item.usage_type,
        referenceId: item.reference_id,
        createdAt: item.created_at
      }));
    } catch (err) {
      console.error('Error in getAssetUsages:', err);
      return [];
    }
  }
};

/**
 * Utility function to get image dimensions
 */
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Utility function to create a thumbnail
 */
const createThumbnail = async (file: File, maxSize: number = 300): Promise<Blob | null> => {
  try {
    const img = new Image();
    const imgLoaded = new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = URL.createObjectURL(file);
    });
    await imgLoaded;

    // Calculate dimensions
    const { width: originalWidth, height: originalHeight } = img;
    let width = originalWidth;
    let height = originalHeight;

    if (width > height) {
      if (width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }
    }

    // Create canvas and draw resized image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(img.src);

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        'image/jpeg',
        0.85 // quality
      );
    });
  } catch (err) {
    console.error('Error creating thumbnail:', err);
    return null;
  }
};

export default digitalAssetService;
