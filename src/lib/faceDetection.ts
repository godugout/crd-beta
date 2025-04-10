
import * as faceapi from 'face-api.js';

/**
 * Interface for detected face information
 */
export interface DetectedFace {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  landmarks: {
    positions: { x: number, y: number }[];
  };
  expressions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
}

/**
 * Loads face detection models from specified URL
 * @param modelUrl URL to the face-api.js models directory
 * @returns Promise that resolves when models are loaded
 * @throws Error if models fail to load
 */
export const loadFaceDetectionModels = async (modelUrl: string): Promise<void> => {
  try {
    console.log(`Loading face detection models from: ${modelUrl}`);
    
    // Load the face detection models required for face-api.js
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
      faceapi.nets.faceExpressionNet.loadFromUri(modelUrl)
    ]);
    
    console.log('Face detection models loaded successfully');
  } catch (error) {
    console.error('Failed to load face detection models:', error);
    throw new Error(`Failed to load face detection models: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Creates an HTMLImageElement from a File object
 * @param file Image file to process
 * @returns Promise that resolves to an HTMLImageElement
 */
export const createImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(new Error('Failed to load image: ' + error));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Detects faces in an image file
 * @param imageFile File object containing the image to process
 * @returns Promise that resolves to an array of DetectedFace objects
 */
export const detectFaces = async (imageFile: File): Promise<DetectedFace[]> => {
  try {
    // Create an image element from the file
    const img = await createImageFromFile(imageFile);
    
    // Detect all faces in the image with TinyFaceDetector
    const detections = await faceapi
      .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(img.src);
    
    // Map the detected faces to our DetectedFace interface
    return detections.map(detection => {
      const box = detection.detection.box;
      
      return {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        confidence: detection.detection.score,
        landmarks: {
          positions: detection.landmarks.positions.map(p => ({ x: p.x, y: p.y }))
        },
        expressions: {
          neutral: detection.expressions.neutral,
          happy: detection.expressions.happy,
          sad: detection.expressions.sad,
          angry: detection.expressions.angry,
          fearful: detection.expressions.fearful,
          disgusted: detection.expressions.disgusted,
          surprised: detection.expressions.surprised
        }
      };
    });
  } catch (error) {
    console.error('Face detection error:', error);
    throw new Error(`Face detection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Utility function to draw detected faces on a canvas element
 * @param canvas Canvas element to draw on
 * @param img Source image
 * @param detectedFaces Array of detected faces
 */
export const drawDetectedFaces = (
  canvas: HTMLCanvasElement, 
  img: HTMLImageElement, 
  detectedFaces: DetectedFace[]
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear the canvas and draw the image
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);
  
  // Draw rectangles around the detected faces
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 2;
  
  detectedFaces.forEach(face => {
    // Draw face rectangle
    ctx.strokeRect(face.x, face.y, face.width, face.height);
    
    // Add confidence text
    ctx.fillStyle = '#00FF00';
    ctx.font = '14px Arial';
    const confidenceText = `${Math.round(face.confidence * 100)}%`;
    ctx.fillText(confidenceText, face.x, face.y - 5);
    
    // Mark key landmarks (eyes, nose, mouth)
    if (face.landmarks && face.landmarks.positions.length > 0) {
      ctx.fillStyle = '#FF0000';
      const keyPoints = [
        face.landmarks.positions[27], // nose
        face.landmarks.positions[36], // left eye
        face.landmarks.positions[45], // right eye
        face.landmarks.positions[48], // left mouth
        face.landmarks.positions[54]  // right mouth
      ];
      
      keyPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    // Show dominant expression
    const expressions = face.expressions;
    if (expressions) {
      const dominantExpression = Object.entries(expressions)
        .reduce((prev, current) => (prev[1] > current[1]) ? prev : current)[0];
      
      ctx.fillStyle = '#FFFF00';
      ctx.fillText(dominantExpression, face.x + face.width / 2 - 20, face.y + face.height + 15);
    }
  });
};

/**
 * Verifies if face detection models are loaded
 * @returns Promise<boolean> - true if models are loaded, false otherwise
 */
export const areModelsLoaded = async (): Promise<boolean> => {
  try {
    return faceapi.nets.tinyFaceDetector.isLoaded &&
           faceapi.nets.faceLandmark68Net.isLoaded &&
           faceapi.nets.faceRecognitionNet.isLoaded &&
           faceapi.nets.faceExpressionNet.isLoaded;
  } catch (error) {
    return false;
  }
};
