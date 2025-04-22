
import React from 'react';
import { 
  Flip, 
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
    <div className="absolute top-4 right-4 z-20">
      <div className="flex flex-col space-y-2">
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-2">
          <div className="flex flex-col gap-2">
            <Button
              size="icon"
              variant="outline"
              className="bg-transparent border-gray-600 hover:bg-gray-700 text-white hover:text-white"
              onClick={onFlipCard}
              title="Flip Card"
            >
              <Flip className="h-5 w-5" />
            </Button>
            
            <Button
              size="icon"
              variant="outline"
              className={`bg-transparent border-gray-600 hover:bg-gray-700 text-white hover:text-white ${
                isAutoRotating ? "bg-purple-900/50 border-purple-500" : ""
              }`}
              onClick={onToggleAutoRotation}
              title="Auto Rotate"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <Button
              size="icon"
              variant="outline"
              className={`bg-transparent border-gray-600 hover:bg-gray-700 text-white hover:text-white ${
                showInfo ? "bg-blue-900/50 border-blue-500" : ""
              }`}
              onClick={onToggleInfo}
              title="Card Information"
            >
              <Info className="h-5 w-5" />
            </Button>

            {onToggleEffects && (
              <Button
                size="icon"
                variant="outline"
                className={`bg-transparent border-gray-600 hover:bg-gray-700 text-white hover:text-white ${
                  showEffectsPanel ? "bg-purple-900/50 border-purple-500" : ""
                }`}
                onClick={onToggleEffects}
                title="Effects Panel"
              >
                <Sparkles className="h-5 w-5" />
              </Button>
            )}
            
            <Button
              size="icon"
              variant="outline"
              className="bg-transparent border-gray-600 hover:bg-gray-700 text-white hover:text-white"
              onClick={onToggleFullscreen}
              title="Fullscreen"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
            
            <Button
              size="icon"
              variant="outline"
              className="bg-transparent border-gray-600 hover:bg-gray-700 text-white hover:text-white"
              onClick={onShare}
              title="Share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            
            {onClose && (
              <Button
                size="icon"
                variant="outline"
                className="bg-transparent border-gray-600 hover:bg-gray-700 text-white hover:text-white"
                onClick={onClose}
                title="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerControls;
