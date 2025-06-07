
import { supabase } from '@/integrations/supabase/client';
import { IMAGE_SIZES, SUPPORTED_IMAGE_FORMATS } from '@/lib/utils/cardDefaults';

export interface ImageVariant {
  id: string;
  variantType: 'thumbnail' | 'preview' | 'original' | 'optimized';
  storageUrl: string;
  width: number;
  height: number;
  fileSize: number;
  format: string;
  quality?: number;
}

export interface ImageUploadResult {
  assetId: string;
  originalUrl: string;
  variants: ImageVariant[];
  metadata: {
    originalDimensions: { width: number; height: number };
    originalSize: number;
    processingStatus: string;
  };
}

export class ImageStorageService {
  private static instance: ImageStorageService;
  
  static getInstance(): ImageStorageService {
    if (!ImageStorageService.instance) {
      ImageStorageService.instance = new ImageStorageService();
    }
    return ImageStorageService.instance;
  }

  /**
   * Upload an image with automatic processing and variant generation
   */
  async uploadImage(file: File, options: {
    userId: string;
    cardId?: string;
    collectionId?: string;
    generateVariants?: boolean;
  }): Promise<ImageUploadResult | null> {
    try {
      if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
        throw new Error('Unsupported image format');
      }

      // Get original image dimensions
      const dimensions = await this.getImageDimensions(file);
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${options.userId}/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      // Upload original image
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('card-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      // Get public URL for original
      const { data: { publicUrl } } = supabase.storage
        .from('card-images')
        .getPublicUrl(fileName);

      // Create digital asset record
      const { data: asset, error: assetError } = await supabase
        .from('digital_assets')
        .insert({
          title: file.name,
          mime_type: file.type,
          storage_path: fileName,
          file_size: file.size,
          width: dimensions.width,
          height: dimensions.height,
          original_filename: file.name,
          user_id: options.userId,
          processing_status: 'processing',
          original_dimensions: dimensions,
          optimization_metadata: {
            originalFormat: file.type,
            uploadedAt: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (assetError) {
        console.error('Asset creation error:', assetError);
        // Clean up uploaded file
        await supabase.storage.from('card-images').remove([fileName]);
        return null;
      }

      const variants: ImageVariant[] = [];

      // Generate variants if requested
      if (options.generateVariants) {
        variants.push(...await this.generateImageVariants(file, asset.id, fileName));
      }

      // Update processing status
      await supabase
        .from('digital_assets')
        .update({ processing_status: 'completed' })
        .eq('id', asset.id);

      return {
        assetId: asset.id,
        originalUrl: publicUrl,
        variants,
        metadata: {
          originalDimensions: dimensions,
          originalSize: file.size,
          processingStatus: 'completed'
        }
      };

    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  }

  /**
   * Generate multiple variants of an image
   */
  private async generateImageVariants(
    originalFile: File, 
    assetId: string, 
    originalPath: string
  ): Promise<ImageVariant[]> {
    const variants: ImageVariant[] = [];
    
    for (const [sizeKey, config] of Object.entries(IMAGE_SIZES)) {
      if (sizeKey === 'fullsize') continue; // Skip fullsize for variants
      
      try {
        const resizedFile = await this.resizeImage(originalFile, config);
        const variantPath = originalPath.replace('.', `_${sizeKey}.`);
        
        // Upload variant to appropriate bucket
        const bucketName = sizeKey === 'thumbnail' ? 'card-thumbnails' : 'card-previews';
        
        const { data: variantUpload, error: variantError } = await supabase.storage
          .from(bucketName)
          .upload(variantPath, resizedFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (!variantError && variantUpload) {
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(variantPath);

          // Create variant record
          const { data: variant } = await supabase
            .from('image_variants')
            .insert({
              asset_id: assetId,
              variant_type: sizeKey as any,
              storage_path: variantPath,
              width: config.width,
              height: config.height,
              file_size: resizedFile.size,
              format: 'webp',
              quality: config.quality
            })
            .select()
            .single();

          if (variant) {
            variants.push({
              id: variant.id,
              variantType: variant.variant_type as any,
              storageUrl: publicUrl,
              width: variant.width || config.width,
              height: variant.height || config.height,
              fileSize: variant.file_size || resizedFile.size,
              format: variant.format || 'webp',
              quality: variant.quality || config.quality
            });
          }
        }
      } catch (error) {
        console.error(`Failed to create ${sizeKey} variant:`, error);
      }
    }

    return variants;
  }

  /**
   * Resize image to specified dimensions
   */
  private async resizeImage(
    file: File, 
    config: { width: number; height: number; quality: number }
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        const targetAspectRatio = config.width / config.height;
        
        let { width, height } = config;
        
        // Maintain aspect ratio
        if (aspectRatio > targetAspectRatio) {
          height = width / aspectRatio;
        } else {
          width = height * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: 'image/webp',
                  lastModified: Date.now()
                });
                resolve(resizedFile);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            'image/webp',
            config.quality / 100
          );
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get image dimensions from file
   */
  private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => reject(new Error('Failed to load image for dimensions'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get variants for an asset
   */
  async getImageVariants(assetId: string): Promise<ImageVariant[]> {
    const { data, error } = await supabase
      .from('image_variants')
      .select('*')
      .eq('asset_id', assetId);

    if (error) {
      console.error('Failed to fetch variants:', error);
      return [];
    }

    return data.map(variant => ({
      id: variant.id,
      variantType: variant.variant_type as any,
      storageUrl: this.getPublicUrl(variant.storage_path, variant.variant_type),
      width: variant.width || 0,
      height: variant.height || 0,
      fileSize: variant.file_size || 0,
      format: variant.format || 'webp',
      quality: variant.quality
    }));
  }

  /**
   * Get public URL for a storage path
   */
  private getPublicUrl(storagePath: string, variantType: string): string {
    const bucketName = variantType === 'thumbnail' 
      ? 'card-thumbnails' 
      : variantType === 'preview' 
        ? 'card-previews' 
        : 'card-images';
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);
    
    return publicUrl;
  }

  /**
   * Delete an asset and all its variants
   */
  async deleteAsset(assetId: string): Promise<boolean> {
    try {
      // Get all variants
      const variants = await this.getImageVariants(assetId);
      
      // Delete variant files from storage
      for (const variant of variants) {
        const bucketName = variant.variantType === 'thumbnail' 
          ? 'card-thumbnails' 
          : variant.variantType === 'preview' 
            ? 'card-previews' 
            : 'card-images';
        
        await supabase.storage
          .from(bucketName)
          .remove([variant.storageUrl.split('/').pop() || '']);
      }

      // Delete the digital asset (cascades to variants)
      const { error } = await supabase
        .from('digital_assets')
        .delete()
        .eq('id', assetId);

      return !error;
    } catch (error) {
      console.error('Failed to delete asset:', error);
      return false;
    }
  }
}

export const imageStorageService = ImageStorageService.getInstance();
