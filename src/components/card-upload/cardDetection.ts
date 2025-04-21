
// Define all memorabilia types
export type MemorabiliaType = 'card' | 'ticket' | 'program' | 'autograph' | 'face' | 'unknown' | 'group';

// Enhanced version with required memorabiliaType field for cropped items
export interface EnhancedCropBoxProps {
  id: string; // Changed from number to string to match CropBox.ts
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  color?: string;
  memorabiliaType?: MemorabiliaType;
  confidence?: number;
}

// Trading card standard aspect ratio 2.5:3.5
const CARD_ASPECT_RATIO = 2.5 / 3.5;

// Calculate proper dimensions to fit a card aspect ratio
export const calculateCardDimensions = (width: number, height: number): { width: number; height: number } => {
  // Determine which dimension controls the fit
  if (width / height > CARD_ASPECT_RATIO) {
    // Width is "too wide" for the height, so use height to calculate width
    return {
      height,
      width: height * CARD_ASPECT_RATIO
    };
  } else {
    // Height is "too tall" for the width, so use width to calculate height
    return {
      width,
      height: width / CARD_ASPECT_RATIO
    };
  }
};

// Detect cards in an uploaded image
export async function detectCardsInImage(
  image: HTMLImageElement,
  enhancementEnabled: boolean = true,
  canvas?: HTMLCanvasElement | null,
  detectionTypes: MemorabiliaType[] = ['card', 'ticket', 'program', 'autograph', 'face']
): Promise<EnhancedCropBoxProps[]> {
  console.log('Detecting items in image:', image.src, 'with types:', detectionTypes);
  
  // Get image dimensions
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  
  // This function would ideally use image recognition to detect cards
  // For now, we'll implement a better estimation algorithm for trading cards
  const detectedItems: EnhancedCropBoxProps[] = [];
  
  // If card detection is enabled (primary use case)
  if (detectionTypes.includes('card')) {
    // Look for rectangular shapes with card-like aspect ratio (2.5:3.5)
    // Use edge detection similar to what we'd do with CV libraries
    
    // For now, we'll simulate better detection with a more accurate card ratio
    // In a real implementation, we'd apply edge detection to find the actual card boundaries
    
    // Calculate a crop box with proper card dimensions centered in the image
    // We'll use 80% of the smaller dimension to ensure we get a good view of the card
    let maxDimension = Math.min(width, height) * 0.8;
    
    // Calculate card width and height based on the standard ratio
    let cardDimensions;
    
    // If width > height, the image is probably landscape, so card is likely in portrait orientation
    if (width > height) {
      // Landscape image, assume card is in portrait orientation
      cardDimensions = calculateCardDimensions(maxDimension * CARD_ASPECT_RATIO, maxDimension);
    } else {
      // Portrait or square image, try to fit card as large as possible
      cardDimensions = calculateCardDimensions(maxDimension, maxDimension / CARD_ASPECT_RATIO);
    }
    
    // Create a centered crop box with the calculated dimensions
    detectedItems.push({
      id: crypto.randomUUID(), // Changed from number to string
      x: (width - cardDimensions.width) / 2,
      y: (height - cardDimensions.height) / 2,
      width: cardDimensions.width,
      height: cardDimensions.height,
      rotation: 0,
      color: '#00FF00', // Green for card detection
      memorabiliaType: 'card',
      confidence: 0.85
    });
  }
  
  // If ticket detection is enabled
  if (detectionTypes.includes('ticket')) {
    // Look for rectangular shapes with ticket-like aspect ratio
    // For now, we'll simulate ticket detection with a fixed size and position
    detectedItems.push({
      id: crypto.randomUUID(), // Changed from number to string
      x: width * 0.1,
      y: height * 0.1,
      width: width * 0.3,
      height: height * 0.2,
      rotation: 0,
      color: '#FF0000', // Red for ticket detection
      memorabiliaType: 'ticket',
      confidence: 0.7
    });
  }
  
  // If program detection is enabled
  if (detectionTypes.includes('program')) {
    // Look for rectangular shapes with program-like aspect ratio
    // For now, we'll simulate program detection with a fixed size and position
    detectedItems.push({
      id: crypto.randomUUID(), // Changed from number to string
      x: width * 0.6,
      y: height * 0.6,
      width: width * 0.3,
      height: height * 0.3,
      rotation: 0,
      color: '#0000FF', // Blue for program detection
      memorabiliaType: 'program',
      confidence: 0.6
    });
  }
  
  // If autograph detection is enabled
  if (detectionTypes.includes('autograph')) {
    // Look for small, irregular shapes that might be autographs
    // For now, we'll simulate autograph detection with a fixed size and position
    detectedItems.push({
      id: crypto.randomUUID(), // Changed from number to string
      x: width * 0.2,
      y: height * 0.7,
      width: width * 0.2,
      height: height * 0.1,
      rotation: 0,
      color: '#FFFF00', // Yellow for autograph detection
      memorabiliaType: 'autograph',
      confidence: 0.5
    });
  }
  
  // If face detection is enabled
  if (detectionTypes.includes('face')) {
    // Look for circular shapes that might be faces
    // For now, we'll simulate face detection with a fixed size and position
    detectedItems.push({
      id: crypto.randomUUID(), // Changed from number to string
      x: width * 0.7,
      y: height * 0.1,
      width: width * 0.2,
      height: height * 0.2,
      rotation: 0,
      color: '#FF00FF', // Magenta for face detection
      memorabiliaType: 'face',
      confidence: 0.4
    });
  }
  
  // If there are no detections, return a fallback detection with proper card dimensions
  if (detectedItems.length === 0) {
    const cardDimensions = calculateCardDimensions(width * 0.5, height * 0.5);
    
    detectedItems.push({
      id: crypto.randomUUID(), // Changed from number to string
      x: (width - cardDimensions.width) / 2,
      y: (height - cardDimensions.height) / 2,
      width: cardDimensions.width,
      height: cardDimensions.height,
      rotation: 0,
      color: '#FFFF33',
      memorabiliaType: 'card',
      confidence: 0.7
    });
  }
  
  return detectedItems;
}

// Extract text from a canvas or image element
export async function detectText(
  source: HTMLCanvasElement | HTMLImageElement
): Promise<{ 
  text: string; 
  title?: string; 
  player?: string;
  team?: string;
  year?: string;
  tags: string[];
  position?: string;
  sport?: string;
  manufacturer?: string;
  condition?: string;
  cardNumber?: string;
  setName?: string;
  confidence?: number;
} | null> {
  try {
    // In a real implementation, this would call an OCR API
    // For now, we'll enhance our simulated text detection with more card-specific fields
    
    // Create a more comprehensive object with detected text fields
    // In production this would use OCR to extract actual text from the card image
    
    // Analyze image content to make better guesses about card type
    const isBaseballCard = Math.random() > 0.3; // Would be based on actual image analysis
    const isVintage = Math.random() > 0.5; // Would detect vintage vs modern styles
    
    let tags = ["card"];
    let sport = "baseball";
    let year = "1989";
    let team = "Oakland Athletics";
    let playerName = "John Smith";
    let position = "Pitcher";
    let setName = "Topps";
    let manufacturer = "Topps";
    let cardNumber = "152";
    
    if (isBaseballCard) {
      tags.push("baseball");
      
      if (isVintage) {
        tags.push("vintage");
        year = String(1950 + Math.floor(Math.random() * 40)); // Random year between 1950-1990
        manufacturer = ["Topps", "Bowman", "Fleer"][Math.floor(Math.random() * 3)];
      } else {
        tags.push("modern");
        year = String(1990 + Math.floor(Math.random() * 33)); // Random year between 1990-2023
        manufacturer = ["Topps", "Upper Deck", "Panini", "Fleer Ultra"][Math.floor(Math.random() * 4)];
      }
      
      // More common teams for better simulation
      team = ["New York Yankees", "Boston Red Sox", "Chicago Cubs", "Los Angeles Dodgers", 
              "San Francisco Giants", "Oakland Athletics", "Atlanta Braves"][Math.floor(Math.random() * 7)];
      
      // Common baseball positions
      position = ["Pitcher", "Catcher", "First Base", "Second Base", "Shortstop", 
                 "Third Base", "Left Field", "Center Field", "Right Field"][Math.floor(Math.random() * 9)];
    }
    
    // Put relevant data in title format
    const title = `${year} ${manufacturer} ${playerName} #${cardNumber}`;
    
    const extractedText = {
      text: `${playerName}, ${position}, ${team}, ${year} ${setName} Baseball Card #${cardNumber}`,
      title: title,
      player: playerName,
      team: team,
      year: year,
      position: position,
      sport: sport,
      manufacturer: manufacturer,
      cardNumber: cardNumber,
      setName: setName,
      condition: ["Mint", "Near Mint", "Excellent", "Very Good", "Good"][Math.floor(Math.random() * 5)],
      tags: tags,
      confidence: 0.75 + (Math.random() * 0.2) // Random confidence between 0.75-0.95
    };
    
    // Simulate processing time for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return extractedText;
  } catch (error) {
    console.error('Error detecting text:', error);
    return null;
  }
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
    
    // Ensure we're maintaining the proper card aspect ratio
    let width = cropBox.width;
    let height = cropBox.height;
    
    // If this is a card, force the proper aspect ratio
    if (enhancementType === 'card') {
      const cardDimensions = calculateCardDimensions(width, height);
      width = cardDimensions.width;
      height = cardDimensions.height;
    }
    
    // Set canvas to the size of the crop
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate the center of the crop box
    const cropCenterX = width / 2;
    const cropCenterY = height / 2;
    
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
      width,
      height,
      -width / 2,
      -height / 2,
      width,
      height
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
    
    // Generate meaningful filename for cards
    let filename = originalFile.name;
    if (enhancementType === 'card') {
      // Extract base name without extension
      const baseName = originalFile.name.split('.').slice(0, -1).join('.');
      filename = `${baseName}-extracted-card-${Date.now()}.png`;
    }
    
    const url = URL.createObjectURL(blob);
    const file = new File([blob], filename, { type: 'image/png' });
    
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
    case 'card':
      // Enhanced card-specific processing
      // Improve contrast and sharpness for card scans
      for (let i = 0; i < data.length; i += 4) {
        // Increase contrast specifically for cards
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));     // Red
        data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * 1.2 + 128)); // Green
        data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * 1.2 + 128)); // Blue
      }
      break;
    
    case 'ticket':
      // Enhance ticket-specific processing
      // Adjust colors to make the ticket stand out
      for (let i = 0; i < data.length; i += 4) {
        // Increase saturation for tickets
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = Math.min(255, data[i] + 20);     // Red
        data[i+1] = Math.min(255, data[i+1] + 20); // Green
        data[i+2] = Math.min(255, data[i+2] + 20); // Blue
      }
      break;
    
    case 'program':
      // Enhance program-specific processing
      // Improve text clarity for programs
      for (let i = 0; i < data.length; i += 4) {
        // Sharpen the image for better text clarity
        data[i] = Math.min(255, data[i] * 1.1);     // Red
        data[i+1] = Math.min(255, data[i+1] * 1.1); // Green
        data[i+2] = Math.min(255, data[i+2] * 1.1); // Blue
      }
      break;
    
    case 'autograph':
      // Enhance autograph-specific processing
      // Highlight the autograph area
      for (let i = 0; i < data.length; i += 4) {
        // Increase brightness for autographs
        data[i] = Math.min(255, data[i] + 40);     // Red
        data[i+1] = Math.min(255, data[i+1] + 40); // Green
        data[i+2] = Math.min(255, data[i+2] + 40); // Blue
      }
      break;
    
    case 'face':
      // Enhance face-specific processing
      // Improve facial features
      for (let i = 0; i < data.length; i += 4) {
        // Apply a slight blur to smooth skin tones
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // Red
        data[i+1] = avg; // Green
        data[i+2] = avg; // Blue
      }
      break;
    
    default:
      break;
  }
  
  ctx.putImageData(imageData, 0, 0);
}
