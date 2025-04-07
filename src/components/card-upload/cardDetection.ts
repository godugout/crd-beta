
import { CropBoxProps } from './CropBox';

// Define all memorabilia types
export type MemorabiliaType = 'card' | 'ticket' | 'program' | 'autograph' | 'face' | 'unknown';

// Enhanced version with required memorabiliaType field for cropped items
export interface EnhancedCropBoxProps extends CropBoxProps {
  memorabiliaType: MemorabiliaType;
  confidence: number;
}

// Detect cards in an uploaded image
export async function detectCardsInImage(
  image: HTMLImageElement
): Promise<EnhancedCropBoxProps[]> {
  console.log('Detecting cards in image:', image.src);
  
  // This is a placeholder that would be replaced with actual ML detection logic
  // For now, we'll return a single box in the center of the image
  const width = image.naturalWidth * 0.5;
  const height = image.naturalHeight * 0.7;
  const x = (image.naturalWidth - width) / 2;
  const y = (image.naturalHeight - height) / 2;
  
  return [
    {
      id: 1,
      x,
      y,
      width,
      height,
      rotation: 0,
      color: '#00FF00',
      memorabiliaType: 'card', // Default to card
      confidence: 0.85
    }
  ];
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
