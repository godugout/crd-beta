
import React from 'react';
import { Button } from '@/components/ui/button';
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
            className="bg-black/40 border-white/20 text-white hover:bg-black/60"
            onClick={onZoomIn}
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-black/40 border-white/20 text-white hover:bg-black/60"
            onClick={onZoomOut}
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-black/40 border-white/20 text-white hover:bg-black/60"
            onClick={onRotate}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
        
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={onTakeSnapshot}
        >
          <Camera className="h-5 w-5 mr-2" />
          Snapshot
        </Button>
        
        <Button 
          variant="outline" 
          className="bg-black/40 border-white/20 text-white hover:bg-black/60"
          onClick={onFlip}
        >
          <FlipHorizontal className="h-5 w-5 mr-2" />
          Flip Card
        </Button>
      </div>
    </div>
  );
};

export default ArControls;
