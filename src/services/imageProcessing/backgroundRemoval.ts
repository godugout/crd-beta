import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 1024;

interface BackgroundRemovalOptions {
  onProgress?: (progress: number) => void;
  quality?: 'fast' | 'high';
}

let segmenter: any = null;

export const initializeBackgroundRemoval = async () => {
  if (!segmenter) {
    try {
      segmenter = await pipeline(
        'image-segmentation', 
        'Xenova/segformer-b0-finetuned-ade-512-512',
        { device: 'webgpu' }
      );
    } catch (error) {
      // Fallback to CPU if WebGPU fails
      segmenter = await pipeline(
        'image-segmentation', 
        'Xenova/segformer-b0-finetuned-ade-512-512'
      );
    }
  }
  return segmenter;
};

const resizeImageIfNeeded = (
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D, 
  image: HTMLImageElement
) => {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  return { width, height };
};

export const removeBackground = async (
  imageElement: HTMLImageElement,
  options: BackgroundRemovalOptions = {}
): Promise<{ blob: Blob; dataUrl: string }> => {
  const { onProgress, quality = 'fast' } = options;
  
  try {
    onProgress?.(10);
    
    // Initialize segmenter if needed
    const seg = await initializeBackgroundRemoval();
    
    onProgress?.(30);
    
    // Prepare canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    const { width, height } = resizeImageIfNeeded(canvas, ctx, imageElement);
    
    onProgress?.(50);
    
    // Convert to base64 for processing
    const imageData = canvas.toDataURL('image/jpeg', quality === 'high' ? 0.95 : 0.8);
    
    // Process with AI
    const result = await seg(imageData);
    
    onProgress?.(80);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    // Create output canvas
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = width;
    outputCanvas.height = height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply mask to alpha channel
    const outputImageData = outputCtx.getImageData(0, 0, width, height);
    const data = outputImageData.data;
    
    // Apply inverted mask (keep subject, remove background)
    for (let i = 0; i < result[0].mask.data.length; i++) {
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    
    onProgress?.(100);
    
    // Convert to blob and data URL
    const blob = await new Promise<Blob>((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
        'image/png',
        1.0
      );
    });
    
    const dataUrl = URL.createObjectURL(blob);
    
    return { blob, dataUrl };
  } catch (error) {
    console.error('Background removal failed:', error);
    throw error;
  }
};

export const replaceBackground = (
  foregroundCanvas: HTMLCanvasElement,
  background: { type: 'color' | 'gradient' | 'image'; value: string | CanvasGradient | HTMLImageElement }
): Promise<{ blob: Blob; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = foregroundCanvas.width;
      canvas.height = foregroundCanvas.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Draw background
      if (background.type === 'color' && typeof background.value === 'string') {
        ctx.fillStyle = background.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (background.type === 'image' && background.value instanceof HTMLImageElement) {
        ctx.drawImage(background.value, 0, 0, canvas.width, canvas.height);
      }
      
      // Draw foreground with transparency
      ctx.drawImage(foregroundCanvas, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const dataUrl = URL.createObjectURL(blob);
            resolve({ blob, dataUrl });
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    } catch (error) {
      reject(error);
    }
  });
};
