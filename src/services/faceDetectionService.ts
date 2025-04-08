
import * as faceapi from 'face-api.js';
import { toast } from 'sonner';

// Face detection configuration
const FACE_DETECTION_CONFIG = {
  minConfidence: 0.5,
  maxResults: 10,
};

// Interface for detection results
export interface FaceDetectionResult {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

/**
 * Service for detecting faces in images
 */
export class FaceDetectionService {
  private static modelsLoaded = false;
  private static isLoading = false;

  /**
   * Load the required face-api models
   */
  static async loadModels(): Promise<boolean> {
    // Only load models once
    if (this.modelsLoaded) return true;
    if (this.isLoading) return false;

    try {
      this.isLoading = true;
      console.log('Loading face detection models...');
      
      // Set the models path to our public directory
      const modelPath = '/models';
      
      // Load the required models for face detection
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
      
      console.log('Face detection models loaded successfully!');
      this.modelsLoaded = true;
      this.isLoading = false;
      return true;
    } catch (error) {
      console.error('Error loading face detection models:', error);
      this.isLoading = false;
      throw new Error('Failed to load face detection models');
    }
  }

  /**
   * Detect faces in an image
   * @param imageElement The HTML image element containing the image
   * @returns Array of face detection results
   */
  static async detectFaces(
    imageElement: HTMLImageElement
  ): Promise<FaceDetectionResult[]> {
    try {
      // Ensure models are loaded
      if (!this.modelsLoaded) {
        await this.loadModels();
      }
      
      // Run face detection
      console.log('Detecting faces...');
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: FACE_DETECTION_CONFIG.minConfidence,
      });
      
      const detections = await faceapi.detectAllFaces(imageElement, options);
      console.log(`Detected ${detections.length} faces`);
      
      // Convert to our simple format
      return detections.map(detection => {
        const box = detection.box;
        return {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          confidence: detection.score,
        };
      });
    } catch (error) {
      console.error('Face detection error:', error);
      toast.error('Failed to detect faces in the image');
      return [];
    }
  }
}
