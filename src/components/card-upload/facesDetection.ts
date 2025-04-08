
import { EnhancedCropBoxProps, MemorabiliaType } from './cardDetection';
import { FaceDetectionService, FaceDetectionResult } from '@/services/faceDetectionService';

// Convert face detection results to crop boxes
export async function detectFacesInImage(
  image: HTMLImageElement,
  enhancementEnabled: boolean = true
): Promise<EnhancedCropBoxProps[]> {
  console.log('Detecting faces in image:', image.src);
  try {
    // Detect faces using the face detection service
    const faceResults = await FaceDetectionService.detectFaces(image);
    
    if (faceResults.length === 0) {
      console.log('No faces detected in the image');
      return [];
    }
    
    // Convert face detection results to crop boxes
    return faceResults.map((face, index) => {
      // Add some padding around the detected face (15%)
      const paddingX = face.width * 0.15;
      const paddingY = face.height * 0.15;
      
      return {
        id: index + 1,
        x: Math.max(0, face.x - paddingX),
        y: Math.max(0, face.y - paddingY),
        width: face.width + (paddingX * 2),
        height: face.height + (paddingY * 2),
        rotation: 0,
        color: '#FF5733',
        memorabiliaType: 'face',
        confidence: face.confidence
      };
    });
  } catch (error) {
    console.error('Error in face detection:', error);
    return [];
  }
}

// Utility for processing group photos
export const groupPhotoUtils = {
  // Get the most likely arrangement of people
  getGroupArrangement: (faces: EnhancedCropBoxProps[]): 'row' | 'column' | 'grid' => {
    if (faces.length <= 1) return 'row';
    
    // Analyze the positions of faces to determine arrangement
    const xPositions = faces.map(face => face.x + (face.width / 2));
    const yPositions = faces.map(face => face.y + (face.height / 2));
    
    // Calculate variance in horizontal and vertical positions
    const xVariance = calculateVariance(xPositions);
    const yVariance = calculateVariance(yPositions);
    
    // Compare variances to determine arrangement
    if (xVariance > yVariance * 2) {
      return 'row'; // Faces are arranged horizontally
    } else if (yVariance > xVariance * 2) {
      return 'column'; // Faces are arranged vertically
    } else {
      return 'grid'; // Faces are arranged in a grid-like pattern
    }
  },
  
  // Generate a suggested crop for the entire group
  suggestGroupCrop: (faces: EnhancedCropBoxProps[], imageWidth: number, imageHeight: number): EnhancedCropBoxProps | null => {
    if (faces.length === 0) return null;
    
    // Find the bounding box that contains all faces
    let minX = Math.min(...faces.map(face => face.x));
    let minY = Math.min(...faces.map(face => face.y));
    let maxX = Math.max(...faces.map(face => face.x + face.width));
    let maxY = Math.max(...faces.map(face => face.y + face.height));
    
    // Add padding (20%)
    const width = maxX - minX;
    const height = maxY - minY;
    const paddingX = width * 0.2;
    const paddingY = height * 0.2;
    
    minX = Math.max(0, minX - paddingX);
    minY = Math.max(0, minY - paddingY);
    maxX = Math.min(imageWidth, maxX + paddingX);
    maxY = Math.min(imageHeight, maxY + paddingY);
    
    return {
      id: 0,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      rotation: 0,
      color: '#33FF57',
      memorabiliaType: 'group',
      confidence: 1.0
    };
  }
};

// Helper function to calculate variance
function calculateVariance(values: number[]): number {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
}
