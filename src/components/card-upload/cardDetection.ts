// Export the MemorabiliaType at the top for better clarity
export type MemorabiliaType = 'card' | 'ticket' | 'program' | 'autograph' | 'face' | 'unknown';

// Import the EnhancedCropBoxProps
import { EnhancedCropBoxProps } from './CropBox';

// Base detection function
export const detectCardsInImage = (
  img: HTMLImageElement, 
  isStandardRatio: boolean,
  canvas: HTMLCanvasElement | null,
  detectFaces = false,
  detectMemorabilia = true
): EnhancedCropBoxProps[] => {
  const detections: EnhancedCropBoxProps[] = [];
  const imgWidth = img.width;
  const imgHeight = img.height;

  // If the image ratio is already close to a standard card ratio, add a single detection
  if (isStandardRatio) {
    detections.push({
      id: 1,
      x: imgWidth * 0.1,
      y: imgHeight * 0.1,
      width: imgWidth * 0.8,
      height: imgHeight * 0.8,
      rotation: 0,
      color: '#00FF00',
      memorabiliaType: 'card',
      confidence: 0.95
    });
  } else {
    // Perform more sophisticated detection based on image content
    if (detectMemorabilia) {
      // Detect card
      const cardDetections = detectCards(img);
      detections.push(...cardDetections);
      
      // Detect tickets if no cards found
      if (cardDetections.length === 0) {
        const ticketDetections = detectTickets(img);
        detections.push(...ticketDetections);
        
        // Detect programs if no tickets found
        if (ticketDetections.length === 0) {
          const programDetections = detectPrograms(img);
          detections.push(...programDetections);
          
          // Detect autographs if no programs found
          if (programDetections.length === 0) {
            const autographDetections = detectAutographs(img);
            detections.push(...autographDetections);
          }
        }
      }
    }
    
    // Detect faces if requested
    if (detectFaces) {
      const faceDetections = detectFaces ? detectFacesInImage(img) : [];
      detections.push(...faceDetections);
    }
    
    // If nothing was detected, create a default detection
    if (detections.length === 0) {
      detections.push({
        id: detections.length + 1,
        x: imgWidth * 0.25,
        y: imgHeight * 0.25,
        width: imgWidth * 0.5,
        height: imgWidth * 0.7,  // 2.5:3.5 ratio
        rotation: 0,
        color: '#FFFF00',
        memorabiliaType: 'unknown',
        confidence: 0.5
      });
    }
  }

  return detections;
};

// Detect baseball or trading cards in the image
const detectCards = (img: HTMLImageElement): EnhancedCropBoxProps[] => {
  const detections: EnhancedCropBoxProps[] = [];
  const imgWidth = img.width;
  const imgHeight = img.height;
  
  // Simulate card detection algorithm
  // Cards often have rectangular shapes with specific aspect ratios
  const cardRatio = 2.5 / 3.5; // Standard trading card ratio
  
  // For the demo, we'll use a simple heuristic based on image dimensions
  if (imgWidth / imgHeight > 0.5 && imgWidth / imgHeight < 0.9) {
    // This image has dimensions that could contain a card
    const cardWidth = imgWidth * 0.85;
    const cardHeight = cardWidth / cardRatio;
    
    detections.push({
      id: 1,
      x: (imgWidth - cardWidth) / 2,
      y: (imgHeight - cardHeight) / 2,
      width: cardWidth,
      height: cardHeight,
      rotation: 0,
      color: '#00FF00',
      memorabiliaType: 'card',
      confidence: 0.85
    });
  } else if (imgWidth > imgHeight) {
    // Landscape image might have a card that's not taking the full frame
    const cardHeight = imgHeight * 0.7;
    const cardWidth = cardHeight * cardRatio;
    
    detections.push({
      id: 1,
      x: (imgWidth - cardWidth) / 2,
      y: (imgHeight - cardHeight) / 2,
      width: cardWidth,
      height: cardHeight,
      rotation: 0,
      color: '#00FF00',
      memorabiliaType: 'card',
      confidence: 0.7
    });
  }
  
  return detections;
};

const detectTickets = (img: HTMLImageElement): EnhancedCropBoxProps[] => {
  const detections: EnhancedCropBoxProps[] = [];
  const imgWidth = img.width;
  const imgHeight = img.height;
  
  // Ticket stubs often have a more elongated rectangular shape
  const ticketRatio = 0.4; // width/height
  
  // For the demo, detect tickets in images with appropriate dimensions
  if (imgWidth / imgHeight < 0.5) {
    // This image has dimensions that could contain a ticket stub
    const ticketWidth = imgWidth * 0.85;
    const ticketHeight = ticketWidth / ticketRatio;
    
    detections.push({
      id: 1,
      x: (imgWidth - ticketWidth) / 2,
      y: (imgHeight - ticketHeight) / 2,
      width: ticketWidth,
      height: ticketHeight,
      rotation: 0,
      color: '#0000FF',
      memorabiliaType: 'ticket',
      confidence: 0.75
    });
  }
  
  return detections;
};

const detectPrograms = (img: HTMLImageElement): EnhancedCropBoxProps[] => {
  const detections: EnhancedCropBoxProps[] = [];
  const imgWidth = img.width;
  const imgHeight = img.height;
  
  // Programs often have a book-like shape, closer to square
  const programRatio = 0.8; // width/height
  
  // For the demo, detect programs in images with appropriate dimensions
  if (imgWidth / imgHeight > 0.7 && imgWidth / imgHeight < 0.9) {
    // This image has dimensions that could contain a program
    const programWidth = imgWidth * 0.9;
    const programHeight = programWidth / programRatio;
    
    detections.push({
      id: 1,
      x: (imgWidth - programWidth) / 2,
      y: (imgHeight - programHeight) / 2,
      width: programWidth,
      height: programHeight,
      rotation: 0,
      color: '#FF00FF',
      memorabiliaType: 'program',
      confidence: 0.65
    });
  }
  
  return detections;
};

const detectAutographs = (img: HTMLImageElement): EnhancedCropBoxProps[] => {
  const detections: EnhancedCropBoxProps[] = [];
  const imgWidth = img.width;
  const imgHeight = img.height;
  
  // Autographs can be on various items, we'll look for the signature pattern
  // For the demo, we'll simulate autograph detection with a simple heuristic
  const autographSize = Math.min(imgWidth, imgHeight) * 0.5;
  
  detections.push({
    id: 1,
    x: (imgWidth - autographSize) / 2,
    y: (imgHeight - autographSize) / 2,
    width: autographSize,
    height: autographSize * 0.6,
    rotation: -15, // Many signatures are slanted
    color: '#FF0000',
    memorabiliaType: 'autograph',
    confidence: 0.55
  });
  
  return detections;
};

const detectFacesInImage = (img: HTMLImageElement): EnhancedCropBoxProps[] => {
  const detections: EnhancedCropBoxProps[] = [];
  const imgWidth = img.width;
  const imgHeight = img.height;
  
  // Simulate face detection with sample coordinates
  // In a real implementation, this would use a face detection ML model
  
  // For demonstration, place 2-3 faces in a group photo
  if (imgWidth > imgHeight) {
    // Landscape orientation - likely a group photo
    const faceSize = imgHeight * 0.3;
    
    // First face
    detections.push({
      id: 1,
      x: imgWidth * 0.25 - faceSize / 2,
      y: imgHeight * 0.5 - faceSize / 2,
      width: faceSize,
      height: faceSize,
      rotation: 0,
      color: '#FFAA00',
      memorabiliaType: 'face',
      confidence: 0.85
    });
    
    // Second face
    detections.push({
      id: 2,
      x: imgWidth * 0.5 - faceSize / 2,
      y: imgHeight * 0.5 - faceSize / 2,
      width: faceSize,
      height: faceSize,
      rotation: 0,
      color: '#FFAA00',
      memorabiliaType: 'face',
      confidence: 0.9
    });
    
    // Third face
    detections.push({
      id: 3,
      x: imgWidth * 0.75 - faceSize / 2,
      y: imgHeight * 0.5 - faceSize / 2,
      width: faceSize,
      height: faceSize,
      rotation: 0,
      color: '#FFAA00',
      memorabiliaType: 'face',
      confidence: 0.8
    });
  } else {
    // Portrait orientation - likely a single person
    const faceSize = imgWidth * 0.5;
    
    detections.push({
      id: 1,
      x: imgWidth * 0.5 - faceSize / 2,
      y: imgHeight * 0.3 - faceSize / 2,
      width: faceSize,
      height: faceSize,
      rotation: 0,
      color: '#FFAA00',
      memorabiliaType: 'face',
      confidence: 0.95
    });
  }
  
  return detections;
};

// Apply crop and enhancement based on detection
export const applyCrop = async (
  cropBox: EnhancedCropBoxProps,
  canvas: HTMLCanvasElement | null,
  file: File,
  image: HTMLImageElement,
  memorabiliaType?: MemorabiliaType
): Promise<{ file: File, url: string } | null> => {
  try {
    if (!canvas) {
      console.error("Canvas is null");
      return null;
    }
    
    // Calculate dimensions
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get canvas context");
      return null;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions to match the crop
    canvas.width = cropBox.width;
    canvas.height = cropBox.height;
    
    // Draw the cropped region
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((cropBox.rotation || 0) * Math.PI / 180);
    ctx.drawImage(
      image,
      -image.width / 2 + cropBox.x + cropBox.width / 2,
      -image.height / 2 + cropBox.y + cropBox.height / 2,
      image.width,
      image.height,
      -cropBox.width / 2,
      -cropBox.height / 2,
      cropBox.width,
      cropBox.height
    );
    ctx.restore();
    
    // Apply enhancement based on memorabilia type if specified
    if (memorabiliaType) {
      applyEnhancement(ctx, canvas.width, canvas.height, memorabiliaType);
    }
    
    // Convert to blob
    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
    });
    
    if (!blob) {
      console.error("Failed to create blob from canvas");
      return null;
    }
    
    // Create a new file with a meaningful name
    const fileName = `${memorabiliaType || 'cropped'}_${Date.now()}.jpg`;
    const croppedFile = new File([blob], fileName, { type: 'image/jpeg' });
    
    // Create object URL for preview
    const croppedUrl = URL.createObjectURL(blob);
    
    return {
      file: croppedFile,
      url: croppedUrl
    };
  } catch (error) {
    console.error("Error in applyCrop:", error);
    return null;
  }
};

const applyEnhancement = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  type: MemorabiliaType
) => {
  // Get image data to process
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  switch (type) {
    case 'card':
      // Enhance trading card colors and sharpness
      for (let i = 0; i < data.length; i += 4) {
        // Boost saturation slightly
        data[i] = Math.min(255, data[i] * 1.1);     // Red
        data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Green
        data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
      }
      break;
      
    case 'ticket':
      // Enhance ticket contrast and text legibility
      for (let i = 0; i < data.length; i += 4) {
        // Boost contrast
        data[i] = data[i] < 128 ? data[i] * 0.8 : Math.min(255, data[i] * 1.2);
        data[i + 1] = data[i + 1] < 128 ? data[i + 1] * 0.8 : Math.min(255, data[i + 1] * 1.2);
        data[i + 2] = data[i + 2] < 128 ? data[i + 2] * 0.8 : Math.min(255, data[i + 2] * 1.2);
      }
      break;
      
    case 'program':
      // Enhance program colors and reduce fading
      for (let i = 0; i < data.length; i += 4) {
        // Reduce yellowing (common in old documents)
        if (data[i] > data[i + 2] * 1.3) {
          data[i] = Math.max(0, data[i] * 0.9);
        }
        // Boost overall contrast
        data[i] = data[i] < 200 ? data[i] * 0.9 : Math.min(255, data[i] * 1.1);
        data[i + 1] = data[i + 1] < 200 ? data[i + 1] * 0.9 : Math.min(255, data[i + 1] * 1.1);
        data[i + 2] = data[i + 2] < 200 ? data[i + 2] * 0.9 : Math.min(255, data[i + 2] * 1.1);
      }
      break;
      
    case 'autograph':
      // Enhance autograph visibility
      for (let i = 0; i < data.length; i += 4) {
        // Increase contrast for dark pen marks
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (avg < 100) { // Darken dark areas (signature)
          data[i] *= 0.7;
          data[i + 1] *= 0.7;
          data[i + 2] *= 0.7;
        } else if (avg > 200) { // Brighten light areas (paper)
          data[i] = Math.min(255, data[i] * 1.1);
          data[i + 1] = Math.min(255, data[i + 1] * 1.1);
          data[i + 2] = Math.min(255, data[i + 2] * 1.1);
        }
      }
      break;
      
    case 'face':
      // Enhance portrait photos
      for (let i = 0; i < data.length; i += 4) {
        // Slight warming filter (good for skin tones)
        data[i] = Math.min(255, data[i] * 1.05);     // Red
        data[i + 1] = Math.min(255, data[i + 1] * 1.02); // Green
        data[i + 2] = Math.min(255, data[i + 2] * 0.98); // Blue
      }
      break;
      
    default:
      // Generic enhancement - slightly boost contrast
      for (let i = 0; i < data.length; i += 4) {
        // Boost contrast slightly
        data[i] = data[i] < 128 ? data[i] * 0.95 : Math.min(255, data[i] * 1.05);
        data[i + 1] = data[i + 1] < 128 ? data[i + 1] * 0.95 : Math.min(255, data[i + 1] * 1.05);
        data[i + 2] = data[i + 2] < 128 ? data[i + 2] * 0.95 : Math.min(255, data[i + 2] * 1.05);
      }
  }
  
  // Apply the modified image data back to the canvas
  ctx.putImageData(imageData, 0, 0);
};
