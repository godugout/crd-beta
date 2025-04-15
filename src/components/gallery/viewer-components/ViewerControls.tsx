
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Camera, Share2 } from 'lucide-react';

interface ViewerControlsProps {
  onFlip: () => void;
  onTakeSnapshot?: () => void;
  onShare?: () => void;
}

const ViewerControls: React.FC<ViewerControlsProps> = ({ 
  onFlip, 
  onTakeSnapshot,
  onShare 
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onFlip}
        className="flex items-center gap-1"
      >
        <RotateCw className="h-4 w-4" />
        <span>Flip</span>
      </Button>
      
      {onTakeSnapshot && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onTakeSnapshot}
          className="flex items-center gap-1"
        >
          <Camera className="h-4 w-4" />
          <span>Snapshot</span>
        </Button>
      )}
      
      {onShare && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShare}
          className="flex items-center gap-1"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      )}
    </div>
  );
};

export default ViewerControls;
