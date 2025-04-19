
import { useState } from 'react';

export interface ProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  enhanceContrast?: boolean;
  enhanceSharpness?: boolean;
  autoWhiteBalance?: boolean;
}

export interface ImageData {
  width: number;
  height: number;
  url?: string;
  scale?: number;
  rotation?: number;
}

const useImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const fileToDataUrl = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const resizeImage = async (
    dataUrl: string,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 0.8
  ): Promise<{ dataUrl: string; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);

        resolve({ dataUrl: resizedDataUrl, width, height });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  };

  const processImage = async (
    imageData: ImageData | Blob,
    options: ProcessingOptions
  ): Promise<{ dataUrl: string; width: number; height: number }> => {
    setIsProcessing(true);
    
    try {
      let dataUrl: string;
      
      if (imageData instanceof Blob) {
        dataUrl = await fileToDataUrl(new File([imageData], 'image.jpg', { type: 'image/jpeg' }));
      } else if (imageData.url) {
        dataUrl = imageData.url;
      } else {
        throw new Error('Invalid image data');
      }
      
      const result = await resizeImage(
        dataUrl, 
        options.width || 1200,
        options.height || 1200,
        options.quality || 0.8
      );
      
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  // Add the createThumbnail function
  const createThumbnail = async (
    file: File,
    maxWidth: number = 300,
    maxHeight: number = 300
  ): Promise<string> => {
    try {
      const dataUrl = await fileToDataUrl(file);
      const result = await resizeImage(dataUrl, maxWidth, maxHeight, 0.7);
      return result.dataUrl;
    } catch (error) {
      console.error("Error creating thumbnail:", error);
      return '';
    }
  };

  const enhanceStadiumPhoto = async (imageDataUrl: string): Promise<string> => {
    // Simplified implementation - in a real app would use more sophisticated image processing
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageDataUrl); // Return original if context not available
          return;
        }

        // Draw image to canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data for manipulation
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple enhancement: increase contrast and brighten slightly
        for (let i = 0; i < data.length; i += 4) {
          // Increase contrast
          data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128)); // Red
          data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.2 + 128)); // Green
          data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.2 + 128)); // Blue
          
          // Brighten slightly
          data[i] = Math.min(255, data[i] * 1.1);
          data[i + 1] = Math.min(255, data[i + 1] * 1.1);
          data[i + 2] = Math.min(255, data[i + 2] * 1.1);
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      
      img.src = imageDataUrl;
    });
  };

  return {
    fileToDataUrl,
    resizeImage,
    processImage,
    enhanceStadiumPhoto,
    createThumbnail,
    isProcessing
  };
};

export default useImageProcessing;
