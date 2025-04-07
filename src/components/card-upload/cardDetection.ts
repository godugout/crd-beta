
import { CropBoxProps } from './CropBox';

// Standard trading card ratio (2.5:3.5)
const CARD_RATIO = 2.5 / 3.5;
const RATIO_TOLERANCE = 0.15; // Allow some deviation from perfect ratio
const FACE_RATIO = 0.8; // Approximate ratio for a face/portrait

// Memorabilia type ratios and detection constants
const TICKET_RATIO = 2.0 / 1.0; // Typical ticket stub ratio (width/height)
const PROGRAM_RATIO = 1.4 / 1.0; // Typical program ratio
const AUTOGRAPH_MIN_SIZE = 60; // Minimum size for autograph detection

// Face detection constants
const MIN_FACE_SIZE = 50;
const FACE_SPACING = 15; // Minimum spacing between faces
const MAX_FACE_DETECTIONS = 10; // Limit detections to prevent excessive processing

// Memorabilia types
export type MemorabiliaType = 'card' | 'ticket' | 'program' | 'autograph' | 'face' | 'unknown';

// Enhanced crop box with memorabilia type
export interface EnhancedCropBoxProps extends CropBoxProps {
  memorabiliaType: MemorabiliaType;
  confidence: number; // Detection confidence (0-1)
}

export const detectCardsInImage = (
  img: HTMLImageElement,
  isStandardRatio: boolean,
  canvas: HTMLCanvasElement | null,
  batchDetectionMode = false,
  detectMemorabiliaTypes = true
): EnhancedCropBoxProps[] => {
  const detectedItems: EnhancedCropBoxProps[] = [];
  
  // If the image itself is already in card ratio, treat the whole image as a card
  if (isStandardRatio && !batchDetectionMode) {
    const width = img.width;
    const height = img.height;
    detectedItems.push({
      x: 0,
      y: 0,
      width: width,
      height: height,
      rotation: 0,
      memorabiliaType: 'card',
      confidence: 0.95
    });
    return detectedItems;
  }
  
  // Dimensions for detection
  const canvasWidth = img.width;
  const canvasHeight = img.height;
  
  if (batchDetectionMode) {
    // In batch detection mode, try to detect faces/people
    return detectFacesInImage(img, canvasWidth, canvasHeight);
  }

  // For memorabilia detection
  if (detectMemorabiliaTypes) {
    // Detect tickets
    const ticketDetections = detectTicketStubs(img, canvasWidth, canvasHeight);
    detectedItems.push(...ticketDetections);
    
    // Detect programs/scorecards
    const programDetections = detectPrograms(img, canvasWidth, canvasHeight);
    detectedItems.push(...programDetections);
    
    // Detect autographed items
    const autographDetections = detectAutographs(img, canvasWidth, canvasHeight);
    detectedItems.push(...autographDetections);
  }

  // If no specialized memorabilia was detected, fall back to card detection
  if (detectedItems.length === 0) {
    // Standard card detection using grid approach
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
          // Calculate ideal height based on card ratio
          const cardHeight = cardWidth / CARD_RATIO;
          
          detectedItems.push({
            x: x + Math.random() * 20 - 10,
            y: y + Math.random() * 20 - 10,
            width: cardWidth,
            height: cardHeight,
            rotation: Math.random() * 5 - 2.5,
            memorabiliaType: 'card',
            confidence: 0.7 + Math.random() * 0.2
          });
        }
      }
    }
  }
  
  // If still no cards detected, just create a single crop box
  if (detectedItems.length === 0) {
    const defaultWidth = Math.min(canvasWidth, canvasHeight * CARD_RATIO) * 0.8;
    const defaultHeight = defaultWidth / CARD_RATIO;
    
    detectedItems.push({
      x: (canvasWidth - defaultWidth) / 2,
      y: (canvasHeight - defaultHeight) / 2,
      width: defaultWidth,
      height: defaultHeight,
      rotation: 0,
      memorabiliaType: 'unknown',
      confidence: 0.6
    });
  }
  
  return detectedItems;
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
  
  return (
    x >= 0 && y >= 0 && 
    x + width <= canvasWidth && 
    y + height <= canvasHeight &&
    width > 50 && height > 70  // Minimum reasonable card size
  );
};

// Detect ticket stubs in the image
const detectTicketStubs = (
  img: HTMLImageElement,
  imgWidth: number,
  imgHeight: number
): EnhancedCropBoxProps[] => {
  const tickets: EnhancedCropBoxProps[] = [];
  
  // Look for rectangular shapes with ticket-like proportions
  const scanStep = Math.min(imgWidth, imgHeight) / 12;
  
  // Try different ticket sizes
  const minTicketWidth = Math.min(imgWidth, imgHeight) / 5;
  const maxTicketWidth = Math.min(imgWidth, imgHeight) * 0.8;
  
  for (let width = minTicketWidth; width < maxTicketWidth; width += scanStep) {
    const height = width / TICKET_RATIO;
    
    // Don't continue if the height exceeds image bounds
    if (height > imgHeight) continue;
    
    // Scan the image
    for (let y = 0; y <= imgHeight - height; y += scanStep) {
      for (let x = 0; x <= imgWidth - width; x += scanStep) {
        // Simple edge detection simulation (would be more sophisticated with real CV)
        const hasStrongEdges = Math.random() < 0.15; // Simulate 15% chance of detecting a ticket
        
        if (hasStrongEdges) {
          const confidence = 0.7 + Math.random() * 0.2;
          tickets.push({
            x: x,
            y: y,
            width: width,
            height: height,
            rotation: Math.random() * 8 - 4, // Slight random rotation
            memorabiliaType: 'ticket',
            confidence: confidence
          });
          
          // Avoid adding too many overlapping tickets
          if (tickets.length >= 3) break;
        }
      }
      if (tickets.length >= 3) break;
    }
    if (tickets.length >= 3) break;
  }
  
  return tickets;
};

// Detect programs and scorecards
const detectPrograms = (
  img: HTMLImageElement,
  imgWidth: number,
  imgHeight: number
): EnhancedCropBoxProps[] => {
  const programs: EnhancedCropBoxProps[] = [];
  
  // Programs typically have a more square-like proportion
  const minProgramWidth = Math.min(imgWidth, imgHeight) / 4;
  const maxProgramWidth = Math.min(imgWidth, imgHeight) * 0.9;
  const scanStep = Math.min(imgWidth, imgHeight) / 10;
  
  for (let width = minProgramWidth; width < maxProgramWidth; width += scanStep) {
    const height = width / PROGRAM_RATIO;
    
    // Don't continue if the height exceeds image bounds
    if (height > imgHeight) continue;
    
    // Scan the image
    for (let y = 0; y <= imgHeight - height; y += scanStep) {
      for (let x = 0; x <= imgWidth - width; x += scanStep) {
        // Simulate detection (would be more sophisticated with real CV)
        const hasBookStyle = Math.random() < 0.1; // Simulate 10% chance
        
        if (hasBookStyle) {
          const confidence = 0.65 + Math.random() * 0.25;
          programs.push({
            x: x,
            y: y,
            width: width,
            height: height,
            rotation: Math.random() * 6 - 3, // Slight random rotation
            memorabiliaType: 'program',
            confidence: confidence
          });
          
          // Limit the number of programs detected
          if (programs.length >= 2) break;
        }
      }
      if (programs.length >= 2) break;
    }
    if (programs.length >= 2) break;
  }
  
  return programs;
};

// Detect autographed items
const detectAutographs = (
  img: HTMLImageElement,
  imgWidth: number,
  imgHeight: number
): EnhancedCropBoxProps[] => {
  const autographs: EnhancedCropBoxProps[] = [];
  
  // Autographs can have varied sizes and shapes
  // We'll look for ink-like patterns (would be more sophisticated in a real implementation)
  const minSize = AUTOGRAPH_MIN_SIZE;
  const maxSize = Math.min(imgWidth, imgHeight) / 2;
  const scanStep = Math.min(imgWidth, imgHeight) / 8;
  
  for (let size = minSize; size <= maxSize; size += scanStep) {
    // Autographs often have uneven dimensions
    const width = size;
    const height = size * (0.5 + Math.random() * 0.5); // Varied heights
    
    // Scan the image
    for (let y = 10; y <= imgHeight - height - 10; y += scanStep) {
      for (let x = 10; x <= imgWidth - width - 10; x += scanStep) {
        // Simulate ink detection (would be more sophisticated with real CV)
        const hasInkSignature = Math.random() < 0.12; // 12% chance
        
        if (hasInkSignature) {
          const confidence = 0.6 + Math.random() * 0.3;
          autographs.push({
            x: x,
            y: y,
            width: width,
            height: height,
            rotation: Math.random() * 15 - 7.5, // Signatures can be at various angles
            memorabiliaType: 'autograph',
            confidence: confidence
          });
          
          // Limit the number of autographs detected
          if (autographs.length >= 2) break;
        }
      }
      if (autographs.length >= 2) break;
    }
    if (autographs.length >= 2) break;
  }
  
  return autographs;
};

/**
 * Detects potential faces/people in the image
 */
const detectFacesInImage = (
  img: HTMLImageElement, 
  imgWidth: number, 
  imgHeight: number
): EnhancedCropBoxProps[] => {
  const faces: EnhancedCropBoxProps[] = [];
  
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
              rotation: Math.random() * 5 - 2.5, // Slight random rotation
              memorabiliaType: 'face',
              confidence: 0.7 + Math.random() * 0.25
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
          rotation: Math.random() * 5 - 2.5, // Slight random rotation
          memorabiliaType: 'face',
          confidence: 0.6 + Math.random() * 0.2
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

// Specialized image processing based on memorabilia type
export const enhanceImage = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  memorabiliaType: MemorabiliaType
): void => {
  // Get image data for processing
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  switch(memorabiliaType) {
    case 'ticket':
      // Enhance contrast for ticket stubs to improve text legibility
      enhanceContrast(data, 1.2);
      sharpenImage(data, canvas.width, canvas.height);
      break;
      
    case 'card':
      // Restore faded colors for baseball cards
      enhanceSaturation(data, 1.3);
      enhanceContrast(data, 1.1);
      break;
      
    case 'program':
      // Improve text legibility on programs/scorecards
      enhanceContrast(data, 1.15);
      sharpenImage(data, canvas.width, canvas.height);
      break;
      
    case 'autograph':
      // Enhance autograph visibility
      enhanceContrast(data, 1.4);
      sharpenImage(data, canvas.width, canvas.height, 1.5);
      break;
      
    case 'face':
      // Gentle enhancement for faces
      enhanceContrast(data, 1.05);
      break;
      
    case 'unknown':
    default:
      // General purpose enhancement
      enhanceContrast(data, 1.1);
      break;
  }
  
  // Apply changes back to canvas
  ctx.putImageData(imageData, 0, 0);
};

// Helper functions for image enhancement
const enhanceContrast = (data: Uint8ClampedArray, factor: number = 1.2): void => {
  for (let i = 0; i < data.length; i += 4) {
    // Apply contrast enhancement to RGB channels
    data[i] = clamp(((data[i] / 255 - 0.5) * factor + 0.5) * 255);
    data[i+1] = clamp(((data[i+1] / 255 - 0.5) * factor + 0.5) * 255);
    data[i+2] = clamp(((data[i+2] / 255 - 0.5) * factor + 0.5) * 255);
  }
};

const enhanceSaturation = (data: Uint8ClampedArray, factor: number = 1.3): void => {
  for (let i = 0; i < data.length; i += 4) {
    // Convert RGB to HSL
    const r = data[i] / 255;
    const g = data[i+1] / 255;
    const b = data[i+2] / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    // Increase saturation
    s = Math.min(s * factor, 1);
    
    // Convert back to RGB
    const convertHslToRgb = (h: number, s: number, l: number) => {
      let r, g, b;
      
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      
      return { r: r * 255, g: g * 255, b: b * 255 };
    };
    
    const rgb = convertHslToRgb(h, s, l);
    data[i] = clamp(rgb.r);
    data[i+1] = clamp(rgb.g);
    data[i+2] = clamp(rgb.b);
  }
};

const sharpenImage = (
  data: Uint8ClampedArray, 
  width: number, 
  height: number, 
  intensity: number = 1
): void => {
  // Create a copy of the image data for the sharpening operation
  const tempData = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i++) {
    tempData[i] = data[i];
  }
  
  // Apply a simple sharpening kernel
  const kernel = [
    0, -intensity, 0,
    -intensity, 1 + 4 * intensity, -intensity,
    0, -intensity, 0
  ];
  
  const kernelSize = 3;
  const kernelHalfSize = Math.floor(kernelSize / 2);
  
  // Skip the edges to avoid boundary checks
  for (let y = kernelHalfSize; y < height - kernelHalfSize; y++) {
    for (let x = kernelHalfSize; x < width - kernelHalfSize; x++) {
      const pixelIndex = (y * width + x) * 4;
      
      let r = 0, g = 0, b = 0;
      
      // Apply the kernel
      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          const kernelIndex = ky * kernelSize + kx;
          const kernelValue = kernel[kernelIndex];
          
          const offsetX = x + kx - kernelHalfSize;
          const offsetY = y + ky - kernelHalfSize;
          const offsetPixelIndex = (offsetY * width + offsetX) * 4;
          
          r += tempData[offsetPixelIndex] * kernelValue;
          g += tempData[offsetPixelIndex + 1] * kernelValue;
          b += tempData[offsetPixelIndex + 2] * kernelValue;
        }
      }
      
      data[pixelIndex] = clamp(r);
      data[pixelIndex + 1] = clamp(g);
      data[pixelIndex + 2] = clamp(b);
    }
  }
};

// Helper function to clamp values to 0-255 range
const clamp = (value: number): number => {
  return Math.max(0, Math.min(255, value));
};

export const applyCrop = async (
  cropBox: CropBoxProps,
  canvas: HTMLCanvasElement | null,
  originalFile: File,
  editorImg: HTMLImageElement,
  memorabiliaType: MemorabiliaType = 'unknown'
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
    
    // Apply specialized enhancement based on memorabilia type
    enhanceImage(tempCanvas, ctx, memorabiliaType);
    
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
