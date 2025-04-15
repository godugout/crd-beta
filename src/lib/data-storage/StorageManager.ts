
import { supabase } from '@/lib/supabase/client';
import { storageOperations } from '@/lib/supabase/storage';
import { assetService } from '@/lib/dam/assetService';
import { toast } from 'sonner';
import localforage from 'localforage';

// Configure localstorage fallback
const localStore = localforage.createInstance({
  name: 'cardshow',
  storeName: 'assets'
});

export interface StorageOptions {
  path?: string;
  isPublic?: boolean;
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
  contentType?: string;
}

/**
 * StorageManager - Handles all file storage operations with multiple backends
 */
export class StorageManager {
  /**
   * Store a file in the appropriate storage system
   */
  static async storeFile(
    file: File | Blob,
    fileName: string,
    options: StorageOptions = {}
  ): Promise<{ url: string; id: string }> {
    try {
      const {
        path = 'uploads',
        isPublic = true,
        metadata = {},
        onProgress,
        contentType = file.type
      } = options;
      
      // Try Supabase Storage
      if (supabase && storageOperations) {
        console.log('Uploading file to Supabase Storage');
        
        // Create a File object if we received a Blob
        const fileToUpload = file instanceof File ? file : new File(
          [file],
          fileName,
          { type: contentType }
        );
        
        // Use the storageOperations utility
        const result = await storageOperations.uploadImage(
          fileToUpload,
          path
        );
        
        if (result.error) {
          throw new Error(`Error uploading file: ${result.error.message}`);
        }
        
        return {
          url: result.data?.url || '',
          id: result.data?.path || ''
        };
      }
      // Try Digital Asset Management service
      else if (assetService?.uploadAsset) {
        console.log('Uploading file to Digital Asset Management service');
        
        // Create a File object if we received a Blob
        const fileToUpload = file instanceof File ? file : new File(
          [file],
          fileName,
          { type: contentType }
        );
        
        // Extract tags from metadata if available
        const tags = metadata.tags || [];
        
        const result = await assetService.uploadAsset(fileToUpload, {
          title: metadata.title || fileName,
          description: metadata.description,
          tags,
          metadata
        });
        
        if (!result) {
          throw new Error('Failed to upload file using asset service');
        }
        
        return {
          url: result.url,
          id: result.id
        };
      }
      // Fallback to browser storage
      else {
        console.log('Falling back to browser storage');
        
        // Store in localforage with a URL
        const id = `${Date.now()}-${fileName}`;
        await localStore.setItem(id, {
          file,
          metadata: {
            fileName,
            contentType,
            ...metadata,
            stored: new Date().toISOString()
          }
        });
        
        // Create an object URL for immediate use
        const url = URL.createObjectURL(file);
        
        return { url, id };
      }
    } catch (error) {
      console.error('Error storing file:', error);
      toast.error('Failed to store file');
      throw error;
    }
  }
  
  /**
   * Retrieve a file from storage
   */
  static async getFile(id: string): Promise<Blob | null> {
    try {
      // Try Supabase Storage first
      if (supabase) {
        // Parse the ID to determine bucket and path
        // This assumes the ID is in format "bucket/path"
        const parts = id.split('/');
        const bucket = parts[0];
        const path = parts.slice(1).join('/');
        
        if (bucket && path) {
          const { data, error } = await supabase.storage
            .from(bucket)
            .download(path);
            
          if (error) {
            throw error;
          }
          
          return data;
        }
      }
      
      // Try local storage fallback
      const localData = await localStore.getItem(id);
      if (localData && localData.file) {
        return localData.file;
      }
      
      // Nothing found
      return null;
    } catch (error) {
      console.error('Error retrieving file:', error);
      toast.error('Failed to retrieve file');
      return null;
    }
  }
  
  /**
   * Delete a file from storage
   */
  static async deleteFile(id: string): Promise<boolean> {
    try {
      // Try Supabase Storage first
      if (supabase && storageOperations) {
        // Check if this is a full path
        if (id.includes('/')) {
          const result = await storageOperations.deleteImage(id);
          
          if (result.error) {
            throw result.error;
          }
          
          return true;
        }
      }
      
      // Try Digital Asset Management service
      if (assetService?.deleteAsset) {
        const result = await assetService.deleteAsset(id);
        if (result) {
          return true;
        }
      }
      
      // Try local storage fallback
      await localStore.removeItem(id);
      
      // Assume success if we got here
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      return false;
    }
  }
  
  /**
   * List files in storage
   */
  static async listFiles(
    path: string = '',
    options: { limit?: number; offset?: number } = {}
  ): Promise<{ name: string; url: string; id: string; metadata?: any }[]> {
    try {
      const { limit = 100, offset = 0 } = options;
      
      // Try Supabase Storage first
      if (supabase) {
        // Parse the path to determine bucket
        const parts = path.split('/');
        const bucket = parts[0] || 'card-images'; // Default to card-images bucket
        const prefix = parts.slice(1).join('/');
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .list(prefix, {
            limit,
            offset,
            sortBy: { column: 'name', order: 'asc' }
          });
          
        if (error) {
          throw error;
        }
        
        // Transform to standard format
        return (data || []).map(item => {
          const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fullPath);
            
          return {
            name: item.name,
            url: publicUrl,
            id: `${bucket}/${fullPath}`,
            metadata: {
              size: item.metadata?.size,
              mimetype: item.metadata?.mimetype,
              lastModified: item.metadata?.lastModified
            }
          };
        });
      }
      
      // Try Digital Asset Management service
      if (assetService?.getAssets) {
        const assets = await assetService.getAssets();
        
        return assets.map(asset => ({
          name: asset.originalFilename,
          url: asset.publicUrl,
          id: asset.id,
          metadata: asset.metadata
        }));
      }
      
      // Try local storage fallback
      const keys = await localStore.keys();
      const results = [];
      
      for (const key of keys) {
        const data = await localStore.getItem(key);
        if (data && data.file) {
          results.push({
            name: data.metadata?.fileName || key,
            url: URL.createObjectURL(data.file),
            id: key,
            metadata: data.metadata
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error listing files:', error);
      toast.error('Failed to list files');
      return [];
    }
  }
  
  /**
   * Get a signed URL for temporary access
   */
  static async getSignedUrl(
    id: string,
    options: { expiresIn?: number } = {}
  ): Promise<string | null> {
    try {
      const { expiresIn = 3600 } = options;
      
      // Try Supabase Storage first
      if (supabase) {
        // Parse the ID to determine bucket and path
        const parts = id.split('/');
        const bucket = parts[0];
        const path = parts.slice(1).join('/');
        
        if (bucket && path) {
          const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);
            
          if (error) {
            throw error;
          }
          
          return data.signedUrl;
        }
      }
      
      // For other storage types, we'll just return the URL or local URL
      const file = await this.getFile(id);
      if (file) {
        return URL.createObjectURL(file);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      toast.error('Failed to get signed URL');
      return null;
    }
  }
}

export default StorageManager;
