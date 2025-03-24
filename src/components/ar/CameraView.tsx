
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CameraViewProps {
  activeCard: Card | null;
  onError: (message: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ activeCard, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, // Use back camera if available
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraReady(true);
          setCameraError(null);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error accessing camera';
        setCameraError(errorMessage);
        onError(errorMessage);
      }
    };

    startCamera();

    // Clean up function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onError]);

  // Render the card on top of the video feed
  useEffect(() => {
    if (!cameraReady || !activeCard || !canvasRef.current || !videoRef.current) return;

    const renderFrame = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      if (!canvas || !video) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw card in the center of the screen
      if (activeCard.imageUrl) {
        const img = new Image();
        img.onload = () => {
          // Calculate position to center the card
          const cardWidth = canvas.width * 0.5; // 50% of screen width
          const cardHeight = cardWidth * 1.4; // Standard card aspect ratio
          const x = (canvas.width - cardWidth) / 2;
          const y = (canvas.height - cardHeight) / 2;
          
          ctx.drawImage(img, x, y, cardWidth, cardHeight);
        };
        img.src = activeCard.imageUrl;
      }
    };

    const animationId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animationId);
  }, [cameraReady, activeCard]);

  if (cameraError) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Camera Access Error</AlertTitle>
          <AlertDescription>
            {cameraError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Video feed from camera */}
      <video 
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
      />
      
      {/* Canvas overlay for AR effects */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      
      {/* Loading indicator */}
      {!cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-t-transparent border-white rounded-full animate-spin mx-auto mb-2"></div>
            <p>Initializing camera...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;
