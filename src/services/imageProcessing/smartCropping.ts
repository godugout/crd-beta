
export interface SubjectDetectionResult {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  type: 'face' | 'person' | 'object';
}

export interface CropSuggestion {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
  rule: 'thirds' | 'center' | 'subject-focused';
  confidence: number;
}

export const detectMainSubject = async (
  imageElement: HTMLImageElement
): Promise<SubjectDetectionResult[]> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  ctx.drawImage(imageElement, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Simple edge detection for subject identification
  const subjects: SubjectDetectionResult[] = [];
  
  // Face detection using basic contrast analysis
  const faceRegion = detectFaceRegion(imageData);
  if (faceRegion) {
    subjects.push({
      ...faceRegion,
      type: 'face',
      confidence: faceRegion.confidence
    });
  }
  
  // General subject detection
  const mainSubject = detectLargestSubject(imageData);
  if (mainSubject && mainSubject.confidence > 0.3) {
    subjects.push({
      ...mainSubject,
      type: 'object',
      confidence: mainSubject.confidence
    });
  }

  return subjects;
};

export const generateCropSuggestions = async (
  imageElement: HTMLImageElement,
  targetAspectRatio = 2.5 / 3.5
): Promise<CropSuggestion[]> => {
  const subjects = await detectMainSubject(imageElement);
  const suggestions: CropSuggestion[] = [];
  
  const imgWidth = imageElement.naturalWidth;
  const imgHeight = imageElement.naturalHeight;

  // Rule of thirds crop
  const thirdWidth = imgWidth / 3;
  const thirdHeight = imgHeight / 3;
  
  suggestions.push({
    x: thirdWidth,
    y: thirdHeight,
    width: thirdWidth,
    height: thirdWidth / targetAspectRatio,
    aspectRatio: targetAspectRatio,
    rule: 'thirds',
    confidence: 0.7
  });

  // Subject-focused crops
  subjects.forEach(subject => {
    if (subject.confidence > 0.5) {
      const cropWidth = Math.min(imgWidth, subject.width * 1.5);
      const cropHeight = cropWidth / targetAspectRatio;
      
      suggestions.push({
        x: Math.max(0, subject.x - (cropWidth - subject.width) / 2),
        y: Math.max(0, subject.y - (cropHeight - subject.height) / 2),
        width: cropWidth,
        height: cropHeight,
        aspectRatio: targetAspectRatio,
        rule: 'subject-focused',
        confidence: subject.confidence
      });
    }
  });

  // Center crop
  const centerCropSize = Math.min(imgWidth, imgHeight);
  const centerCropHeight = centerCropSize / targetAspectRatio;
  
  suggestions.push({
    x: (imgWidth - centerCropSize) / 2,
    y: (imgHeight - centerCropHeight) / 2,
    width: centerCropSize,
    height: centerCropHeight,
    aspectRatio: targetAspectRatio,
    rule: 'center',
    confidence: 0.5
  });

  return suggestions.sort((a, b) => b.confidence - a.confidence);
};

const detectFaceRegion = (imageData: ImageData): SubjectDetectionResult | null => {
  // Simple face detection using skin tone and contrast
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  let maxFaceScore = 0;
  let bestFaceRegion: SubjectDetectionResult | null = null;
  
  const blockSize = 32;
  
  for (let y = 0; y < height - blockSize; y += blockSize) {
    for (let x = 0; x < width - blockSize; x += blockSize) {
      const score = calculateFaceScore(data, x, y, blockSize, width);
      
      if (score > maxFaceScore && score > 0.4) {
        maxFaceScore = score;
        bestFaceRegion = {
          x: x,
          y: y,
          width: blockSize * 2,
          height: blockSize * 2,
          confidence: score,
          type: 'face'
        };
      }
    }
  }
  
  return bestFaceRegion;
};

const detectLargestSubject = (imageData: ImageData): SubjectDetectionResult | null => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  let maxContrast = 0;
  let bestRegion: SubjectDetectionResult | null = null;
  
  const blockSize = 48;
  
  for (let y = 0; y < height - blockSize; y += blockSize) {
    for (let x = 0; x < width - blockSize; x += blockSize) {
      const contrast = calculateBlockContrast(data, x, y, blockSize, width);
      
      if (contrast > maxContrast) {
        maxContrast = contrast;
        bestRegion = {
          x: Math.max(0, x - blockSize / 2),
          y: Math.max(0, y - blockSize / 2),
          width: blockSize * 2,
          height: blockSize * 2,
          confidence: Math.min(1, contrast / 80),
          type: 'object'
        };
      }
    }
  }
  
  return bestRegion;
};

const calculateFaceScore = (
  data: Uint8ClampedArray,
  startX: number,
  startY: number,
  blockSize: number,
  width: number
): number => {
  let skinPixels = 0;
  let totalPixels = 0;
  
  for (let y = startY; y < startY + blockSize; y++) {
    for (let x = startX; x < startX + blockSize; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // Simple skin tone detection
      if (isSkinTone(r, g, b)) {
        skinPixels++;
      }
      totalPixels++;
    }
  }
  
  return skinPixels / totalPixels;
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

const isSkinTone = (r: number, g: number, b: number): boolean => {
  // Basic skin tone detection
  return (
    r > 95 && g > 40 && b > 20 &&
    r > g && r > b &&
    Math.abs(r - g) > 15 &&
    r - b > 15
  );
};
