
import { CropBoxProps } from './CropBox';

// Define all memorabilia types
export type MemorabiliaType = 'card' | 'ticket' | 'program' | 'autograph' | 'face' | 'unknown';

// Enhanced version with required memorabiliaType field for cropped items
export interface EnhancedCropBoxProps extends CropBoxProps {}

// Detect cards in an uploaded image
export async function detectCardsInImage(
  image: HTMLImageElement,
  enhancementEnabled: boolean = true,
  canvas?: HTMLCanvasElement | null,
  detectionTypes: MemorabiliaType[] = ['card', 'ticket', 'program', 'autograph', 'face']
): Promise<EnhancedCropBoxProps[]> {
  console.log('Detecting items in image:', image.src, 'with types:', detectionTypes);
  
  // This is a placeholder that would be replaced with actual ML detection logic
  // For now, we'll simulate detection based on the requested types
  const detectedItems: EnhancedCropBoxProps[] = [];
  
  // Simple detection simulation based on image dimensions
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  
  // If face detection is enabled
  if (detectionTypes.includes('face')) {
    // Simulate face detection with multiple faces in the upper part of the image
    const faceCount = Math.floor(Math.random() * 4) + 1; // 1-4 faces
    
    for (let i = 0; i < faceCount; i++) {
      const faceWidth = width * 0.15;
      const faceHeight = height * 0.18;
      const faceX = (width * 0.2) + (i * width * 0.2);
      const faceY = height * 0.2;
      
      detectedItems.push({
        id: detectedItems.length + 1,
        x: faceX,
        y: faceY,
        width: faceWidth,
        height: faceHeight,
        rotation: 0,
        color: '#FF5733',
        memorabiliaType: 'face',
        confidence: 0.85 + (Math.random() * 0.1)
      });
    }
  }
  
  // Card detection simulation
  if (detectionTypes.includes('card')) {
    const cardWidth = width * 0.4;
    const cardHeight = height * 0.5;
    const cardX = (width - cardWidth) / 2;
    const cardY = height * 0.5;
    
    detectedItems.push({
      id: detectedItems.length + 1,
      x: cardX,
      y: cardY,
      width: cardWidth,
      height: cardHeight,
      rotation: 0,
      color: '#33FF57',
      memorabiliaType: 'card',
      confidence: 0.9
    });
  }
  
  // Ticket detection simulation
  if (detectionTypes.includes('ticket')) {
    const ticketWidth = width * 0.3;
    const ticketHeight = height * 0.15;
    const ticketX = width * 0.1;
    const ticketY = height * 0.7;
    
    detectedItems.push({
      id: detectedItems.length + 1,
      x: ticketX,
      y: ticketY,
      width: ticketWidth,
      height: ticketHeight,
      rotation: 5, // Slight rotation
      color: '#3357FF',
      memorabiliaType: 'ticket',
      confidence: 0.82
    });
  }
  
  // If there are no detections, return a fallback detection
  if (detectedItems.length === 0) {
    detectedItems.push({
      id: 1,
      x: width * 0.25,
      y: height * 0.25,
      width: width * 0.5,
      height: height * 0.5,
      rotation: 0,
      color: '#FFFF33',
      memorabiliaType: 'unknown',
      confidence: 0.7
    });
  }
  
  return detectedItems;
}

// Apply crop to image and return cropped image
export async function applyCrop(
  cropBox: EnhancedCropBoxProps,
  canvas: HTMLCanvasElement | null,
  originalFile: File,
  image: HTMLImageElement,
  enhancementType?: MemorabiliaType
): Promise<{ file: File; url: string } | null> {
  if (!canvas) {
    console.error('Canvas is null');
    return null;
  }
  
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return null;
    }
    
    // Set canvas to the size of the crop
    canvas.width = cropBox.width;
    canvas.height = cropBox.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate the center of the crop box
    const cropCenterX = cropBox.width / 2;
    const cropCenterY = cropBox.height / 2;
    
    // Save context state
    ctx.save();
    
    // Move to center of canvas
    ctx.translate(cropCenterX, cropCenterY);
    
    // Apply rotation if needed
    if (cropBox.rotation) {
      ctx.rotate((cropBox.rotation * Math.PI) / 180);
    }
    
    // Draw the image with the crop box at the center
    ctx.drawImage(
      image,
      cropBox.x,
      cropBox.y,
      cropBox.width,
      cropBox.height,
      -cropBox.width / 2,
      -cropBox.height / 2,
      cropBox.width,
      cropBox.height
    );
    
    // Restore context state
    ctx.restore();
    
    // Apply image enhancement based on type
    if (enhancementType) {
      applyEnhancement(ctx, canvas.width, canvas.height, enhancementType);
    }
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          return null;
        }
        resolve(blob);
      }, 'image/png', 0.95);
    });
    
    const url = URL.createObjectURL(blob);
    const file = new File([blob], originalFile.name, { type: 'image/png' });
    
    return { file, url };
  } catch (error) {
    console.error('Error applying crop:', error);
    return null;
  }
}

// Apply image enhancement based on type
function applyEnhancement(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  type: MemorabiliaType
): void {
  // Get image data for manipulation
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  switch (type) {
    case 'face':
      // Soften and improve skin tones
      for (let i = 0; i < data.length; i += 4) {
        // Slightly increase brightness
        data[i] = Math.min(255, data[i] * 1.05);      // Red
        data[i+1] = Math.min(255, data[i+1] * 1.03);  // Green
        data[i+2] = Math.min(255, data[i+2] * 1.02);  // Blue
      }
      break;
    
    case 'card':
      // Enhance card colors and sharpness
      for (let i = 0; i < data.length; i += 4) {
        // Increase contrast
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.1 + 128));
        data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * 1.1 + 128));
        data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * 1.1 + 128));
      }
      break;
    
    case 'ticket':
      // Enhance text clarity on tickets
      for (let i = 0; i < data.length; i += 4) {
        // Increase contrast and slightly desaturate
        const avg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = Math.min(255, Math.max(0, data[i] * 0.9 + avg * 0.1));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] * 0.9 + avg * 0.1));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] * 0.9 + avg * 0.1));
      }
      break;
      
    case 'program':
      // Enhance colors for program pages
      for (let i = 0; i < data.length; i += 4) {
        // Boost saturation
        const avg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = Math.min(255, data[i] + (data[i] - avg) * 0.2);
        data[i+1] = Math.min(255, data[i+1] + (data[i+1] - avg) * 0.2);
        data[i+2] = Math.min(255, data[i+2] + (data[i+2] - avg) * 0.2);
      }
      break;
      
    case 'autograph':
      // Enhance contrast for autographs
      for (let i = 0; i < data.length; i += 4) {
        // High contrast to make ink stand out
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.3 + 128));
        data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * 1.3 + 128));
        data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * 1.3 + 128));
      }
      break;
      
    default:
      // Default enhancement - Stadium lighting correction
      for (let i = 0; i < data.length; i += 4) {
        // Adjust for typical stadium lighting (usually yellowish)
        // Slightly reduce yellow cast by adjusting blue channel
        data[i+2] = Math.min(255, data[i+2] * 1.05);
      }
      break;
  }
  
  ctx.putImageData(imageData, 0, 0);
}
