
export type MemorabiliaType = 'card' | 'ticket' | 'program' | 'autograph' | 'face' | 'unknown' | 'group';
export type ExtendedMemorabiliaType = MemorabiliaType | 'group'; // For backward compatibility

export interface EnhancedCropBoxProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  memorabiliaType?: MemorabiliaType;
  confidence?: number;
  rotation?: number;
  color?: string;
}

export const applyCrop = async (
  cropBox: EnhancedCropBoxProps,
  canvas: HTMLCanvasElement | null,
  originalFile: File | null,
  originalImage: HTMLImageElement | null,
  enhancementType?: MemorabiliaType
): Promise<{ file: File; url: string } | null> => {
  if (!canvas || !originalFile || !originalImage) {
    console.error("Missing required parameters for applyCrop");
    return null;
  }

  try {
    // Create a new canvas for the cropped area
    const cropCanvas = document.createElement('canvas');
    const ctx = cropCanvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get 2D context for crop canvas");
      return null;
    }

    cropCanvas.width = cropBox.width;
    cropCanvas.height = cropBox.height;

    // Draw the cropped portion to the new canvas
    ctx.drawImage(
      originalImage,
      cropBox.x, cropBox.y, cropBox.width, cropBox.height,
      0, 0, cropBox.width, cropBox.height
    );

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      cropCanvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else resolve(new Blob([]));
      }, 'image/jpeg', 0.9);
    });

    // Create a new file
    const fileName = originalFile.name.replace(/\.[^/.]+$/, "") + "_crop_" + Date.now() + ".jpg";
    const croppedFile = new File([blob], fileName, { type: 'image/jpeg' });

    // Create a data URL for preview
    const dataUrl = cropCanvas.toDataURL('image/jpeg', 0.9);

    return { file: croppedFile, url: dataUrl };
  } catch (error) {
    console.error("Error in applyCrop:", error);
    return null;
  }
};

// Simple text detection function
export const detectText = async (input: HTMLCanvasElement | string): Promise<{
  title?: string;
  text?: string;
  tags?: string[];
  confidence?: number;
}> => {
  // In a real implementation, this would use OCR
  // Here we just return a placeholder
  return {
    title: "Detected Text",
    text: "Sample detected text from image",
    tags: ["detected", "text"],
    confidence: 0.8
  };
};

// Card detection function
export const detectCardsInImage = async (
  imageElement: HTMLImageElement | null
): Promise<EnhancedCropBoxProps[]> => {
  // In a real implementation, this would use some ML model
  // Here we just return a simple detection
  if (!imageElement) return [];
  
  const width = imageElement.naturalWidth;
  const height = imageElement.naturalHeight;
  
  // Create a simple detection in the center of the image
  return [{
    id: `auto-${Date.now()}`,
    x: width * 0.2,
    y: height * 0.2,
    width: width * 0.6,
    height: height * 0.6,
    memorabiliaType: 'card',
    confidence: 0.9,
    rotation: 0,
    color: '#00aaff'
  }];
};
