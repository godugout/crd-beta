
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import ArCardItem from './ArCardItem';
import { toast } from 'sonner';

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
  const [cameraEffect, setCameraEffect] = useState<'normal' | 'vintage' | 'vivid'>('normal');
  const [showCardGrid, setShowCardGrid] = useState(false);

  // Initialize camera
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(error => {
            console.error("Error playing video:", error);
            onError("Could not start camera playback");
          });
          
          videoRef.current.onloadeddata = () => {
            setCameraReady(true);
            toast.success("AR mode active", {
              description: "Move your device to position cards in your environment"
            });
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        onError("Could not access camera. Please allow camera access for AR features.");
      }
    };
    
    setupCamera();
    
    // Change camera effects at intervals for a dynamic experience
    const effectInterval = setInterval(() => {
      setCameraEffect(prev => {
        const effects: ('normal' | 'vintage' | 'vivid')[] = ['normal', 'vintage', 'vivid'];
        const currentIndex = effects.indexOf(prev);
        return effects[(currentIndex + 1) % effects.length];
      });
    }, 10000);  // Change every 10 seconds
    
    return () => {
      // Cleanup camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      clearInterval(effectInterval);
    };
  }, [onError]);

  // Toggle grid layout for cards
  const toggleCardGrid = () => {
    setShowCardGrid(!showCardGrid);
  };
  
  // Get camera filter based on effect
  const getCameraFilter = () => {
    switch (cameraEffect) {
      case 'vintage':
        return 'sepia(0.3) contrast(1.1) brightness(0.9)';
      case 'vivid':
        return 'saturate(1.4) contrast(1.1) brightness(1.05)';
      default:
        return 'none';
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover transition-filter duration-1000 ease-in-out"
        style={{ 
          filter: !cameraReady ? 'blur(10px) brightness(0.5)' : getCameraFilter(),
          transition: 'filter 1.5s ease'
        }}
      />
      
      {/* Camera overlay gradients for better card visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50 pointer-events-none" />
      
      {!cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Initializing camera...</p>
          </div>
        </div>
      )}
      
      {/* Grid helper indicator - shows when grid layout is active */}
      {showCardGrid && cameraReady && (
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 pointer-events-none">
          {Array(9).fill(0).map((_, i) => (
            <div key={i} className="border border-white/20 rounded-lg"></div>
          ))}
        </div>
      )}
      
      {/* Toggle grid button */}
      {cameraReady && (
        <button 
          onClick={toggleCardGrid}
          className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full z-10"
        >
          {showCardGrid ? "Hide Grid" : "Show Grid"}
        </button>
      )}
      
      {/* Cards overlaid on camera */}
      <div className="absolute inset-0 pointer-events-none">
        {activeCards.map((card, index) => {
          const position = cardPositions[card.id] || { x: 0, y: 0, rotation: 0 };
          
          // Calculate position based on grid layout when enabled
          let cardPosition = { x: position.x, y: position.y, rotation: position.rotation };
          
          if (showCardGrid) {
            const gridColumns = 3;
            const gridRows = 3;
            const col = index % gridColumns;
            const row = Math.floor(index / gridColumns) % gridRows;
            
            cardPosition = {
              x: ((col + 0.5) * (100 / gridColumns)) - 50, // Center in grid cell
              y: ((row + 0.5) * (100 / gridRows)) - 50,    // Center in grid cell
              rotation: 0
            };
          }
          
          // Add some subtle animation for non-selected cards
          const animationStyle = !selectedCardId || selectedCardId === card.id
            ? {} 
            : {
                animation: 'float 6s infinite ease-in-out',
                animationDelay: `${index * 0.5}s`
              };
          
          return (
            <div
              key={card.id}
              className="absolute pointer-events-auto"
              style={{
                left: `calc(50% + ${cardPosition.x}px)`,
                top: `calc(50% + ${cardPosition.y}px)`,
                transform: `translate(-50%, -50%) rotate(${cardPosition.rotation}deg)`,
                zIndex: selectedCardId === card.id ? 10 : 1,
                transition: showCardGrid 
                  ? 'left 0.5s ease, top 0.5s ease, transform 0.5s ease' 
                  : 'transform 0.15s ease-out',
                ...animationStyle
              }}
            >
              <ArCardItem
                card={card}
                index={index}
                isSelected={selectedCardId === card.id}
                onSelect={onSelectCard}
                effectIntensity={selectedCardId === card.id ? 0.9 : 0.6}
              />
            </div>
          );
        })}
      </div>
      
      {/* Camera effect indicator */}
      {cameraReady && (
        <div className="absolute bottom-4 left-4 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
          {cameraEffect === 'normal' ? 'Standard' : cameraEffect === 'vintage' ? 'Vintage Filter' : 'Vivid Mode'}
        </div>
      )}
    </div>
  );
};

export default CameraView;
