
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const detectCardBounds = (img: HTMLImageElement): CropArea => {
  // Start with reasonable defaults based on typical card aspect ratio (2.5:3.5)
  const cardAspectRatio = 2.5 / 3.5;
  
  // Initial sizing - start with 50% of image width
  let cardWidth = img.width * 0.5;
  let cardHeight = cardWidth / cardAspectRatio;
  
  // If calculated height is too large, constrain by height instead
  if (cardHeight > img.height * 0.8) {
    cardHeight = img.height * 0.8;
    cardWidth = cardHeight * cardAspectRatio;
  }
  
  // Center the crop box initially
  const x = (img.width - cardWidth) / 2;
  const y = (img.height - cardHeight) / 2;
  
  return {
    x: Math.max(0, x),
    y: Math.max(0, y),
    width: Math.min(cardWidth, img.width),
    height: Math.min(cardHeight, img.height)
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
  return Math.min(scaleX, scaleY, 1) * 0.9; // 90% to add padding
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
  
  // Draw the cropped portion
  ctx.drawImage(
    sourceImage,
    cropArea.x, cropArea.y, cropArea.width, cropArea.height,
    0, 0, cropArea.width, cropArea.height
  );
};
