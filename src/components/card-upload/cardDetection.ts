
export type MemorabiliaType = 'card' | 'ticket' | 'program' | 'autograph' | 'face' | 'unknown';

export interface DetectedMemorabiliaItem {
  type: MemorabiliaType;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  metadata?: Record<string, any>;
}

// Export the EnhancedCropBoxProps interface that many files are trying to import
export interface EnhancedCropBoxProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  color?: string;
  memorabiliaType?: MemorabiliaType;
  confidence?: number;
}

export const detectMemorabiliaType = async (
  imageData: string | Blob
): Promise<DetectedMemorabiliaItem[]> => {
  // For now, this is a placeholder implementation
  // In a real app, this would call a machine learning model or API
  console.log('Detecting memorabilia type from image...');
  
  return [
    {
      type: 'card',
      confidence: 0.85,
      boundingBox: {
        x: 10,
        y: 10,
        width: 200,
        height: 300
      }
    }
  ];
};

// Add the missing functions that are being imported elsewhere
export const applyCrop = async (
  cropBox: EnhancedCropBoxProps,
  canvas: HTMLCanvasElement | null,
  originalFile: File,
  imgElement: HTMLImageElement | null,
  enhanceType?: MemorabiliaType
): Promise<{ file: File; url: string } | null> => {
  // Implementation for applying crop to image
  if (!canvas || !imgElement) return null;
  
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Set canvas dimensions to crop box size
    canvas.width = cropBox.width;
    canvas.height = cropBox.height;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the cropped portion of the image
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (cropBox.rotation) {
      ctx.rotate((cropBox.rotation * Math.PI) / 180);
    }
    ctx.drawImage(
      imgElement,
      cropBox.x, cropBox.y, cropBox.width, cropBox.height,
      -cropBox.width / 2, -cropBox.height / 2, cropBox.width, cropBox.height
    );
    ctx.restore();
    
    // If enhanceType is provided, apply enhancements based on type
    if (enhanceType) {
      // Simple enhancement logic - can be expanded later
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Basic contrast boost
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Adjust contrast slightly
        imageData.data[i] = Math.min(255, (imageData.data[i] - 128) * 1.2 + 128);
        imageData.data[i + 1] = Math.min(255, (imageData.data[i + 1] - 128) * 1.2 + 128);
        imageData.data[i + 2] = Math.min(255, (imageData.data[i + 2] - 128) * 1.2 + 128);
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else resolve(new Blob([]));
      }, 'image/jpeg', 0.9);
    });
    
    // Create a new file from the blob
    const fileName = `cropped-${Date.now()}.jpg`;
    const croppedFile = new File([blob], fileName, { type: 'image/jpeg' });
    
    return {
      file: croppedFile,
      url: URL.createObjectURL(blob)
    };
  } catch (error) {
    console.error('Error applying crop:', error);
    return null;
  }
};

export const detectText = async (canvas: HTMLCanvasElement): Promise<any> => {
  // Implementation for OCR text detection
  // This would normally call an API or use a library like Tesseract.js
  // For now, we return mock data
  
  console.log('Detecting text in image...');
  
  // Mock data for a baseball card
  return {
    title: "1990 Topps Baseball",
    player: "Player Name",
    team: "Team Name",
    position: "Pitcher",
    year: "1990",
    manufacturer: "Topps",
    tags: ["baseball", "pitcher", "vintage"],
    confidence: 0.85,
    text: "Some text detected on the card."
  };
};

export const detectCardsInImage = async (
  imgElement: HTMLImageElement,
  enhanceImage = false,
  canvasRef: HTMLCanvasElement | null = null,
  enabledTypes: MemorabiliaType[] = ['card', 'ticket', 'program', 'autograph', 'face']
): Promise<EnhancedCropBoxProps[]> => {
  // Implementation for detecting cards in an image
  // This would normally use computer vision or ML
  
  console.log('Detecting cards in image with enabled types:', enabledTypes);
  
  // For now, return a mock detection for a single card
  const mockDetections: EnhancedCropBoxProps[] = [
    {
      id: `card-${Date.now()}-1`,
      x: imgElement.naturalWidth * 0.2,
      y: imgElement.naturalHeight * 0.2,
      width: imgElement.naturalWidth * 0.6,
      height: imgElement.naturalHeight * 0.6,
      rotation: 0,
      color: '#ff0000',
      memorabiliaType: 'card',
      confidence: 0.85
    }
  ];
  
  // If 'face' is enabled, add a face detection
  if (enabledTypes.includes('face')) {
    mockDetections.push({
      id: `face-${Date.now()}-1`,
      x: imgElement.naturalWidth * 0.4,
      y: imgElement.naturalHeight * 0.1,
      width: imgElement.naturalWidth * 0.2,
      height: imgElement.naturalWidth * 0.2,
      rotation: 0,
      color: '#00ff00',
      memorabiliaType: 'face',
      confidence: 0.92
    });
  }
  
  return mockDetections;
};

// Add 'group' to the MemorabiliaType union type if needed
export type ExtendedMemorabiliaType = MemorabiliaType | 'group';

