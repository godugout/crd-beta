
import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import ArCardItem from './ArCardItem';
import { motion } from 'framer-motion';

interface CameraViewProps {
  activeCards: Card[];
  selectedCardId: string | null;
  onSelectCard: (id: string) => void;
  onError: (message: string) => void;
  cardPositions?: Record<string, { x: number, y: number, rotation: number }>;
}

const CameraView: React.FC<CameraViewProps> = ({
  activeCards,
  selectedCardId,
  onSelectCard,
  onError,
  cardPositions = {}
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  
  // Initialize camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const initCamera = async () => {
      try {
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        // Set video source
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        onError(typeof err === 'object' && err !== null && 'message' in err 
          ? (err as Error).message 
          : 'Could not access camera');
      }
    };
    
    initCamera();
    
    // Clean up
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onError]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Camera background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 min-w-full min-h-full object-cover"
        style={{ filter: 'brightness(0.9)' }}
      />
      
      {/* AR overlay with cards */}
      <div className="absolute inset-0 pointer-events-none">
        {activeCards.map((card, index) => {
          const position = cardPositions[card.id] || { x: 0, y: 0, rotation: 0 };
          
          return (
            <motion.div
              key={card.id}
              className="absolute left-1/2 top-1/2"
              initial={{ x: '-50%', y: '-50%' }}
              animate={{
                x: `calc(-50% + ${position.x}px)`,
                y: `calc(-50% + ${position.y}px)`,
                rotate: position.rotation
              }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <ArCardItem
                card={card}
                index={index}
                isSelected={card.id === selectedCardId}
                onSelect={onSelectCard}
              />
            </motion.div>
          );
        })}
        
        {!cameraReady && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white">
            <div className="animate-pulse">
              <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-white/30 animate-spin mb-4 mx-auto"></div>
              <p>Initializing camera...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Augmented reality overlay effects */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 to-transparent opacity-70"></div>
      
      {/* Grid pattern overlay for AR effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      ></div>
    </div>
  );
};

export default CameraView;
