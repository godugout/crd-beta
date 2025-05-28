
// Web Worker for heavy image processing operations
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

let segmenter: any = null;

const initializeSegmenter = async () => {
  if (!segmenter) {
    try {
      segmenter = await pipeline(
        'image-segmentation', 
        'Xenova/segformer-b0-finetuned-ade-512-512',
        { device: 'webgpu' }
      );
    } catch (error) {
      segmenter = await pipeline(
        'image-segmentation', 
        'Xenova/segformer-b0-finetuned-ade-512-512'
      );
    }
  }
  return segmenter;
};

self.onmessage = async (e) => {
  const { type, payload, id } = e.data;
  
  try {
    switch (type) {
      case 'REMOVE_BACKGROUND': {
        const { imageData, width, height } = payload;
        
        // Report progress
        self.postMessage({ type: 'PROGRESS', id, progress: 10 });
        
        const seg = await initializeSegmenter();
        self.postMessage({ type: 'PROGRESS', id, progress: 30 });
        
        // Create canvas from image data
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.putImageData(new ImageData(imageData, width, height), 0, 0);
        
        self.postMessage({ type: 'PROGRESS', id, progress: 50 });
        
        // Convert to blob for processing
        const blob = await canvas.convertToBlob();
        const result = await seg(blob);
        
        self.postMessage({ type: 'PROGRESS', id, progress: 80 });
        
        // Process the mask
        if (result && result[0] && result[0].mask) {
          const outputCanvas = new OffscreenCanvas(width, height);
          const outputCtx = outputCanvas.getContext('2d');
          
          // Draw original image
          outputCtx.putImageData(new ImageData(imageData, width, height), 0, 0);
          
          // Apply mask
          const outputImageData = outputCtx.getImageData(0, 0, width, height);
          const data = outputImageData.data;
          
          for (let i = 0; i < result[0].mask.data.length; i++) {
            const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
            data[i * 4 + 3] = alpha;
          }
          
          outputCtx.putImageData(outputImageData, 0, 0);
          
          // Convert to blob
          const resultBlob = await outputCanvas.convertToBlob({ type: 'image/png' });
          const arrayBuffer = await resultBlob.arrayBuffer();
          
          self.postMessage({ 
            type: 'BACKGROUND_REMOVED', 
            id, 
            result: arrayBuffer 
          });
        }
        break;
      }
      
      case 'ENHANCE_IMAGE': {
        const { imageData, width, height, options } = payload;
        
        self.postMessage({ type: 'PROGRESS', id, progress: 20 });
        
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.putImageData(new ImageData(imageData, width, height), 0, 0);
        
        // Apply enhancements
        const imageDataToProcess = ctx.getImageData(0, 0, width, height);
        const data = imageDataToProcess.data;
        
        // Apply brightness, contrast, saturation
        for (let i = 0; i < data.length; i += 4) {
          // Brightness
          data[i] = Math.max(0, Math.min(255, data[i] + options.brightness * 2.55));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + options.brightness * 2.55));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + options.brightness * 2.55));
          
          // Contrast
          const contrastFactor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));
          data[i] = Math.max(0, Math.min(255, contrastFactor * (data[i] - 128) + 128));
          data[i + 1] = Math.max(0, Math.min(255, contrastFactor * (data[i + 1] - 128) + 128));
          data[i + 2] = Math.max(0, Math.min(255, contrastFactor * (data[i + 2] - 128) + 128));
        }
        
        ctx.putImageData(imageDataToProcess, 0, 0);
        
        self.postMessage({ type: 'PROGRESS', id, progress: 80 });
        
        const resultBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 });
        const arrayBuffer = await resultBlob.arrayBuffer();
        
        self.postMessage({ 
          type: 'IMAGE_ENHANCED', 
          id, 
          result: arrayBuffer 
        });
        break;
      }
    }
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      id, 
      error: error.message 
    });
  }
};
