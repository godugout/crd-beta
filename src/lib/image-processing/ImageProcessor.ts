import { toast } from 'sonner';

// Constants for image optimization
export const IMAGE_QUALITY = {
  HIGH: 0.95,
  MEDIUM: 0.85,
  LOW: 0.7,
  THUMBNAIL: 0.6
};

export const MAX_DIMENSIONS = {
  FULL: { width: 1500, height: 2100 }, // For full-size card images (2.5:3.5 ratio)
  STANDARD: { width: 750, height: 1050 }, // Standard card size
  PREVIEW: { width: 400, height: 560 }, // Preview size
  THUMBNAIL: { width: 200, height: 280 }, // Thumbnail size
  AVATAR: { width: 150, height: 150 } // Avatar (square)
};

// Card aspect ratio (2.5:3.5 standard trading card)
export const CARD_ASPECT_RATIO = 2.5 / 3.5;

export interface ProcessedImage {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
  originalFile?: File;
}

export interface ProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maintainAspectRatio?: boolean;
  targetAspectRatio?: number;
  cropToFit?: boolean;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  fileName?: string;
}

/**
 * ImageProcessor - Handles all image processing operations
 */
export class ImageProcessor {
  /**
   * Loads an image from a file or URL
   */
  static async loadImage(source: File | string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      
      if (typeof source === 'string') {
        // Source is a URL
        img.src = source;
      } else {
        // Source is a File
        img.src = URL.createObjectURL(source);
      }
    });
  }
  
  /**
   * Resizes an image with various options
   */
  static async resizeImage(
    source: File | string | HTMLImageElement,
    options: ProcessingOptions = {}
  ): Promise<ProcessedImage> {
    try {
      // Default options
      const {
        maxWidth = MAX_DIMENSIONS.STANDARD.width,
        maxHeight = MAX_DIMENSIONS.STANDARD.height,
        quality = IMAGE_QUALITY.HIGH,
        maintainAspectRatio = true,
        targetAspectRatio = CARD_ASPECT_RATIO,
        cropToFit = false,
        format = 'image/jpeg',
        fileName = 'processed-image.jpg'
      } = options;
      
      // Load the image
      let img: HTMLImageElement;
      let originalFile: File | undefined;
      
      if (source instanceof HTMLImageElement) {
        img = source;
      } else if (typeof source === 'string') {
        img = await this.loadImage(source);
      } else {
        img = await this.loadImage(source);
        originalFile = source;
      }
      
      // Setup canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }
      
      // Calculate dimensions
      let { width, height } = this.calculateDimensions(
        img.width, 
        img.height, 
        maxWidth, 
        maxHeight, 
        maintainAspectRatio,
        targetAspectRatio,
        cropToFit
      );
      
      // Update canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Apply high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      if (cropToFit && targetAspectRatio) {
        // Calculate crop dimensions to match target aspect ratio
        const imgAspectRatio = img.width / img.height;
        
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;
        
        if (imgAspectRatio > targetAspectRatio) {
          // Image is wider than target, crop sides
          sourceWidth = img.height * targetAspectRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Image is taller than target, crop top/bottom
          sourceHeight = img.width / targetAspectRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }
        
        // Draw the cropped image
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, width, height
        );
      } else {
        // Draw the entire image scaled
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      // Convert to blob with specified format and quality
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error('Failed to convert canvas to blob'));
        }, format, quality);
      });
      
      // Create a data URL for preview
      const dataUrl = canvas.toDataURL(format, quality);
      
      // Create a new File object
      const file = new File(
        [blob], 
        fileName, 
        { type: format }
      );
      
      // Return the processed image data
      return {
        file,
        dataUrl,
        width,
        height,
        originalFile
      };
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Error processing image');
      throw error;
    }
  }
  
  /**
   * Creates a thumbnail for an image
   */
  static async createThumbnail(
    source: File | string | HTMLImageElement,
    options: ProcessingOptions = {}
  ): Promise<ProcessedImage> {
    return this.resizeImage(source, {
      maxWidth: MAX_DIMENSIONS.THUMBNAIL.width,
      maxHeight: MAX_DIMENSIONS.THUMBNAIL.height,
      quality: IMAGE_QUALITY.THUMBNAIL,
      fileName: 'thumbnail.jpg',
      ...options
    });
  }
  
  /**
   * Crops an image to specific dimensions
   */
  static async cropImage(
    source: File | string | HTMLImageElement,
    cropX: number,
    cropY: number,
    cropWidth: number,
    cropHeight: number,
    options: ProcessingOptions = {}
  ): Promise<ProcessedImage> {
    try {
      // Load the image
      let img: HTMLImageElement;
      let originalFile: File | undefined;
      
      if (source instanceof HTMLImageElement) {
        img = source;
      } else if (typeof source === 'string') {
        img = await this.loadImage(source);
      } else {
        img = await this.loadImage(source);
        originalFile = source;
      }
      
      // Default options
      const {
        maxWidth = cropWidth,
        maxHeight = cropHeight,
        quality = IMAGE_QUALITY.HIGH,
        format = 'image/jpeg',
        fileName = 'cropped-image.jpg'
      } = options;
      
      // Setup canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }
      
      // Calculate output dimensions
      const outputWidth = Math.min(cropWidth, maxWidth);
      const outputHeight = Math.min(cropHeight, maxHeight);
      
      // Set canvas size to output dimensions
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      
      // Apply high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw the cropped portion of the image
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, outputWidth, outputHeight
      );
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error('Failed to convert canvas to blob'));
        }, format, quality);
      });
      
      // Create a data URL for preview
      const dataUrl = canvas.toDataURL(format, quality);
      
      // Create a new File object
      const file = new File(
        [blob], 
        fileName, 
        { type: format }
      );
      
      // Return the processed image data
      return {
        file,
        dataUrl,
        width: outputWidth,
        height: outputHeight,
        originalFile
      };
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Error cropping image');
      throw error;
    }
  }
  
  /**
   * Applies various enhancements to an image
   */
  static async enhanceImage(
    source: File | string | HTMLImageElement,
    adjustments: {
      brightness?: number; // -1 to 1
      contrast?: number;   // -1 to 1
      saturation?: number; // -1 to 1
      sharpness?: number;  // 0 to 1
    },
    options: ProcessingOptions = {}
  ): Promise<ProcessedImage> {
    try {
      // Load the image
      let img: HTMLImageElement;
      let originalFile: File | undefined;
      
      if (source instanceof HTMLImageElement) {
        img = source;
      } else if (typeof source === 'string') {
        img = await this.loadImage(source);
      } else {
        img = await this.loadImage(source);
        originalFile = source;
      }
      
      // Default options
      const {
        maxWidth = img.width,
        maxHeight = img.height,
        quality = IMAGE_QUALITY.HIGH,
        format = 'image/jpeg',
        fileName = 'enhanced-image.jpg'
      } = options;
      
      // Setup canvas with original dimensions
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }
      
      // Calculate dimensions while maintaining aspect ratio
      const { width, height } = this.calculateDimensions(
        img.width, 
        img.height, 
        maxWidth, 
        maxHeight,
        true
      );
      
      canvas.width = width;
      canvas.height = height;
      
      // Apply high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw the original image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get image data for pixel manipulation
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // Apply adjustments
      const { brightness = 0, contrast = 0, saturation = 0, sharpness = 0 } = adjustments;
      
      // Create a new array for the sharpened image if needed
      let sharpenedData: Uint8ClampedArray | null = null;
      
      if (sharpness > 0) {
        // Create a copy of the image data for sharpening
        sharpenedData = new Uint8ClampedArray(data.length);
        for (let i = 0; i < data.length; i++) {
          sharpenedData[i] = data[i];
        }
        
        // Apply sharpening using convolution
        this.applySharpening(sharpenedData, width, height, sharpness);
      }
      
      // Apply brightness, contrast, and saturation adjustments
      const brightnessF = brightness * 255;
      const contrastF = contrast * 255;
      const factor = (259 * (contrastF + 255)) / (255 * (259 - contrastF));
      
      for (let i = 0; i < data.length; i += 4) {
        // Use sharpened data if available
        const baseData = sharpenedData || data;
        
        // Get RGB values
        let r = baseData[i];
        let g = baseData[i + 1];
        let b = baseData[i + 2];
        
        // Apply brightness
        if (brightness !== 0) {
          r += brightnessF;
          g += brightnessF;
          b += brightnessF;
        }
        
        // Apply contrast
        if (contrast !== 0) {
          r = Math.max(0, Math.min(255, factor * (r - 128) + 128));
          g = Math.max(0, Math.min(255, factor * (g - 128) + 128));
          b = Math.max(0, Math.min(255, factor * (b - 128) + 128));
        }
        
        // Apply saturation
        if (saturation !== 0) {
          const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
          r = Math.max(0, Math.min(255, r + saturation * (r - gray)));
          g = Math.max(0, Math.min(255, g + saturation * (g - gray)));
          b = Math.max(0, Math.min(255, b + saturation * (b - gray)));
        }
        
        // Update pixel values
        data[i] = Math.round(r);
        data[i + 1] = Math.round(g);
        data[i + 2] = Math.round(b);
        // Alpha channel remains unchanged
      }
      
      // Put the modified image data back on the canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error('Failed to convert canvas to blob'));
        }, format, quality);
      });
      
      // Create a data URL for preview
      const dataUrl = canvas.toDataURL(format, quality);
      
      // Create a new File object
      const file = new File(
        [blob], 
        fileName, 
        { type: format }
      );
      
      // Return the processed image data
      return {
        file,
        dataUrl,
        width,
        height,
        originalFile
      };
    } catch (error) {
      console.error('Error enhancing image:', error);
      toast.error('Error enhancing image');
      throw error;
    }
  }
  
  /**
   * Helper method to apply sharpening using convolution
   */
  private static applySharpening(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    amount: number
  ): void {
    // Create a copy of the data
    const original = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i++) {
      original[i] = data[i];
    }
    
    // Sharpening kernel
    const kernel = [
      0, -amount, 0,
      -amount, 1 + 4 * amount, -amount,
      0, -amount, 0
    ];
    
    // Apply convolution
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const offset = (y * width + x) * 4;
        
        for (let c = 0; c < 3; c++) {
          let val = 0;
          
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              const idx = offset + ((ky * width) + kx) * 4 + c;
              val += original[idx] * kernel[kernelIdx];
            }
          }
          
          data[offset + c] = Math.min(255, Math.max(0, val));
        }
      }
    }
  }
  
  /**
   * Helper method to calculate dimensions while maintaining aspect ratio
   */
  private static calculateDimensions(
    origWidth: number,
    origHeight: number,
    maxWidth: number,
    maxHeight: number,
    maintainAspectRatio: boolean = true,
    targetAspectRatio?: number,
    cropToFit: boolean = false
  ): { width: number; height: number } {
    if (!maintainAspectRatio) {
      return {
        width: Math.min(origWidth, maxWidth),
        height: Math.min(origHeight, maxHeight)
      };
    }
    
    // If we have a target aspect ratio and should crop to fit
    if (targetAspectRatio && cropToFit) {
      // For this specific case, we'll return the max dimensions that match the target ratio
      const targetHeight = maxWidth / targetAspectRatio;
      if (targetHeight <= maxHeight) {
        return {
          width: maxWidth,
          height: targetHeight
        };
      } else {
        return {
          width: maxHeight * targetAspectRatio,
          height: maxHeight
        };
      }
    }
    
    // Calculate scale factors
    const scaleW = maxWidth / origWidth;
    const scaleH = maxHeight / origHeight;
    
    // Use the smaller scale factor to ensure the entire image fits
    const scale = Math.min(scaleW, scaleH);
    
    // Calculate new dimensions
    return {
      width: Math.round(origWidth * scale),
      height: Math.round(origHeight * scale)
    };
  }
  
  /**
   * Applies background removal to an image using an alpha mask
   * This is a placeholder - for actual implementation, 
   * we'd use a more sophisticated ML model for foreground/background separation
   */
  static async removeBackground(
    source: File | string | HTMLImageElement,
    options: ProcessingOptions = {}
  ): Promise<ProcessedImage> {
    try {
      // In a real implementation, this would call a ML service
      toast.info("Background removal requires a machine learning model integration");
      
      // For now, just resize the image as a placeholder
      return this.resizeImage(source, {
        ...options,
        fileName: 'background-removed.png',
        format: 'image/png' // PNGs support transparency
      });
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error('Error removing background');
      throw error;
    }
  }
  
  /**
   * Takes a screenshot of a DOM element
   */
  static async captureElement(
    element: HTMLElement,
    options: ProcessingOptions = {}
  ): Promise<ProcessedImage> {
    try {
      // Use html2canvas to capture the element (would need to add this dependency)
      throw new Error('Element capture not implemented - requires html2canvas');
      
      // Placeholder - in a real implementation we'd convert the element to a canvas,
      // then to an image, following the pattern of our other methods
    } catch (error) {
      console.error('Error capturing element:', error);
      toast.error('Error capturing element');
      throw error;
    }
  }
}

export default ImageProcessor;
