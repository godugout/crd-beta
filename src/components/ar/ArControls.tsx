
import React from 'react';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { FlipHorizontal, ZoomIn, ZoomOut, RotateCcw, Camera } from 'lucide-react';

interface ArControlsProps {
  onTakeSnapshot: () => void;
  onFlip: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
}

const ArControls: React.FC<ArControlsProps> = ({
  onTakeSnapshot,
  onFlip,
  onZoomIn,
  onZoomOut,
  onRotate
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-black/50 border-white/20 text-white hover:bg-black/70"
            onClick={onZoomIn}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-black/50 border-white/20 text-white hover:bg-black/70"
            onClick={onZoomOut}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-black/50 border-white/20 text-white hover:bg-black/70"
            onClick={onRotate}
            aria-label="Rotate"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
        
        <CrdButton 
          variant="gradient"
          onClick={onTakeSnapshot}
          className="shadow-lg"
        >
          <Camera className="h-5 w-5 mr-2" />
          <span className="crd-text-medium font-medium">Capture</span>
        </CrdButton>
        
        <Button 
          variant="outline" 
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
          onClick={onFlip}
        >
          <FlipHorizontal className="h-5 w-5 mr-2" />
          <span className="crd-text-medium">Flip Card</span>
        </Button>
      </div>
    </div>
  );
};

export default ArControls;
