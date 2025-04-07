
// Import the EnhancedCropBoxProps type we defined in CropBox.tsx
import { EnhancedCropBoxProps } from './CropBox';

// Export it again here to ensure it's available from both modules
export type { EnhancedCropBoxProps };

export type MemorabiliaType = 'card' | 'ticket' | 'photo' | 'jersey' | 'ball' | 'unknown';

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

// More utility functions can be added here
