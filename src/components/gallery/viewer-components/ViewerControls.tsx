
import React from 'react';
import { ChevronLeft, ChevronRight, Share2, Maximize, Rotate3D, Info, X } from 'lucide-react';

interface ViewerControlsProps {
  isFlipped: boolean;
  isAutoRotating: boolean;
  showInfo: boolean;
  onFlipCard: () => void;
  onToggleAutoRotation: () => void;
  onToggleInfo: () => void;
  onToggleFullscreen: () => void;
  onShare: () => void;
  onClose: () => void;
}

const ViewerControls = ({
  isFlipped,
  isAutoRotating,
  showInfo,
  onFlipCard,
  onToggleAutoRotation,
  onToggleInfo,
  onToggleFullscreen,
  onShare,
  onClose,
}: ViewerControlsProps) => {
  return (
    <div className="absolute top-4 right-4 flex space-x-3">
      <button 
        className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
        onClick={onFlipCard}
        title="Flip card"
      >
        <ChevronLeft size={20} className={isFlipped ? "hidden" : ""} />
        <ChevronRight size={20} className={isFlipped ? "" : "hidden"} />
      </button>

      <button 
        className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
        onClick={onToggleAutoRotation}
        title={isAutoRotating ? "Stop auto rotation" : "Start auto rotation"}
      >
        <Rotate3D size={20} className={isAutoRotating ? "text-primary" : "text-white"} />
      </button>

      <button 
        className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
        onClick={onToggleInfo}
        title="Show card info"
      >
        <Info size={20} className={showInfo ? "text-primary" : "text-white"} />
      </button>

      <button 
        className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
        onClick={onToggleFullscreen}
        title="Toggle fullscreen"
      >
        <Maximize size={20} />
      </button>

      <button 
        className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
        onClick={onShare}
        title="Share card"
      >
        <Share2 size={20} />
      </button>

      <button 
        className="text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
        onClick={onClose}
        title="Close viewer"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default ViewerControls;
