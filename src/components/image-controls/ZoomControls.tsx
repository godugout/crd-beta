
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { ZoomControlsProps } from './types';

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  disabled = false
}) => {
  return (
    <div className="flex items-center space-x-2">
      {onZoomIn && (
        <Button
          onClick={onZoomIn}
          variant="outline"
          size="icon"
          disabled={disabled}
          className="h-8 w-8"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      )}
      
      {onZoomOut && (
        <Button
          onClick={onZoomOut}
          variant="outline"
          size="icon"
          disabled={disabled}
          className="h-8 w-8"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      )}

      {onReset && (
        <Button
          onClick={onReset}
          variant="outline"
          size="icon"
          disabled={disabled}
          className="h-8 w-8"
          title="Reset zoom"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ZoomControls;
