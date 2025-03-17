
import React from 'react';
import { Maximize, Plus, X, RotateCw, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface EditorToolbarProps {
  onMaximizeCrop: () => void;
  onAddCropBox: () => void;
  onRemoveCropBox: () => void;
  onRotateClockwise?: () => void;
  onRotateCounterClockwise?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onMaximizeCrop,
  onAddCropBox,
  onRemoveCropBox,
  onRotateClockwise,
  onRotateCounterClockwise,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 flex items-center space-x-2">
      <button
        onClick={onMaximizeCrop}
        className="p-2 hover:bg-gray-100 rounded-md" 
        title="Maximize crop area"
      >
        <Maximize className="h-5 w-5 text-cardshow-slate" />
      </button>
      
      <button
        onClick={onAddCropBox}
        className="p-2 hover:bg-gray-100 rounded-md"
        title="Add new crop area"
      >
        <Plus className="h-5 w-5 text-cardshow-slate" />
      </button>
      
      <button
        onClick={onRemoveCropBox}
        className="p-2 hover:bg-gray-100 rounded-md" 
        title="Remove selected crop area"
      >
        <X className="h-5 w-5 text-cardshow-slate" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 mx-1"></div>
      
      {onRotateClockwise && (
        <button
          onClick={onRotateClockwise}
          className="p-2 hover:bg-gray-100 rounded-md" 
          title="Rotate 90° clockwise"
        >
          <RotateCw className="h-5 w-5 text-cardshow-slate" />
        </button>
      )}
      
      {onRotateCounterClockwise && (
        <button
          onClick={onRotateCounterClockwise}
          className="p-2 hover:bg-gray-100 rounded-md" 
          title="Rotate 90° counter-clockwise"
        >
          <RotateCcw className="h-5 w-5 text-cardshow-slate" />
        </button>
      )}
      
      {(onZoomIn || onZoomOut) && <div className="w-px h-6 bg-gray-200 mx-1"></div>}
      
      {onZoomIn && (
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-100 rounded-md" 
          title="Zoom in"
        >
          <ZoomIn className="h-5 w-5 text-cardshow-slate" />
        </button>
      )}
      
      {onZoomOut && (
        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-100 rounded-md" 
          title="Zoom out"
        >
          <ZoomOut className="h-5 w-5 text-cardshow-slate" />
        </button>
      )}
    </div>
  );
};

export default EditorToolbar;
