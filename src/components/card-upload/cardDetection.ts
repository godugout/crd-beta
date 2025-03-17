
import { CropBoxProps } from './CropBox';

export const detectCardsInImage = (
  img: HTMLImageElement, 
  isStandardRatio: boolean,
  canvas: HTMLCanvasElement | null
): CropBoxProps[] => {
  if (!canvas) return [];
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  
  // Set canvas dimensions to match the image
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Draw image on canvas
  ctx.drawImage(img, 0, 0, img.width, img.height);
  
  // If it's already a standard ratio, just use the whole image
  if (isStandardRatio) {
    const singleCard: CropBoxProps = {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
      rotation: 0
    };
    
    return [singleCard];
  }
  
  // Simple heuristic to detect multiple cards
  const possibleCards: CropBoxProps[] = [];
  
  // Check if width is roughly twice the expected width for a single card
  const isWideFormat = img.width > img.height * 1.8;
  
  if (isWideFormat) {
    // Likely contains two cards side by side
    const cardWidth = img.width / 2;
    const cardHeight = cardWidth * (3.5 / 2.5);
    
    // Left card
    possibleCards.push({
      x: 0,
      y: (img.height - cardHeight) / 2,
      width: cardWidth,
      height: cardHeight,
      rotation: 0
    });
    
    // Right card
    possibleCards.push({
      x: img.width / 2,
      y: (img.height - cardHeight) / 2,
      width: cardWidth,
      height: cardHeight,
      rotation: 0
    });
  } else {
    // Default to a single card with proper ratio
    const cardWidth = img.width * 0.8;
    const cardHeight = cardWidth * (3.5 / 2.5);
    
    possibleCards.push({
      x: (img.width - cardWidth) / 2,
      y: (img.height - cardHeight) / 2,
      width: cardWidth,
      height: cardHeight,
      rotation: 0
    });
  }
  
  return possibleCards;
};

// Apply crop to an image
export const applyCrop = async (
  box: CropBoxProps,
  canvas: HTMLCanvasElement | null,
  currentFile: File | null,
  editorImg: HTMLImageElement | null
): Promise<{file: File, url: string} | null> => {
  if (!canvas || !currentFile || !editorImg) {
    console.error("Missing required parameters for crop:", { canvas: !!canvas, file: !!currentFile, img: !!editorImg });
    return null;
  }
  
  try {
    // Create a temporary canvas for the cropped image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      console.error("Failed to get 2D context for temp canvas");
      return null;
    }
    
    // Set dimensions for the cropped image
    tempCanvas.width = box.width;
    tempCanvas.height = box.height;
    
    // Calculate the source coordinates in the original image
    // We need to account for the scaling and positioning in the canvas
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const scale = Math.min(
      canvasWidth / editorImg.naturalWidth,
      canvasHeight / editorImg.naturalHeight
    );
    
    const scaledWidth = editorImg.naturalWidth * scale;
    const scaledHeight = editorImg.naturalHeight * scale;
    
    const offsetX = (canvasWidth - scaledWidth) / 2;
    const offsetY = (canvasHeight - scaledHeight) / 2;
    
    // Calculate source coordinates (in the original image)
    const sourceX = (box.x - offsetX) / scale;
    const sourceY = (box.y - offsetY) / scale;
    const sourceWidth = box.width / scale;
    const sourceHeight = box.height / scale;
    
    console.log("Crop dimensions:", {
      source: { x: sourceX, y: sourceY, width: sourceWidth, height: sourceHeight },
      destination: { width: tempCanvas.width, height: tempCanvas.height },
      original: { width: editorImg.naturalWidth, height: editorImg.naturalHeight },
      scale,
      offset: { x: offsetX, y: offsetY }
    });
    
    // Save context state
    tempCtx.save();
    
    // Apply rotation if needed
    if (box.rotation !== 0) {
      tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
      tempCtx.rotate(box.rotation * Math.PI / 180);
      tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
    }
    
    // Draw the cropped portion
    tempCtx.drawImage(
      editorImg,
      Math.max(0, sourceX), 
      Math.max(0, sourceY), 
      Math.min(editorImg.naturalWidth, sourceWidth), 
      Math.min(editorImg.naturalHeight, sourceHeight),
      0, 0, tempCanvas.width, tempCanvas.height
    );
    
    // Restore context state
    tempCtx.restore();
    
    // Create a blob from the temp canvas
    return new Promise<{file: File, url: string}>((resolve, reject) => {
      tempCanvas.toBlob((blob) => {
        if (blob && currentFile) {
          // Create a new file with the cropped image
          const croppedFile = new File(
            [blob], 
            currentFile.name, 
            { type: currentFile.type }
          );
          
          // Return the cropped file and URL
          resolve({
            file: croppedFile,
            url: URL.createObjectURL(blob)
          });
        } else {
          console.error("Failed to create blob from canvas or file is missing");
          reject(new Error("Failed to create blob from canvas"));
        }
      }, currentFile.type);
    });
  } catch (error) {
    console.error("Error in applyCrop:", error);
    return null;
  }
};
