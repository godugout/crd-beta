
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageControlsPanel } from '@/components/image-controls';
import { EnhancedCropBoxProps, MemorabiliaType } from '../cardDetection';

interface ExtractionPanelProps {
  cropBoxes: EnhancedCropBoxProps[];
  selectedCropIndex: number;
  stagedCards: { file: File; url: string; type?: MemorabiliaType }[];
  onMemorabiliaTypeChange: (index: number, type: MemorabiliaType) => void;
  onExtractSelected: () => Promise<void>;
  onSelectStagedCard: (index: number) => void;
  onRemoveStagedCard: (index: number) => void;
  onCancel: () => void;
  enabledMemorabiliaTypes?: MemorabiliaType[];
  autoEnhance?: boolean;
}

const ExtractionPanel: React.FC<ExtractionPanelProps> = ({
  cropBoxes,
  selectedCropIndex,
  stagedCards,
  onMemorabiliaTypeChange,
  onExtractSelected,
  onSelectStagedCard,
  onRemoveStagedCard,
  onCancel,
  enabledMemorabiliaTypes,
  autoEnhance
}) => {
  const selectedBox = selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length 
    ? cropBoxes[selectedCropIndex] 
    : null;

  const handleMemorabiliaTypeChange = (type: MemorabiliaType) => {
    if (selectedCropIndex >= 0) {
      onMemorabiliaTypeChange(selectedCropIndex, type);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto">
      <div className="flex-none mb-4">
        <h3 className="text-lg font-medium mb-2">Detected Items</h3>
        <p className="text-sm text-gray-500 mb-4">
          Select and extract memorabilia items from your image
        </p>
      </div>
      
      {/* Edit selected crop area */}
      <div className="flex-none mb-4">
        {selectedBox ? (
          <ImageControlsPanel
            title="Edit Selection"
            selectedCropIndex={selectedCropIndex}
            memorabiliaType={selectedBox.memorabiliaType}
            onMemorabiliaTypeChange={handleMemorabiliaTypeChange}
            enabledMemorabiliaTypes={enabledMemorabiliaTypes}
            disabled={false}
          />
        ) : (
          <div className="p-4 border rounded-lg bg-gray-50 text-center">
            <p className="text-gray-500">Select a detected area to edit</p>
          </div>
        )}
      </div>
      
      {/* Extract button */}
      {selectedBox && (
        <div className="flex-none mt-2 mb-4">
          <Button 
            onClick={onExtractSelected} 
            className="w-full"
          >
            {autoEnhance ? 'Extract & Enhance Selected' : 'Extract Selected'}
          </Button>
        </div>
      )}
      
      {/* Staged extracted cards */}
      <div className="flex-grow overflow-y-auto mt-4">
        <h4 className="text-md font-medium mb-2">Extracted Items {stagedCards.length > 0 ? `(${stagedCards.length})` : ''}</h4>
        {stagedCards.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {stagedCards.map((card, idx) => (
              <div 
                key={idx} 
                className="relative border rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onSelectStagedCard(idx)}
              >
                <img src={card.url} alt={`Extracted ${card.type || 'item'}`} className="w-full h-auto" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 bg-red-500 bg-opacity-70 hover:bg-opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveStagedCard(idx);
                  }}
                >
                  <span className="sr-only">Remove</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
                {card.type && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 capitalize">
                    {card.type}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 border rounded-lg bg-gray-50 text-center">
            <p className="text-gray-500">No items extracted yet</p>
          </div>
        )}
      </div>
      
      {/* Cancel button */}
      <div className="flex-none pt-4 mt-4 border-t">
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

export default ExtractionPanel;
