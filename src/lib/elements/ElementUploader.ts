
import { ElementUploadMetadata, ElementType } from '../types/cardElements';
import { assetService, AssetUploadOptions } from '../dam/assetService';
import { toastUtils } from '../utils/toast-utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'];

export interface ElementUploadResult {
  success: boolean;
  url?: string;
  thumbnailUrl?: string;
  id?: string;
  metadata?: ElementUploadMetadata;
  error?: string;
}

/**
 * Service for uploading card elements (stickers, logos, frames, etc.)
 */
export class ElementUploader {
  /**
   * Upload a file to be used as a card element
   */
  static async uploadElement(
    file: File,
    type: ElementType,
    options: {
      title?: string;
      tags?: string[];
      cardId?: string;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<ElementUploadResult> {
    try {
      // Validate file
      const validationResult = await this.validateFile(file, type);
      if (!validationResult.valid) {
        toastUtils.error('Upload Failed', validationResult.error);
        return { success: false, error: validationResult.error };
      }

      // Prepare upload options
      const uploadOptions: AssetUploadOptions = {
        title: options.title || file.name,
        tags: [...(options.tags || []), type],
        cardId: options.cardId,
        assetType: type,
        metadata: {
          ...options.metadata,
          elementType: type,
          originalFilename: file.name,
        }
      };

      // Upload to asset service
      const result = await assetService.uploadAsset(file, uploadOptions);
      
      if (!result) {
        return { success: false, error: 'Failed to upload asset' };
      }

      // Generate and store metadata about the element
      const metadata = await this.generateMetadata(file);
      
      return {
        success: true,
        url: result.url,
        id: result.id,
        metadata
      };
    } catch (error) {
      console.error('Error uploading element:', error);
      toastUtils.error('Upload Failed', 'An unexpected error occurred during upload');
      return { success: false, error: 'Unexpected error during upload' };
    }
  }

  /**
   * Validate a file before upload
   */
  private static async validateFile(
    file: File, 
    type: ElementType
  ): Promise<{ valid: boolean; error?: string }> {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File size exceeds the maximum allowed (5MB)` };
    }

    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: `Invalid file type. Allowed types: JPEG, PNG, SVG, WebP, GIF` 
      };
    }

    // Additional validations based on element type
    switch (type) {
      case 'frame':
        if (file.type !== 'image/png' && file.type !== 'image/svg+xml') {
          return { 
            valid: false, 
            error: 'Frames must be PNG with transparency or SVG' 
          };
        }
        break;
        
      case 'overlay':
        // For overlays, we need to make sure they have transparency
        if (file.type === 'image/jpeg') {
          return { 
            valid: false, 
            error: 'Overlays must have transparency (PNG, SVG, or WebP)' 
          };
        }
        break;
    }

    return { valid: true };
  }

  /**
   * Generate metadata about the uploaded element
   */
  private static async generateMetadata(file: File): Promise<ElementUploadMetadata> {
    const metadata: ElementUploadMetadata = {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      isAnimated: file.type === 'image/gif',
    };

    // For images, get dimensions
    if (file.type.startsWith('image/')) {
      try {
        const dimensions = await this.getImageDimensions(file);
        metadata.dimensions = dimensions;
      } catch (error) {
        console.error('Error getting image dimensions:', error);
      }
    }

    // Detect if the image has transparency
    if (file.type === 'image/png' || file.type === 'image/svg+xml' || file.type === 'image/webp') {
      metadata.hasTransparency = true;
    }

    return metadata;
  }

  /**
   * Get dimensions of an image file
   */
  private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = (err) => {
        reject(err);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  }
}
