
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DetectedFace, 
  loadFaceDetectionModels, 
  detectFaces, 
  drawDetectedFaces,
  createImageFromFile,
  areModelsLoaded
} from '@/lib/faceDetection';

const FaceDetector: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Load models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        // Check if models are already loaded
        const loaded = await areModelsLoaded();
        
        if (!loaded) {
          // Path to face-api.js models (should be in your public folder)
          const modelUrl = '/models';
          await loadFaceDetectionModels(modelUrl);
        }
        
        setModelsLoaded(true);
        toast.success("Face detection models loaded successfully");
      } catch (error) {
        console.error("Error loading face detection models:", error);
        toast.error("Failed to load face detection models");
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        setImageFile(file);
        
        // Create image element for displaying
        const img = await createImageFromFile(file);
        if (imageRef.current) {
          imageRef.current.src = img.src;
          imageRef.current.onload = () => {
            processImage(file);
          };
        }
      } catch (error) {
        toast.error("Error loading image");
      }
    }
  };
  
  const processImage = async (file: File) => {
    if (!modelsLoaded) {
      toast.error("Face detection models are not loaded yet");
      return;
    }
    
    try {
      setIsLoading(true);
      const faces = await detectFaces(file);
      setDetectedFaces(faces);
      
      if (faces.length === 0) {
        toast.info("No faces detected in the image");
      } else {
        toast.success(`Detected ${faces.length} face${faces.length === 1 ? '' : 's'}`);
      }
      
      // Draw faces on canvas
      if (canvasRef.current && imageRef.current && imageRef.current.complete) {
        drawDetectedFaces(canvasRef.current, imageRef.current, faces);
      }
    } catch (error) {
      console.error("Face detection error:", error);
      toast.error("Error processing image for face detection");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold">Face Detection</h2>
        
        {!modelsLoaded && (
          <div className="flex items-center gap-2 text-amber-500">
            <AlertCircle size={20} />
            <span>Loading face detection models...</span>
          </div>
        )}
        
        <div className="w-full max-w-md border rounded-lg p-4">
          <Button 
            variant="outline" 
            className="w-full h-32 border-dashed" 
            disabled={isLoading || !modelsLoaded}
          >
            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
                disabled={isLoading || !modelsLoaded}
              />
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Upload className="h-6 w-6 mb-2" />
                  <span>Upload image for face detection</span>
                </>
              )}
            </label>
          </Button>
        </div>
        
        {imageFile && (
          <div className="relative border rounded-lg overflow-hidden w-full max-w-2xl">
            <img 
              ref={imageRef} 
              alt="Uploaded" 
              className="w-full hidden" 
            />
            <canvas 
              ref={canvasRef}
              className="w-full"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
              {detectedFaces.length > 0 ? (
                <p>{detectedFaces.length} face{detectedFaces.length === 1 ? '' : 's'} detected</p>
              ) : imageFile && !isLoading ? (
                <p>No faces detected</p>
              ) : (
                <p>Processing image...</p>
              )}
            </div>
          </div>
        )}
        
        {detectedFaces.length > 0 && (
          <div className="w-full max-w-md border rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Detection Results:</h3>
            <ul className="space-y-2">
              {detectedFaces.map((face, index) => {
                // Find the dominant expression
                const expressions = Object.entries(face.expressions);
                const dominantExpression = expressions.reduce((max, current) => 
                  current[1] > max[1] ? current : max, ['none', 0]
                );
                
                return (
                  <li key={index} className="border-b pb-2">
                    <p>Face #{index + 1}</p>
                    <p>Confidence: {(face.confidence * 100).toFixed(1)}%</p>
                    <p>Expression: {dominantExpression[0]} ({(dominantExpression[1] * 100).toFixed(1)}%)</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceDetector;
