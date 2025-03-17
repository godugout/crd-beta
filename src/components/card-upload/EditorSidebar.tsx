
import React from 'react';
import { Check, Crop } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CropBoxProps } from './CropBox';

interface EditorSidebarProps {
  cropBoxes: CropBoxProps[];
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  onExtractCard: () => void;
  onCancel: () => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  cropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  onExtractCard,
  onCancel
}) => {
  return (
    <div className="h-full flex flex-col p-4">
      <h3 className="font-medium mb-4">Detected Cards</h3>
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {cropBoxes.map((box, index) => (
            <div 
              key={index}
              className={cn(
                "border rounded-lg overflow-hidden cursor-pointer",
                selectedCropIndex === index ? "ring-2 ring-cardshow-blue" : ""
              )}
              onClick={() => setSelectedCropIndex(index)}
            >
              <div className="aspect-[2.5/3.5] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-cardshow-slate-light">
                    Card {index + 1}
                  </span>
                </div>
                
                <div className="absolute right-2 top-2">
                  {selectedCropIndex === index && (
                    <div className="bg-cardshow-blue text-white rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-cardshow-slate mb-4">
          Select a card crop area and click "Extract Card" to use it for your digital card.
        </p>
        
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onExtractCard}
            className="px-4 py-2 bg-cardshow-blue text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
          >
            <Crop className="h-4 w-4" />
            Extract Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
