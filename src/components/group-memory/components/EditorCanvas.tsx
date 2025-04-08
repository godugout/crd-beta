
import React, { useEffect, useState } from 'react';
import { EnhancedCropBoxProps } from '@/components/card-upload/cardDetection';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useMobileGestures } from '@/hooks/useMobileGestures';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MoveHorizontal, ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';

interface EditorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editorImgRef: React.RefObject<HTMLImageElement>;
  imageUrl: string | null;
  selectedAreas: EnhancedCropBoxProps[];
  isDetecting: boolean;
  isProcessing: boolean;
  handlePointerDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  handlePointerMove?: (e: React.MouseEvent | React.TouchEvent) => void;
  handlePointerUp?: () => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  canvasRef,
  editorImgRef,
  imageUrl,
  selectedAreas,
  isDetecting,
  isProcessing,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp
}) => {
  const { isMobile } = useIsMobile();
  const { optimizeInteractions } = useMobileOptimization();
  const [showControls, setShowControls] = useState(false);
  
  // Initialize our gesture handling system
  const {
    handlers,
    scale,
    rotation,
    setGestureCallbacks,
    reset: resetGestures
  } = useMobileGestures({
    enableZoom: true,
    enableRotation: true,
    enableSwipe: true,
    hapticFeedback: optimizeInteractions
  });

  // Register gesture callbacks
  useEffect(() => {
    if (isMobile) {
      setGestureCallbacks.onSwipe((event) => {
        console.log('Swiped:', event.direction);
        if (event.direction === 'left' || event.direction === 'right') {
          // Handle horizontal swipe
        }
      });
      
      setGestureCallbacks.onPinch((event) => {
        console.log('Pinch scale:', event.scale);
        // Custom pinch handler if needed beyond the default scale state
      });
      
      setGestureCallbacks.onRotate((event) => {
        console.log('Rotation angle:', event.angle);
        // Custom rotation handler if needed beyond the default rotation state
      });
    }
    
    return () => resetGestures();
  }, [isMobile]);
  
  // Combine our gesture handlers with existing mouse/touch handlers
  const combinedHandlers = isMobile ? {
    onTouchStart: (e: React.TouchEvent) => {
      handlers.onTouchStart(e);
      handlePointerDown?.(e);
    },
    onTouchMove: (e: React.TouchEvent) => {
      handlers.onTouchMove(e);
      handlePointerMove?.(e);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      handlers.onTouchEnd(e);
      handlePointerUp?.();
    }
  } : {
    onMouseDown: handlePointerDown,
    onMouseMove: handlePointerMove,
    onMouseUp: handlePointerUp,
    onMouseLeave: handlePointerUp
  };
  
  // Setup event handlers
  useEffect(() => {
    // Make sure we clean up event listeners if component unmounts
    return () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.onmousedown = null;
        canvas.onmousemove = null;
        canvas.onmouseup = null;
        canvas.onmouseleave = null;
        canvas.ontouchstart = null;
        canvas.ontouchmove = null;
        canvas.ontouchend = null;
      }
    };
  }, []);

  // Toggle mobile controls
  const toggleControls = () => {
    setShowControls(!showControls);
    if (optimizeInteractions && navigator.vibrate) {
      navigator.vibrate(5);
    }
  };

  return (
    <div className="relative flex-grow border rounded-md overflow-hidden bg-gray-100">
      {/* Hidden image for reference */}
      <img 
        ref={editorImgRef}
        src={imageUrl || ''}
        alt="Editor reference"
        className="hidden"
        crossOrigin="anonymous"
      />
      
      {/* Canvas for interactive editing */}
      <canvas 
        ref={canvasRef}
        className="w-full h-full cursor-grab touch-none"
        style={{
          transform: isMobile ? `scale(${scale}) rotate(${rotation}deg)` : 'none'
        }}
        {...combinedHandlers}
      />
      
      {/* Mobile editing controls toggle */}
      {isMobile && !isProcessing && !isDetecting && imageUrl && (
        <Button
          variant="secondary" 
          size="icon"
          className="absolute bottom-4 right-4 rounded-full bg-white/80 shadow-lg"
          onClick={toggleControls}
        >
          <MoveHorizontal className="h-5 w-5" />
        </Button>
      )}
      
      {/* Mobile editing controls panel */}
      {isMobile && showControls && !isProcessing && !isDetecting && (
        <div className="absolute bottom-16 right-4 p-2 rounded-lg bg-white/90 shadow-lg">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon" onClick={() => console.log('Zoom in')}>
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => console.log('Zoom out')}>
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => console.log('Rotate clockwise')}>
              <RotateCw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => console.log('Rotate counter-clockwise')}>
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Loading overlay */}
      {(isDetecting || isProcessing) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>{isDetecting ? "Detecting..." : "Processing..."}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorCanvas;
