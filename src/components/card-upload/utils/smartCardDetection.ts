
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const detectCardBounds = (img: HTMLImageElement): CropArea => {
  // Start with reasonable defaults based on typical card aspect ratio (2.5:3.5)
  const cardAspectRatio = 2.5 / 3.5;
  
  // Start with 60% of image width for better coverage
  let cardWidth = img.naturalWidth * 0.6;
  let cardHeight = cardWidth / cardAspectRatio;
  
  // If calculated height is too large, constrain by height instead
  if (cardHeight > img.naturalHeight * 0.8) {
    cardHeight = img.naturalHeight * 0.8;
    cardWidth = cardHeight * cardAspectRatio;
  }
  
  // Center the crop box initially
  const x = (img.naturalWidth - cardWidth) / 2;
  const y = (img.naturalHeight - cardHeight) / 2;
  
  return {
    x: Math.max(0, x),
    y: Math.max(0, y),
    width: Math.min(cardWidth, img.naturalWidth),
    height: Math.min(cardHeight, img.naturalHeight)
  };
};

export const calculateOptimalScale = (
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number
): number => {
  const scaleX = containerWidth / imageWidth;
  const scaleY = containerHeight / imageHeight;
  return Math.min(scaleX, scaleY, 1) * 0.85; // 85% to add padding and room for UI
};

export const applyCropToCanvas = (
  sourceImage: HTMLImageElement,
  cropArea: CropArea,
  outputCanvas: HTMLCanvasElement
): void => {
  const ctx = outputCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Set canvas size to crop dimensions
  outputCanvas.width = cropArea.width;
  outputCanvas.height = cropArea.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, cropArea.width, cropArea.height);
  
  // Draw the cropped portion using natural image dimensions
  ctx.drawImage(
    sourceImage,
    cropArea.x, cropArea.y, cropArea.width, cropArea.height,
    0, 0, cropArea.width, cropArea.height
  );
};
