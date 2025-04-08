
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Users, Crop } from 'lucide-react';

interface EditorToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateClockwise: () => void;
  onRotateCounterClockwise: () => void;
  selectedTab: string;
  onRunDetection: () => void;
  onAddSelection: () => void;
  onEnhanceImage: () => void;
  onResetAdjustments: () => void;
  isDetecting: boolean;
  imageUrl: string | null;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onRotateClockwise,
  onRotateCounterClockwise,
  selectedTab,
  onRunDetection,
  onAddSelection,
  onEnhanceImage,
  onResetAdjustments,
  isDetecting,
  imageUrl
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
      <div className="flex items-center gap-1">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRotateCounterClockwise}
        >
          <RotateCcw size={18} />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRotateClockwise}
        >
          <RotateCw size={18} />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onZoomOut}
          disabled={zoom <= 50}
        >
          <ZoomOut size={18} />
        </Button>
        <span className="mx-1 text-sm">{zoom}%</span>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onZoomIn}
          disabled={zoom >= 200}
        >
          <ZoomIn size={18} />
        </Button>
      </div>
      
      <div>
        {selectedTab === "detection" && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={onRunDetection}
              disabled={isDetecting || !imageUrl}
            >
              <Users size={18} className="mr-1" />
              Run Detection
            </Button>
            <Button 
              variant="outline" 
              onClick={onAddSelection}
            >
              <Crop size={18} className="mr-1" />
              Add Selection
            </Button>
          </div>
        )}
        {selectedTab === "adjustments" && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={onEnhanceImage}
              disabled={!imageUrl}
            >
              <Sun size={18} className="mr-1" />
              Enhance
            </Button>
            <Button 
              variant="outline" 
              onClick={onResetAdjustments}
            >
              <Layers size={18} className="mr-1" />
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;
