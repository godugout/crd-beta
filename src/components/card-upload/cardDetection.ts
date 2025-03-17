
import { CropBoxProps } from './CropBox';

export const detectCardsInImage = (
  img: HTMLImageElement,
  isStandardRatio: boolean,
  canvas: HTMLCanvasElement | null
): CropBoxProps[] => {
  const detectedCards: CropBoxProps[] = [];
  
  // If the image matches the standard card ratio, create a single crop box
  if (isStandardRatio) {
    const width = img.width;
    const height = img.height;
    detectedCards.push({
      x: 0,
      y: 0,
      width: width,
      height: height,
      rotation: 0
    });
  } else {
    // Mock card detection (replace with actual card detection logic)
    const numCards = Math.floor(Math.random() * 4) + 1; // Random number of cards between 1 and 4
    for (let i = 0; i < numCards; i++) {
      const width = img.width / numCards * (Math.random() * 0.4 + 0.8); // Varying widths
      const height = img.height / numCards * (Math.random() * 0.4 + 0.8); // Varying heights
      const x = Math.random() * (img.width - width);
      const y = Math.random() * (img.height - height);
      detectedCards.push({
        x: x,
        y: y,
        width: width,
        height: height,
        rotation: 0
      });
    }
  }
  
  return detectedCards;
};

export const applyCrop = async (
  cropBox: CropBoxProps,
  canvas: HTMLCanvasElement | null,
  originalFile: File,
  editorImg: HTMLImageElement
): Promise<{ file: File; url: string } | null> => {
  try {
    console.log("Applying crop with box:", cropBox);
    
    if (!editorImg) {
      console.error('Editor image is not available');
      return null;
    }
    
    // Create a temporary canvas
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    
    if (!ctx) {
      console.error('Could not get canvas context');
      return null;
    }
    
    // Calculate the cropping parameters
    const { x, y, width, height, rotation } = cropBox;
    
    // Set the canvas size to match the crop box dimensions
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // Save the context state before transformations
    ctx.save();
    
    // Move to the center of the canvas for rotation
    ctx.translate(width / 2, height / 2);
    
    // Rotate the canvas if needed
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }
    
    // Draw the image on the canvas, accounting for rotation and position
    try {
      ctx.drawImage(
        editorImg,
        x - width / 2,  // Source X - adjusted for rotation center
        y - height / 2, // Source Y - adjusted for rotation center
        width,          // Source width
        height,         // Source height
        -width / 2,     // Destination X - centered
        -height / 2,    // Destination Y - centered
        width,          // Destination width
        height          // Destination height
      );
    } catch (drawError) {
      console.error('Error drawing image on canvas:', drawError);
      // Try a more direct approach if the above fails
      ctx.restore();
      ctx.drawImage(editorImg, 0, 0, width, height);
    }
    
    // Restore the context state
    ctx.restore();
    
    // Convert the canvas to a blob
    const blob = await new Promise<Blob | null>((resolve) => {
      tempCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
    });
    
    if (!blob) {
      console.error('Failed to create blob from canvas');
      return null;
    }
    
    // Create a new file from the blob
    const croppedFile = new File([blob], originalFile.name, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    console.log("Successfully created cropped image:", url);
    return { file: croppedFile, url };
  } catch (error) {
    console.error('Error applying crop:', error);
    return null;
  }
};
