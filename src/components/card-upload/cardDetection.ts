
import { CropBoxProps } from './CropBox';

// Standard trading card ratio (2.5:3.5)
const CARD_RATIO = 2.5 / 3.5;
const RATIO_TOLERANCE = 0.15; // Allow some deviation from perfect ratio
const FACE_RATIO = 0.8; // Approximate ratio for a face/portrait

// Face detection constants
const MIN_FACE_SIZE = 50;
const FACE_SPACING = 15; // Minimum spacing between faces
const MAX_FACE_DETECTIONS = 10; // Limit detections to prevent excessive processing

export const detectCardsInImage = (
  img: HTMLImageElement,
  isStandardRatio: boolean,
  canvas: HTMLCanvasElement | null,
  batchDetectionMode = false
): CropBoxProps[] => {
  const detectedCards: CropBoxProps[] = [];
  
  // If the image itself is already in card ratio, treat the whole image as a card
  if (isStandardRatio && !batchDetectionMode) {
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
  
  // Dimensions for detection
  const canvasWidth = img.width;
  const canvasHeight = img.height;
  
  if (batchDetectionMode) {
    // In batch detection mode, try to detect faces/people
    return detectFacesInImage(img, canvasWidth, canvasHeight);
  }

  // For regular card detection, use a grid-based approach
  // This would be replaced with actual card detection logic
  const gridSize = 3; // Try a 3x3 grid
  const cellWidth = canvasWidth / gridSize;
  const cellHeight = canvasHeight / gridSize;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col * cellWidth;
      const y = row * cellHeight;
      
      // Try different card sizes
      const cardWidth = Math.min(cellWidth * 0.9, cellHeight * 0.9 * CARD_RATIO);
      
      if (checkForCardAtPosition(x, y, cardWidth, canvasWidth, canvasHeight)) {
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

// Helper function to check if a card might be at a certain position
const checkForCardAtPosition = (
  x: number, 
  y: number, 
  width: number, 
  canvasWidth: number, 
  canvasHeight: number
): boolean => {
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

/**
 * Detects potential faces/people in the image
 */
const detectFacesInImage = (
  img: HTMLImageElement, 
  imgWidth: number, 
  imgHeight: number
): CropBoxProps[] => {
  const faces: CropBoxProps[] = [];
  
  // For a simple approach, use a grid-based detection system targeted at face-like proportions
  // In a production app, we'd use a real ML-based face detection API
  
  // We'll scan the image with overlapping windows looking for faces
  const scanStep = Math.min(imgWidth, imgHeight) / 16; // Window overlap amount
  
  // Try different face sizes
  const minFaceSize = Math.max(MIN_FACE_SIZE, Math.min(imgWidth, imgHeight) / 12);
  const maxFaceSize = Math.min(imgWidth, imgHeight) / 3;
  const sizesCount = 3;
  
  // Different face sizes to try
  for (let sizeIndex = 0; sizeIndex < sizesCount; sizeIndex++) {
    // Calculate face size for this iteration
    const faceWidth = minFaceSize + (maxFaceSize - minFaceSize) * (sizeIndex / (sizesCount - 1));
    // Use a more portrait-like aspect ratio for faces
    const faceHeight = faceWidth / FACE_RATIO;
    
    // Scan the image
    for (let y = 0; y <= imgHeight - faceHeight; y += scanStep) {
      for (let x = 0; x <= imgWidth - faceWidth; x += scanStep) {
        // Don't place faces too close to the edges
        if (x < 10 || y < 10 || x > imgWidth - faceWidth - 10 || y > imgHeight - faceHeight - 10) continue;
        
        // Check if this might be a face (using a placeholder heuristic)
        if (Math.random() < 0.1) { // 10% chance - we're simulating a face detector
          // Check if this face overlaps with existing detections
          if (!faces.some(face => 
            Math.abs(face.x - x) < FACE_SPACING && 
            Math.abs(face.y - y) < FACE_SPACING
          )) {
            faces.push({
              x: x,
              y: y,
              width: faceWidth,
              height: faceHeight,
              rotation: Math.random() * 5 - 2.5 // Slight random rotation
            });
            
            // Limit the number of faces detected
            if (faces.length >= MAX_FACE_DETECTIONS) {
              break;
            }
          }
        }
      }
      
      if (faces.length >= MAX_FACE_DETECTIONS) {
        break;
      }
    }
  }
  
  // If no faces detected or batch mode, generate a grid of potential areas
  if (faces.length === 0) {
    // Create a grid of potential faces
    const gridColumns = Math.ceil(Math.sqrt(imgWidth / imgHeight) * 3);
    const gridRows = Math.ceil(3 / gridColumns);
    
    const cellWidth = imgWidth / gridColumns;
    const cellHeight = imgHeight / gridRows;
    
    // Adjust for face ratio
    const faceWidth = Math.min(cellWidth * 0.8, cellHeight * 0.8 / FACE_RATIO);
    const faceHeight = faceWidth / FACE_RATIO;
    
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridColumns; col++) {
        const x = col * cellWidth + (cellWidth - faceWidth) / 2;
        const y = row * cellHeight + (cellHeight - faceHeight) / 2;
        
        faces.push({
          x: x,
          y: y,
          width: faceWidth,
          height: faceHeight,
          rotation: Math.random() * 5 - 2.5 // Slight random rotation
        });
        
        if (faces.length >= MAX_FACE_DETECTIONS) {
          break;
        }
      }
      
      if (faces.length >= MAX_FACE_DETECTIONS) {
        break;
      }
    }
  }
  
  return faces;
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
