export type FilterType = 
  | 'vintage' 
  | 'blackAndWhite' 
  | 'sepia' 
  | 'teamColors'
  | 'hdr'
  | 'dramatic'
  | 'soft'
  | 'vivid';

export interface FilterOptions {
  type: FilterType;
  intensity: number; // 0 to 1
  teamColor?: string; // For team colors filter
}

export const applyFilter = (
  canvas: HTMLCanvasElement,
  options: FilterOptions
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  switch (options.type) {
    case 'vintage':
      applyVintageFilter(data, options.intensity);
      break;
    case 'blackAndWhite':
      applyBlackAndWhiteFilter(data, options.intensity);
      break;
    case 'sepia':
      applySepiaFilter(data, options.intensity);
      break;
    case 'teamColors':
      applyTeamColorsFilter(data, options.intensity, options.teamColor || '#ff0000');
      break;
    case 'hdr':
      applyHDRFilter(data, options.intensity);
      break;
    case 'dramatic':
      applyDramaticFilter(data, options.intensity);
      break;
    case 'soft':
      applySoftFilter(data, options.intensity);
      break;
    case 'vivid':
      applyVividFilter(data, options.intensity);
      break;
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const applyVintageFilter = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Vintage effect: reduce saturation, add warmth, slight blur
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const newR = Math.min(255, gray * 1.2 + 30);
    const newG = Math.min(255, gray * 1.1 + 20);
    const newB = Math.min(255, gray * 0.9);
    
    data[i] = r + (newR - r) * intensity;
    data[i + 1] = g + (newG - g) * intensity;
    data[i + 2] = b + (newB - b) * intensity;
  }
};

const applyBlackAndWhiteFilter = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    data[i] = r + (gray - r) * intensity;
    data[i + 1] = g + (gray - g) * intensity;
    data[i + 2] = b + (gray - b) * intensity;
  }
};

const applySepiaFilter = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const newR = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    const newG = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    const newB = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    
    data[i] = r + (newR - r) * intensity;
    data[i + 1] = g + (newG - g) * intensity;
    data[i + 2] = b + (newB - b) * intensity;
  }
};

const applyTeamColorsFilter = (
  data: Uint8ClampedArray, 
  intensity: number, 
  teamColor: string
): void => {
  const { r: teamR, g: teamG, b: teamB } = hexToRgb(teamColor);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to grayscale and tint with team color
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const newR = Math.min(255, gray * (teamR / 255) * 1.5);
    const newG = Math.min(255, gray * (teamG / 255) * 1.5);
    const newB = Math.min(255, gray * (teamB / 255) * 1.5);
    
    data[i] = r + (newR - r) * intensity;
    data[i + 1] = g + (newG - g) * intensity;
    data[i + 2] = b + (newB - b) * intensity;
  }
};

const applyHDRFilter = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // HDR effect: increase contrast and saturation
    const factor = 1 + intensity * 0.5;
    const newR = Math.min(255, Math.max(0, (r - 128) * factor + 128));
    const newG = Math.min(255, Math.max(0, (g - 128) * factor + 128));
    const newB = Math.min(255, Math.max(0, (b - 128) * factor + 128));
    
    data[i] = newR;
    data[i + 1] = newG;
    data[i + 2] = newB;
  }
};

const applyDramaticFilter = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Dramatic effect: high contrast, reduced saturation
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const contrast = 1.5 + intensity * 0.5;
    const newR = Math.min(255, Math.max(0, (r - 128) * contrast + 128));
    const newG = Math.min(255, Math.max(0, (g - 128) * contrast + 128));
    const newB = Math.min(255, Math.max(0, (b - 128) * contrast + 128));
    
    // Blend with grayscale for desaturation
    const blendFactor = 0.3 * intensity;
    data[i] = newR * (1 - blendFactor) + gray * blendFactor;
    data[i + 1] = newG * (1 - blendFactor) + gray * blendFactor;
    data[i + 2] = newB * (1 - blendFactor) + gray * blendFactor;
  }
};

const applySoftFilter = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Soft effect: slight blur and reduced contrast
    const softFactor = 0.8 + intensity * 0.2;
    data[i] = Math.min(255, r * softFactor + 30 * intensity);
    data[i + 1] = Math.min(255, g * softFactor + 30 * intensity);
    data[i + 2] = Math.min(255, b * softFactor + 30 * intensity);
  }
};

const applyVividFilter = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Vivid effect: increase saturation and slight contrast boost
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const saturationBoost = 1 + intensity * 0.5;
    
    const newR = Math.min(255, gray + (r - gray) * saturationBoost);
    const newG = Math.min(255, gray + (g - gray) * saturationBoost);
    const newB = Math.min(255, gray + (b - gray) * saturationBoost);
    
    data[i] = newR;
    data[i + 1] = newG;
    data[i + 2] = newB;
  }
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 0, b: 0 };
};

export const createBlurredBackground = (
  canvas: HTMLCanvasElement,
  subjectMask: ImageData,
  blurRadius = 10
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Apply blur to entire image
  ctx.filter = `blur(${blurRadius}px)`;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
  ctx.filter = 'none';
  
  // Restore sharp areas using the mask
  const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const maskData = subjectMask.data;
  const imagePixels = originalData.data;
  
  for (let i = 0; i < maskData.length; i += 4) {
    const alpha = maskData[i + 3];
    if (alpha > 128) { // Subject area
      // Keep original sharp pixels
      imagePixels[i] = maskData[i];
      imagePixels[i + 1] = maskData[i + 1];
      imagePixels[i + 2] = maskData[i + 2];
    }
  }
  
  ctx.putImageData(originalData, 0, 0);
};
