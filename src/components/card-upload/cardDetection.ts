
import { CropBoxProps } from './CropBox';

// Standard trading card ratio (2.5:3.5)
const CARD_RATIO = 2.5 / 3.5;
const RATIO_TOLERANCE = 0.15; // Allow some deviation from perfect ratio

export const detectCardsInImage = (
  img: HTMLImageElement,
  isStandardRatio: boolean,
  canvas: HTMLCanvasElement | null
): CropBoxProps[] => {
  const detectedCards: CropBoxProps[] = [];
  
  // If the image itself is already in card ratio, treat the whole image as a card
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
    return detectedCards;
  }
  
  // This would be replaced with actual card detection logic
  // For now, let's make some intelligent guesses about card locations
  
  // Simple edge detection mock
  const canvasWidth = img.width;
  const canvasHeight = img.height;
  
  // For a simple algorithm, check standard card ratio areas in the image
  // using a sliding window approach
  const checkForCardAtPosition = (x: number, y: number, width: number): boolean => {
    // Calculate height based on standard card ratio
    const height = width / CARD_RATIO;
    
    // Check if this region is likely to be a card
    // In a real implementation, this would analyze pixel data to detect card edges
    // For now, just check if it's within the image and meets minimum size requirements
    return (
      x >= 0 && y >= 0 && 
      x + width <= canvasWidth && 
      y + height <= canvasHeight &&
      width > 50 && height > 70  // Minimum reasonable card size
    );
  };
  
  // Try to detect multiple cards
  // Simplified approach: divide the image into grid cells and check each cell
  // In a real implementation, this would use computer vision techniques
  
  const gridSize = 3; // Try a 3x3 grid
  const cellWidth = canvasWidth / gridSize;
  const cellHeight = canvasHeight / gridSize;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col * cellWidth;
      const y = row * cellHeight;
      
      // Try different card sizes
      const cardWidth = Math.min(cellWidth * 0.9, cellHeight * 0.9 * CARD_RATIO);
      
      if (checkForCardAtPosition(x, y, cardWidth)) {
        // This position might contain a card
        // Calculate ideal height based on card ratio
        const cardHeight = cardWidth / CARD_RATIO;
        
        // Add detected card with some random offsets to make it look more realistic
        detectedCards.push({
          x: x + Math.random() * 20 - 10,
          y: y + Math.random() * 20 - 10,
          width: cardWidth,
          height: cardHeight,
          rotation: Math.random() * 5 - 2.5 // Slight random rotation
        });
      }
    }
  }
  
  // If no cards detected, just create a single crop box
  if (detectedCards.length === 0) {
    const defaultWidth = Math.min(canvasWidth, canvasHeight * CARD_RATIO) * 0.8;
    const defaultHeight = defaultWidth / CARD_RATIO;
    
    detectedCards.push({
      x: (canvasWidth - defaultWidth) / 2,
      y: (canvasHeight - defaultHeight) / 2,
      width: defaultWidth,
      height: defaultHeight,
      rotation: 0
    });
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
