
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * A custom hook for handling image processing operations
 */
export const useImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  /**
   * Loads an image from a URL
   */
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  };
  
  /**
   * Converts a File to a data URL
   */
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('FileReader did not return a string'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };
  
  /**
   * Resizes an image to fit within maxWidth/maxHeight while maintaining aspect ratio
   */
  const resizeImage = async (
    imgOrUrl: string | HTMLImageElement,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.85
  ): Promise<{ dataUrl: string; width: number; height: number }> => {
    setIsProcessing(true);
    
    try {
      const img = typeof imgOrUrl === 'string' ? await loadImage(imgOrUrl) : imgOrUrl;

      // Calculate dimensions while maintaining aspect ratio
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      // Create canvas and draw resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Draw image with better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      
      return { dataUrl, width, height };
    } catch (error) {
      console.error('Error resizing image:', error);
      toast.error('Error processing image');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  /**
   * Creates a thumbnail from an image
   * @param imgOrUrl - The image or URL to create a thumbnail from
   * @param size - The maximum size of the thumbnail (default: 200)
   * @returns A promise that resolves to the thumbnail data URL
   */
  const createThumbnail = async (
    imgOrUrl: string | HTMLImageElement | File,
    size = 200
  ): Promise<string> => {
    // Handle different input types
    let imgSource: string | HTMLImageElement;
    
    if (imgOrUrl instanceof File) {
      imgSource = await fileToDataUrl(imgOrUrl);
    } else {
      imgSource = imgOrUrl;
    }
    
    const { dataUrl } = await resizeImage(imgSource, size, size, 0.7);
    return dataUrl;
  };
  
  return {
    isProcessing,
    loadImage,
    fileToDataUrl,
    resizeImage,
    createThumbnail
  };
};

export default useImageProcessing;
