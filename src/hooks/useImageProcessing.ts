
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { imageProcessingPipeline, ProcessingOptions } from '@/services/imageProcessingPipeline';

/**
 * Enhanced version of the image processing hook that uses
 * the multi-stage processing pipeline
 */
export const useImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
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
   * Resizes an image using the progressive processing pipeline
   */
  const resizeImage = async (
    imgOrUrl: string | HTMLImageElement | File,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.85
  ): Promise<{ dataUrl: string; width: number; height: number }> => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      let file: File;
      let img: HTMLImageElement;
      
      // Prepare the input for processing
      if (imgOrUrl instanceof File) {
        file = imgOrUrl;
        const dataUrl = await fileToDataUrl(file);
        img = await loadImage(dataUrl);
      } else if (typeof imgOrUrl === 'string') {
        img = await loadImage(imgOrUrl);
        // Create a file from the image URL (for processing pipeline)
        const response = await fetch(imgOrUrl);
        const blob = await response.blob();
        file = new File([blob], 'image.jpg', { type: blob.type });
      } else {
        // It's already an HTMLImageElement
        img = imgOrUrl;
        
        // Create a canvas to convert the image to a blob
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        ctx.drawImage(img, 0, 0);
        
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create blob'));
            },
            'image/jpeg',
            0.95
          );
        });
        
        file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      }
      
      // Configure processing options
      const processingOptions: ProcessingOptions = {
        maxDimension: Math.max(maxWidth, maxHeight),
        compressionLevel: quality,
        optimizeForWeb: true,
        generateThumbnails: false,
        prioritizeSpeed: true
      };
      
      // Start the processing pipeline
      const jobId = imageProcessingPipeline.startProcessing(file, processingOptions);
      
      // Poll for progress updates
      const pollInterval = 100; // ms
      
      return new Promise((resolve, reject) => {
        const checkProgress = () => {
          const job = imageProcessingPipeline.getJobStatus(jobId);
          
          if (!job) {
            reject(new Error('Processing job not found'));
            return;
          }
          
          // Calculate overall progress
          const totalStages = job.stages.length;
          const completedStages = job.stages.filter(s => s.status === 'completed').length;
          const calculatedProgress = (completedStages / totalStages) * 100;
          setProgress(Math.round(calculatedProgress));
          
          // Check if complete
          if (job.isComplete) {
            if (job.processedUrl) {
              resolve({
                dataUrl: job.processedUrl,
                width: job.metadata.dimensions?.width || img.naturalWidth,
                height: job.metadata.dimensions?.height || img.naturalHeight
              });
            } else {
              reject(new Error('Processing completed but no URL was returned'));
            }
            return;
          }
          
          // Continue polling
          setTimeout(checkProgress, pollInterval);
        };
        
        // Start polling
        checkProgress();
      });
    } catch (error) {
      console.error('Error resizing image:', error);
      toast.error('Error processing image');
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
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
    try {
      setIsProcessing(true);
      setProgress(0);
      
      let file: File;
      
      // Prepare the input for processing
      if (imgOrUrl instanceof File) {
        file = imgOrUrl;
      } else if (typeof imgOrUrl === 'string') {
        // Create a file from the image URL (for processing pipeline)
        const response = await fetch(imgOrUrl);
        const blob = await response.blob();
        file = new File([blob], 'image.jpg', { type: blob.type });
      } else {
        // It's an HTMLImageElement
        const canvas = document.createElement('canvas');
        canvas.width = imgOrUrl.naturalWidth;
        canvas.height = imgOrUrl.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        ctx.drawImage(imgOrUrl, 0, 0);
        
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create blob'));
            },
            'image/jpeg',
            0.9
          );
        });
        
        file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      }
      
      // Configure processing options for thumbnail
      const processingOptions: ProcessingOptions = {
        maxDimension: size,
        compressionLevel: 0.85,
        optimizeForWeb: true,
        generateThumbnails: true,
        prioritizeSpeed: true
      };
      
      // Start the processing pipeline
      const jobId = imageProcessingPipeline.startProcessing(file, processingOptions);
      
      // Poll for progress updates
      const pollInterval = 100; // ms
      
      return new Promise((resolve, reject) => {
        const checkProgress = () => {
          const job = imageProcessingPipeline.getJobStatus(jobId);
          
          if (!job) {
            reject(new Error('Processing job not found'));
            return;
          }
          
          // Calculate overall progress
          const totalStages = job.stages.length;
          const completedStages = job.stages.filter(s => s.status === 'completed').length;
          const calculatedProgress = (completedStages / totalStages) * 100;
          setProgress(Math.round(calculatedProgress));
          
          // Check if thumbnail is ready
          const thumbnailStage = job.stages.find(s => s.name === 'thumbnail-generation');
          if (thumbnailStage && thumbnailStage.status === 'completed' && job.thumbnailUrl) {
            resolve(job.thumbnailUrl);
            return;
          }
          
          // Check if complete but no thumbnail (use processed image instead)
          if (job.isComplete && job.processedUrl) {
            resolve(job.processedUrl);
            return;
          }
          
          // Continue polling
          setTimeout(checkProgress, pollInterval);
        };
        
        // Start polling
        checkProgress();
      });
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      toast.error('Error processing thumbnail');
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };
  
  /**
   * Performs automatic enhancements for stadium photos
   */
  const enhanceStadiumPhoto = async (
    imgOrUrl: string | HTMLImageElement | File
  ): Promise<string> => {
    try {
      setIsProcessing(true);
      setProgress(0);
      
      let file: File;
      
      // Prepare the input for processing
      if (imgOrUrl instanceof File) {
        file = imgOrUrl;
      } else if (typeof imgOrUrl === 'string') {
        // Create a file from the image URL (for processing pipeline)
        const response = await fetch(imgOrUrl);
        const blob = await response.blob();
        file = new File([blob], 'image.jpg', { type: blob.type });
      } else {
        // It's an HTMLImageElement
        const canvas = document.createElement('canvas');
        canvas.width = imgOrUrl.naturalWidth;
        canvas.height = imgOrUrl.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        ctx.drawImage(imgOrUrl, 0, 0);
        
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create blob'));
            },
            'image/jpeg',
            0.9
          );
        });
        
        file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      }
      
      // Configure processing options for stadium photo enhancement
      const processingOptions: ProcessingOptions = {
        enhanceQuality: true,
        stadiumLightingFix: true,
        autoContrast: true,
        sharpen: true,
        optimizeForWeb: true,
        prioritizeSpeed: false // Higher quality for stadium photos
      };
      
      // Start the processing pipeline
      const jobId = imageProcessingPipeline.startProcessing(file, processingOptions);
      
      // Poll for progress updates
      const pollInterval = 100; // ms
      
      return new Promise((resolve, reject) => {
        const checkProgress = () => {
          const job = imageProcessingPipeline.getJobStatus(jobId);
          
          if (!job) {
            reject(new Error('Processing job not found'));
            return;
          }
          
          // Calculate overall progress
          const totalStages = job.stages.length;
          const completedStages = job.stages.filter(s => s.status === 'completed').length;
          const calculatedProgress = (completedStages / totalStages) * 100;
          setProgress(Math.round(calculatedProgress));
          
          // Check if quality enhancement is complete
          const enhancementStage = job.stages.find(s => s.name === 'quality-enhancement');
          if (enhancementStage && enhancementStage.status === 'completed' && 
              enhancementStage.result?.enhancedUrl) {
            resolve(enhancementStage.result.enhancedUrl);
            return;
          }
          
          // Check if complete
          if (job.isComplete) {
            if (job.processedUrl) {
              resolve(job.processedUrl);
            } else {
              reject(new Error('Processing completed but no URL was returned'));
            }
            return;
          }
          
          // Continue polling
          setTimeout(checkProgress, pollInterval);
        };
        
        // Start polling
        checkProgress();
      });
    } catch (error) {
      console.error('Error enhancing stadium photo:', error);
      toast.error('Error enhancing photo');
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };
  
  return {
    isProcessing,
    progress,
    loadImage,
    fileToDataUrl,
    resizeImage,
    createThumbnail,
    enhanceStadiumPhoto
  };
};

export default useImageProcessing;
