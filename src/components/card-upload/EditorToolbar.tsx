
import React from 'react';
import { Maximize, Plus, X } from 'lucide-react';

interface EditorToolbarProps {
  onMaximizeCrop: () => void;
  onAddCropBox: () => void;
  onRemoveCropBox: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onMaximizeCrop,
  onAddCropBox,
  onRemoveCropBox
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
    </div>
  );
};

export default EditorToolbar;
