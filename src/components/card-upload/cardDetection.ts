
// Import the EnhancedCropBoxProps type we defined in CropBox.tsx
import { EnhancedCropBoxProps } from './CropBox';

// Export it again here to ensure it's available from both modules
export type { EnhancedCropBoxProps };

export type MemorabiliaType = 'card' | 'ticket' | 'photo' | 'program' | 'autograph' | 'face' | 'unknown';

export interface DetectedCard {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  confidence: number;
  memorabiliaType: MemorabiliaType;
}

// Example card detection function
export const detectCards = async (
  imageElement: HTMLImageElement
): Promise<EnhancedCropBoxProps[]> => {
  // Simulated card detection
  // In a real implementation, this would use ML to detect card boundaries
  
  const imageWidth = imageElement.naturalWidth;
  const imageHeight = imageElement.naturalHeight;
  
  // For demo purposes, just create a single box
  const detectedCards: EnhancedCropBoxProps[] = [
    {
      id: 1,
      x: imageWidth * 0.25, // 25% from left
      y: imageHeight * 0.25, // 25% from top
      width: imageWidth * 0.5, // 50% of image width
      height: imageHeight * 0.5, // 50% of image height
      rotation: 0,
      color: '#00FF00',
      memorabiliaType: 'card', // Default to card type
      confidence: 0.85, // High confidence example
    },
  ];
  
  return detectedCards;
};

// Added missing function for image cropping
export const applyCrop = async (
  cropBox: EnhancedCropBoxProps,
  canvasRef: HTMLCanvasElement | null,
  sourceFile: File,
  imageElement: HTMLImageElement,
  enhancementType?: MemorabiliaType
): Promise<{ file: File; url: string } | null> => {
  try {
    if (!canvasRef) {
      console.error("Canvas reference is null");
      return null;
    }

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error("Failed to get canvas context");
      return null;
    }
    
    // Set canvas size to match the crop dimensions
    canvas.width = cropBox.width;
    canvas.height = cropBox.height;
    
    // Clear the canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save context state before transformations
    ctx.save();
    
    // Apply rotation if needed (around center of the canvas)
    if (cropBox.rotation) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((cropBox.rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }
    
    // Draw the cropped portion
    ctx.drawImage(
      imageElement,
      cropBox.x, // Source x
      cropBox.y, // Source y
      cropBox.width, // Source width
      cropBox.height, // Source height
      0, // Destination x
      0, // Destination y
      canvas.width, // Destination width
      canvas.height // Destination height
    );
    
    // Restore context state
    ctx.restore();
    
    // Apply enhancements based on type
    if (enhancementType) {
      applyEnhancements(ctx, canvas.width, canvas.height, enhancementType);
    }
    
    // Convert canvas to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
    });
    
    if (!blob) {
      console.error("Failed to create blob from canvas");
      return null;
    }
    
    // Create a new File object
    const fileName = `cropped_${sourceFile.name}`;
    const newFile = new File([blob], fileName, { type: 'image/jpeg' });
    
    // Create an object URL for preview
    const url = URL.createObjectURL(blob);
    
    return { file: newFile, url };
  } catch (error) {
    console.error("Error in applyCrop:", error);
    return null;
  }
};

// Helper function to apply different enhancements based on memorabilia type
const applyEnhancements = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  type: MemorabiliaType
) => {
  // Apply different enhancements based on the type
  switch (type) {
    case 'card':
      // Enhance colors for baseball cards
      enhanceColors(ctx, width, height);
      break;
    case 'ticket':
      // Improve contrast for ticket stubs
      enhanceContrast(ctx, width, height);
      break;
    case 'program':
      // Improve text legibility for programs
      enhanceTextLegibility(ctx, width, height);
      break;
    case 'autograph':
      // Optimize visibility for autographs
      enhanceAutograph(ctx, width, height);
      break;
    case 'face':
      // Enhance portraits
      enhanceFace(ctx, width, height);
      break;
    default:
      // Basic enhancements for unknown types
      basicEnhance(ctx, width, height);
  }
};

// Enhancement functions
const enhanceColors = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // For demo purposes: simple saturation enhancement
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Simple saturation boost
  for (let i = 0; i < data.length; i += 4) {
    // Convert RGB to HSL, boost saturation, convert back
    // This is a simplified placeholder - in a real implementation,
    // more sophisticated image processing would be used
    if (data[i] < 240 && data[i+1] < 240 && data[i+2] < 240) {
      // Boost colors slightly if not white/near-white
      data[i] = Math.min(255, data[i] * 1.1);     // R
      data[i+1] = Math.min(255, data[i+1] * 1.1); // G
      data[i+2] = Math.min(255, data[i+2] * 1.1); // B
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const enhanceContrast = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Simple contrast enhancement
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  const factor = 1.2; // Contrast factor
  const intercept = 128 * (1 - factor);
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * data[i] + intercept;     // R
    data[i+1] = factor * data[i+1] + intercept; // G
    data[i+2] = factor * data[i+2] + intercept; // B
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const enhanceTextLegibility = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Text legibility enhancement (increase contrast and sharpness)
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Simple sharpen effect
  // In a real implementation, a proper convolution kernel would be used
  const factor = 1.3;
  const intercept = 128 * (1 - factor);
  
  for (let i = 0; i < data.length; i += 4) {
    // Increase contrast for text legibility
    data[i] = factor * data[i] + intercept;     // R
    data[i+1] = factor * data[i+1] + intercept; // G
    data[i+2] = factor * data[i+2] + intercept; // B
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const enhanceAutograph = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Enhance autograph visibility
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Increase contrast specifically for dark lines on light backgrounds
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i+1] + data[i+2]) / 3;
    
    // If pixel is dark (likely part of signature)
    if (avg < 100) {
      // Make it darker
      data[i] = data[i] * 0.7;     // R
      data[i+1] = data[i+1] * 0.7; // G
      data[i+2] = data[i+2] * 0.7; // B
    } 
    // If pixel is light (likely background)
    else if (avg > 180) {
      // Make it lighter
      data[i] = Math.min(255, data[i] * 1.1);     // R
      data[i+1] = Math.min(255, data[i+1] * 1.1); // G
      data[i+2] = Math.min(255, data[i+2] * 1.1); // B
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const enhanceFace = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Enhance portrait photos
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Slight warming filter and soften
  for (let i = 0; i < data.length; i += 4) {
    // Add slight warm tone to image
    data[i] = Math.min(255, data[i] * 1.05);     // R (slightly boosted)
    data[i+1] = Math.min(255, data[i+1] * 1.02); // G (slightly boosted)
    data[i+2] = Math.min(255, data[i+2] * 0.95); // B (slightly reduced)
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const basicEnhance = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Basic enhancement for unknown types
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Very mild enhancements
  for (let i = 0; i < data.length; i += 4) {
    // Slightly boost contrast
    data[i] = Math.min(255, data[i] * 1.05);     // R
    data[i+1] = Math.min(255, data[i+1] * 1.05); // G
    data[i+2] = Math.min(255, data[i+2] * 1.05); // B
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Function to determine memorabilia type based on aspect ratio
export const classifyMemorabiliaType = (
  width: number,
  height: number
): { type: MemorabiliaType; confidence: number } => {
  const aspectRatio = width / height;
  
  // Common aspect ratios for different memorabilia
  // Baseball cards typically 2.5:3.5 ratio (~0.71)
  // Tickets often wider, around 2:1 or 3:1
  // Photos can vary but often 4:3 or 3:2
  
  if (aspectRatio >= 0.65 && aspectRatio <= 0.75) {
    return { type: 'card', confidence: 0.9 };
  } else if (aspectRatio >= 1.8 && aspectRatio <= 3.2) {
    return { type: 'ticket', confidence: 0.85 };
  } else if ((aspectRatio >= 1.3 && aspectRatio <= 1.5) || 
             (aspectRatio >= 0.75 && aspectRatio <= 0.85)) {
    return { type: 'photo', confidence: 0.7 };
  } else {
    return { type: 'unknown', confidence: 0.5 };
  }
};

// Function to detect cards in an image (for the ImageHandling hook)
export const detectCardsInImage = async (
  imageElement: HTMLImageElement,
  enabledTypes?: MemorabiliaType[]
): Promise<EnhancedCropBoxProps[]> => {
  // In a real app, this would use machine learning to detect cards
  // For now, we'll use a simpler approach based on image divisions
  
  const imageWidth = imageElement.naturalWidth;
  const imageHeight = imageElement.naturalHeight;
  
  // For simplicity, we'll return a single detected card
  const detectedCard: EnhancedCropBoxProps = {
    id: 1,
    x: imageWidth * 0.1,
    y: imageHeight * 0.1,
    width: imageWidth * 0.8,
    height: imageHeight * 0.8,
    rotation: 0,
    color: '#2563eb', // blue color
    memorabiliaType: 'card',
    confidence: 0.85
  };
  
  return [detectedCard];
};
