
import React from 'react';
import { X, Rotate3d, RefreshCcw, FlipHorizontal, Settings } from 'lucide-react';

export interface ViewerControlsProps {
  isFlipped: boolean;
  isAutoRotating: boolean;
  onFlipCard: () => void;
  onToggleAutoRotation: () => void;
  onToggleControls: () => void;
  onClose: () => void;
}

const ViewerControls: React.FC<ViewerControlsProps> = ({
  isFlipped,
  isAutoRotating,
  onFlipCard,
  onToggleAutoRotation,
  onToggleControls,
  onClose
}) => {
  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2">
      <button
        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        onClick={onClose}
        aria-label="Close viewer"
      >
        <X size={20} />
      </button>
      
      <button
        className={`p-2 rounded-full ${isFlipped ? 'bg-white/20 text-white' : 'bg-black/50 text-white'} hover:bg-black/70 transition-colors`}
        onClick={onFlipCard}
        aria-label="Flip card"
      >
        <FlipHorizontal size={20} />
      </button>
      
      <button
        className={`p-2 rounded-full ${isAutoRotating ? 'bg-purple-600 text-white' : 'bg-black/50 text-white'} hover:bg-black/70 transition-colors`}
        onClick={onToggleAutoRotation}
        aria-label="Toggle auto rotation"
      >
        <Rotate3d size={20} />
      </button>
      
      <button
        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        onClick={onToggleControls}
        aria-label="Toggle controls"
      >
        <Settings size={20} />
      </button>
    </div>
  );
};

export default ViewerControls;
