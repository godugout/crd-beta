
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Share2 } from 'lucide-react';
import { Card } from '@/lib/types';
import { toast } from 'sonner';
import CameraView from './CameraView';
import ArControls from './ArControls';

interface ArModeViewProps {
  activeCard: Card | null;
  onExitAr: () => void;
  onCameraError: (message: string) => void;
  onTakeSnapshot: () => void;
  onFlip: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
}

const ArModeView: React.FC<ArModeViewProps> = ({
  activeCard,
  onExitAr,
  onCameraError,
  onTakeSnapshot,
  onFlip,
  onZoomIn,
  onZoomOut,
  onRotate
}) => {
  return (
    <div className="relative h-screen w-screen bg-black">
      {/* AR Camera View */}
      <CameraView 
        activeCard={activeCard} 
        onError={onCameraError}
      />
      
      {/* AR Controls */}
      <ArControls
        onTakeSnapshot={onTakeSnapshot}
        onFlip={onFlip}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onRotate={onRotate}
      />
      
      {/* Exit AR Button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 left-4 z-50 bg-black/50 text-white border-white/20"
        onClick={onExitAr}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Exit AR
      </Button>
      
      {/* Share Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-black/50 text-white border-white/20"
        onClick={() => toast.success('Sharing options opened')}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ArModeView;
