
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ArCardItem from './ArCardItem';

interface CameraViewProps {
  activeCards: Card[];
  selectedCardId: string | null;
  onSelectCard: (id: string) => void;
  onError: (message: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  activeCards, 
  selectedCardId,
  onSelectCard,
  onError 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {/* Video feed from camera */}
      <video 
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
      />
      
      {/* AR card items */}
      <div className="absolute inset-0 pointer-events-auto">
        {activeCards.map((card, index) => (
          <ArCardItem
            key={card.id}
            card={card}
            index={index}
            isSelected={card.id === selectedCardId}
            onSelect={onSelectCard}
          />
        ))}
      </div>
      
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
