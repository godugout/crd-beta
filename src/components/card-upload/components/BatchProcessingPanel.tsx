
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { EnhancedCropBoxProps } from '../cardDetection';

interface BatchProcessingPanelProps {
  cropBoxes: EnhancedCropBoxProps[];
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  batchSelections: number[];
  setBatchSelections: React.Dispatch<React.SetStateAction<number[]>>;
  onBatchProcess: () => Promise<void>;
  onCancel: () => void;
}

const BatchProcessingPanel: React.FC<BatchProcessingPanelProps> = ({
  cropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  batchSelections,
  setBatchSelections,
  onBatchProcess,
  onCancel
}) => {
  const toggleBatchSelection = (index: number) => {
    setBatchSelections(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-none mb-4 pb-4 border-b">
        <h3 className="text-lg font-medium mb-2">Detected People ({cropBoxes.length})</h3>
        <p className="text-sm text-gray-500 mb-4">
          {batchSelections.length > 0 
            ? `${batchSelections.length} people selected` 
            : "Select specific people or process all"}
        </p>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => setBatchSelections(cropBoxes.map((_, i) => i))}
            variant="outline"
            className="text-xs"
            size="sm"
          >
            Select All
          </Button>
          <Button 
            onClick={() => setBatchSelections([])}
            variant="outline"
            className="text-xs"
            size="sm"
            disabled={batchSelections.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>
    
      <div className="flex-grow overflow-y-auto">
        {cropBoxes.map((cropBox, index) => (
          <div 
            key={`crop-${index}`}
            className={`flex items-center p-2 mb-2 rounded ${
              selectedCropIndex === index 
                ? 'bg-blue-50 border border-blue-200' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedCropIndex(index)}
          >
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 cursor-pointer ${
                batchSelections.includes(index) 
                  ? 'bg-cardshow-blue text-white' 
                  : 'border-2 border-gray-300'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleBatchSelection(index);
              }}
            >
              {batchSelections.includes(index) && <Check className="h-4 w-4" />}
            </div>
            <div>
              <p className="font-medium">Person {index + 1}</p>
              <p className="text-xs text-gray-500">
                {Math.round(cropBox.width)} x {Math.round(cropBox.height)} px
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex-none pt-4 border-t mt-4">
        <Button 
          onClick={onBatchProcess} 
          className="w-full mb-2"
        >
          Process {batchSelections.length > 0 ? batchSelections.length : 'All'} People
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BatchProcessingPanel;
