
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import ArCardItem from './ArCardItem';

interface CardPosition {
  x: number;
  y: number;
  rotation: number;
}

interface CameraViewProps {
  activeCards: Card[];
  selectedCardId: string | null;
  onSelectCard: (id: string) => void;
  onError: (message: string) => void;
  cardPositions: Record<string, CardPosition>;
}

const CameraView: React.FC<CameraViewProps> = ({
  activeCards,
  selectedCardId,
  onSelectCard,
  onError,
  cardPositions
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Initialize camera
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(error => {
            console.error("Error playing video:", error);
            onError("Could not start camera playback");
          });
          
          videoRef.current.onloadeddata = () => {
            setCameraReady(true);
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        onError("Could not access camera. Please allow camera access for AR features.");
      }
    };
    
    setupCamera();
    
    return () => {
      // Cleanup camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [onError]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
        style={{ 
          filter: !cameraReady ? 'blur(10px) brightness(0.5)' : 'none',
          transition: 'filter 0.5s ease'
        }}
      />
      
      {!cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Initializing camera...</p>
          </div>
        </div>
      )}
      
      {/* Cards overlaid on camera */}
      <div className="absolute inset-0 pointer-events-none">
        {activeCards.map((card, index) => {
          const position = cardPositions[card.id] || { x: 0, y: 0, rotation: 0 };
          
          return (
            <div
              key={card.id}
              className="absolute pointer-events-auto"
              style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                transform: `translate(-50%, -50%) rotate(${position.rotation}deg)`,
                zIndex: selectedCardId === card.id ? 10 : 1,
                transition: 'transform 0.15s ease-out'
              }}
            >
              <ArCardItem
                card={card}
                index={index}
                isSelected={selectedCardId === card.id}
                onSelect={onSelectCard}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CameraView;
