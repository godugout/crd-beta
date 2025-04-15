
import ImageProcessor, { ProcessedImage, MAX_DIMENSIONS, IMAGE_QUALITY } from './ImageProcessor';
import { assetService } from '@/lib/dam/assetService';
import { supabase } from '@/lib/supabase/client';
import { storageOperations } from '@/lib/supabase/storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export interface CardImageProps {
  file: File;
  title?: string;
  cardId?: string;
  userId?: string;
  tags?: string[];
  processingOptions?: {
    enhanceImage?: boolean;
    cropToCardRatio?: boolean;
    generateThumbnail?: boolean;
    autoAdjustments?: boolean;
  }
}

export interface CardImageResult {
  imageUrl: string;
  thumbnailUrl?: string;
  imageId: string;
  width: number;
  height: number;
  originalFile: File;
  processedFile: File;
  processedImage: ProcessedImage;
}

/**
 * Service for handling card image processing and storage
 */
export class CardImageService {
  /**
   * Processes and uploads a card image
   */
  static async processAndUploadCardImage(
    props: CardImageProps
  ): Promise<CardImageResult> {
    try {
      const {
        file,
        title = file.name,
        cardId,
        userId,
        tags = ['card'],
        processingOptions = {
          enhanceImage: true,
          cropToCardRatio: true,
          generateThumbnail: true,
          autoAdjustments: true
        }
      } = props;
      
      // 1. Process the image
      console.log('Processing card image:', file.name);
      const processedImage = await this.processCardImage(file, processingOptions);
      
      // 2. Upload to storage
      console.log('Uploading processed image');
      let imageUrl: string;
      let thumbnailUrl: string | undefined;
      let imageId: string;
      
      // Check if we have Supabase integration
      if (supabase && storageOperations) {
        // Use Supabase Storage
        const result = await storageOperations.uploadImage(
          processedImage.file, 
          `cards/${userId || 'anonymous'}`
        );
        
        if (result.error) {
          throw new Error(`Error uploading image: ${result.error.message}`);
        }
        
        imageUrl = result.data?.url || '';
        imageId = result.data?.path || uuidv4();
        
        // Upload thumbnail if generated
        if (processingOptions.generateThumbnail) {
          const thumbnail = await ImageProcessor.createThumbnail(processedImage.file);
          const thumbResult = await storageOperations.uploadImage(
            thumbnail.file,
            `thumbnails/${userId || 'anonymous'}`
          );
          
          if (!thumbResult.error && thumbResult.data) {
            thumbnailUrl = thumbResult.data.url;
          }
        }
        
        console.log('Image uploaded successfully:', imageUrl);
      } 
      else if (assetService?.uploadAsset) {
        // Use Digital Asset Management service
        const metadata = {
          title,
          tags,
          cardId,
          width: processedImage.width,
          height: processedImage.height
        };
        
        const uploadResult = await assetService.uploadAsset(processedImage.file, {
          title,
          tags,
          cardId,
          assetType: 'card-image',
          metadata
        });
        
        if (!uploadResult) {
          throw new Error('Failed to upload image using asset service');
        }
        
        imageUrl = uploadResult.url;
        imageId = uploadResult.id;
        
        // Upload thumbnail if generated
        if (processingOptions.generateThumbnail) {
          const thumbnail = await ImageProcessor.createThumbnail(processedImage.file);
          const thumbResult = await assetService.uploadAsset(thumbnail.file, {
            title: `${title} (Thumbnail)`,
            tags: [...tags, 'thumbnail'],
            cardId,
            assetType: 'thumbnail'
          });
          
          if (thumbResult) {
            thumbnailUrl = thumbResult.url;
          }
        }
      } 
      else {
        // Fallback to local URL (for development/demo)
        console.warn('No storage service available, using local URL');
        imageUrl = processedImage.dataUrl;
        imageId = uuidv4();
        
        // Create thumbnail
        if (processingOptions.generateThumbnail) {
          const thumbnail = await ImageProcessor.createThumbnail(processedImage.file);
          thumbnailUrl = thumbnail.dataUrl;
        }
      }
      
      // 3. Return the result
      return {
        imageUrl,
        thumbnailUrl,
        imageId,
        width: processedImage.width,
        height: processedImage.height,
        originalFile: file,
        processedFile: processedImage.file,
        processedImage
      };
    } catch (error) {
      console.error('Error processing and uploading card image:', error);
      toast.error('Failed to process and upload image');
      throw error;
    }
  }
  
  /**
   * Processes a card image with specified options
   */
  private static async processCardImage(
    file: File,
    options: CardImageProps['processingOptions'] = {}
  ): Promise<ProcessedImage> {
    const {
      enhanceImage = true,
      cropToCardRatio = true,
      autoAdjustments = true
    } = options;
    
    // 1. Initial resize
    let processed = await ImageProcessor.resizeImage(file, {
      maxWidth: MAX_DIMENSIONS.STANDARD.width,
      maxHeight: MAX_DIMENSIONS.STANDARD.height,
      targetAspectRatio: cropToCardRatio ? 2.5 / 3.5 : undefined,
      cropToFit: cropToCardRatio,
      quality: IMAGE_QUALITY.HIGH,
      format: 'image/jpeg',
      fileName: this.generateFileName(file.name, 'card')
    });
    
    // 2. Apply enhancements if enabled
    if (enhanceImage) {
      // Automatic adjustments with mild settings
      if (autoAdjustments) {
        processed = await ImageProcessor.enhanceImage(
          processed.file,
          {
            brightness: 0.05,    // Slightly increase brightness
            contrast: 0.1,       // Slightly increase contrast
            saturation: 0.05,    // Slightly increase saturation
            sharpness: 0.2       // Moderate sharpening
          },
          {
            quality: IMAGE_QUALITY.HIGH,
            fileName: this.generateFileName(file.name, 'enhanced')
          }
        );
      }
    }
    
    return processed;
  }
  
  /**
   * Generates a standardized filename for processed images
   */
  private static generateFileName(originalName: string, prefix: string): string {
    const timestamp = new Date().getTime();
    const randomId = Math.random().toString(36).substring(2, 10);
    const extension = originalName.split('.').pop() || 'jpg';
    
    return `${prefix}-${timestamp}-${randomId}.${extension}`;
  }
  
  /**
   * Takes a screenshot of a rendered card
   */
  static async captureCardScreenshot(
    cardElement: HTMLElement,
    options: {
      fileName?: string;
      quality?: number;
    } = {}
  ): Promise<ProcessedImage | null> {
    try {
      // This would use html2canvas or similar library
      // For now we'll just show a message that it's not implemented
      toast.info('Card screenshot capture not implemented');
      console.warn('Card screenshot capture requires html2canvas library');
      return null;
    } catch (error) {
      console.error('Error capturing card screenshot:', error);
      toast.error('Failed to capture card screenshot');
      return null;
    }
  }
}

export default CardImageService;
