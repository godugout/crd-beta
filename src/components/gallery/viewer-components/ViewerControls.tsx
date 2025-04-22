
import React from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  Info, 
  Maximize2, 
  Share2, 
  X, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewerControlsProps {
  isFlipped: boolean;
  isAutoRotating: boolean;
  showInfo: boolean;
  showEffectsPanel?: boolean;
  onFlipCard: () => void;
  onToggleAutoRotation: () => void;
  onToggleInfo: () => void;
  onToggleEffects?: () => void;
  onToggleFullscreen: () => void;
  onShare: () => void;
  onClose?: () => void;
}

const ViewerControls: React.FC<ViewerControlsProps> = ({
  isFlipped,
  isAutoRotating,
  showInfo,
  showEffectsPanel = true, // Default to true
  onFlipCard,
  onToggleAutoRotation,
  onToggleInfo,
  onToggleEffects,
  onToggleFullscreen,
  onShare,
  onClose
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="ghost"
        className={`bg-transparent hover:bg-white/10 text-white ${
          isFlipped ? "text-blue-400" : ""
        }`}
        onClick={onFlipCard}
        title="Flip Card"
      >
        <RotateCw className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Flip</span>
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        className={`bg-transparent hover:bg-white/10 text-white ${
          isAutoRotating ? "text-purple-400" : ""
        }`}
        onClick={onToggleAutoRotation}
        title="Auto Rotate"
      >
        <RotateCcw className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Auto</span>
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        className={`bg-transparent hover:bg-white/10 text-white ${
          showInfo ? "text-blue-400" : ""
        }`}
        onClick={onToggleInfo}
        title="Card Information"
      >
        <Info className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Info</span>
      </Button>

      {onToggleEffects && (
        <Button
          size="sm"
          variant="ghost"
          className={`bg-transparent hover:bg-white/10 text-white ${
            showEffectsPanel ? "text-purple-400" : ""
          }`}
          onClick={onToggleEffects}
          title="Effects Panel"
        >
          <Sparkles className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Effects</span>
        </Button>
      )}
      
      <Button
        size="sm"
        variant="ghost"
        className="bg-transparent hover:bg-white/10 text-white"
        onClick={onToggleFullscreen}
        title="Fullscreen"
      >
        <Maximize2 className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Full</span>
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        className="bg-transparent hover:bg-white/10 text-white"
        onClick={onShare}
        title="Share"
      >
        <Share2 className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Share</span>
      </Button>
      
      {onClose && (
        <Button
          size="sm"
          variant="ghost"
          className="bg-transparent hover:bg-white/10 text-white"
          onClick={onClose}
          title="Close"
        >
          <X className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Close</span>
        </Button>
      )}
    </div>
  );
};

export default ViewerControls;
