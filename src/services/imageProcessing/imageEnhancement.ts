
export interface EnhancementOptions {
  autoEnhance: boolean;
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  sharpness: number; // 0 to 100
  denoise: boolean;
  upscale: boolean;
}

export const applyImageEnhancements = (
  canvas: HTMLCanvasElement,
  options: Partial<EnhancementOptions>
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Auto-enhance if enabled
  if (options.autoEnhance) {
    autoEnhanceImage(data);
  }
  
  // Apply brightness
  if (options.brightness !== undefined && options.brightness !== 0) {
    adjustBrightness(data, options.brightness);
  }
  
  // Apply contrast
  if (options.contrast !== undefined && options.contrast !== 0) {
    adjustContrast(data, options.contrast);
  }
  
  // Apply saturation
  if (options.saturation !== undefined && options.saturation !== 0) {
    adjustSaturation(data, options.saturation);
  }
  
  // Apply sharpness
  if (options.sharpness !== undefined && options.sharpness > 0) {
    applySharpen(ctx, canvas, options.sharpness);
    return; // Sharpening replaces the image data
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const autoEnhanceImage = (data: Uint8ClampedArray): void => {
  // Calculate histogram for auto-enhancement
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    const brightness = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    histogram[brightness]++;
  }
  
  // Auto-adjust based on histogram
  const totalPixels = data.length / 4;
  const darkPixels = histogram.slice(0, 64).reduce((a, b) => a + b, 0);
  const brightPixels = histogram.slice(192, 256).reduce((a, b) => a + b, 0);
  
  if (darkPixels / totalPixels > 0.3) {
    adjustBrightness(data, 20); // Brighten dark images
  }
  if (brightPixels / totalPixels < 0.1) {
    adjustContrast(data, 15); // Increase contrast for flat images
  }
};

const adjustBrightness = (data: Uint8ClampedArray, brightness: number): void => {
  const factor = brightness * 2.55; // Convert -100/100 to -255/255
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + factor));     // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + factor)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + factor)); // B
  }
};

const adjustContrast = (data: Uint8ClampedArray, contrast: number): void => {
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
    data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
  }
};

const adjustSaturation = (data: Uint8ClampedArray, saturation: number): void => {
  const factor = (saturation + 100) / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to grayscale
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Apply saturation
    data[i] = Math.max(0, Math.min(255, gray + factor * (r - gray)));
    data[i + 1] = Math.max(0, Math.min(255, gray + factor * (g - gray)));
    data[i + 2] = Math.max(0, Math.min(255, gray + factor * (b - gray)));
  }
};

const applySharpen = (
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  sharpness: number
): void => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  
  const sharpenKernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ];
  
  const intensity = sharpness / 100;
  const newData = new Uint8ClampedArray(data.length);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) { // RGB channels only
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += data[idx] * sharpenKernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        
        const currentIdx = (y * width + x) * 4 + c;
        const original = data[currentIdx];
        newData[currentIdx] = Math.max(0, Math.min(255, 
          original + (sum - original) * intensity
        ));
      }
      
      // Copy alpha channel
      const alphaIdx = (y * width + x) * 4 + 3;
      newData[alphaIdx] = data[alphaIdx];
    }
  }
  
  // Copy edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        const idx = (y * width + x) * 4;
        newData[idx] = data[idx];
        newData[idx + 1] = data[idx + 1];
        newData[idx + 2] = data[idx + 2];
        newData[idx + 3] = data[idx + 3];
      }
    }
  }
  
  const newImageData = new ImageData(newData, width, height);
  ctx.putImageData(newImageData, 0, 0);
};

export const detectMainSubject = async (
  imageElement: HTMLImageElement
): Promise<{ x: number; y: number; width: number; height: number; confidence: number }> => {
  // Simplified subject detection using image analysis
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  ctx.drawImage(imageElement, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Find the region with highest contrast (likely the main subject)
  const blockSize = 32;
  let maxContrast = 0;
  let bestRegion = { x: 0, y: 0, width: canvas.width, height: canvas.height };
  
  for (let y = 0; y < canvas.height - blockSize; y += blockSize) {
    for (let x = 0; x < canvas.width - blockSize; x += blockSize) {
      const contrast = calculateBlockContrast(data, x, y, blockSize, canvas.width);
      if (contrast > maxContrast) {
        maxContrast = contrast;
        bestRegion = {
          x: Math.max(0, x - blockSize),
          y: Math.max(0, y - blockSize),
          width: Math.min(canvas.width - x, blockSize * 3),
          height: Math.min(canvas.height - y, blockSize * 3)
        };
      }
    }
  }
  
  return {
    ...bestRegion,
    confidence: Math.min(1, maxContrast / 100)
  };
};

const calculateBlockContrast = (
  data: Uint8ClampedArray,
  startX: number,
  startY: number,
  blockSize: number,
  width: number
): number => {
  let min = 255;
  let max = 0;
  
  for (let y = startY; y < startY + blockSize; y++) {
    for (let x = startX; x < startX + blockSize; x++) {
      const idx = (y * width + x) * 4;
      const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      min = Math.min(min, brightness);
      max = Math.max(max, brightness);
    }
  }
  
  return max - min;
};
