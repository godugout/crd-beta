
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, SlidersHorizontal, XCircle, Check } from 'lucide-react';
import { EnhancedCropBoxProps, MemorabiliaType } from '../cardDetection';
import MemorabiliaTypeSelector from '../MemorabiliaTypeSelector';
import MemorabiliaTypeIndicator from '../MemorabiliaTypeIndicator';

interface StagedCardProps {
  id: string;
  cropBox: EnhancedCropBoxProps;
  previewUrl: string;
  file?: File;
}

interface ExtractionPanelProps {
  cropBoxes: EnhancedCropBoxProps[];
  selectedCropIndex: number;
  stagedCards: StagedCardProps[];
  onMemorabiliaTypeChange: (index: number, type: MemorabiliaType) => void;
  onExtractSelected: () => void;
  onSelectStagedCard: (cardId: string) => void;
  onRemoveStagedCard: (cardId: string) => void;
  onCancel: () => void;
  enabledMemorabiliaTypes: MemorabiliaType[];
  autoEnhance: boolean;
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
  const hasSelectedCrop = selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length;
  
  return (
    <div className="h-full flex flex-col p-4">
      {hasSelectedCrop && (
        <div className="mb-4 pb-4 border-b">
          <h3 className="text-lg font-medium mb-2">Selected Item</h3>

          <div className="mb-3">
            <label className="text-sm text-gray-700 mb-1 block">Item Type</label>
            <MemorabiliaTypeSelector
              value={cropBoxes[selectedCropIndex].memorabiliaType || 'unknown'}
              onChange={(type) => onMemorabiliaTypeChange(selectedCropIndex, type)}
              className="w-full"
              enabledTypes={enabledMemorabiliaTypes}
            />
          </div>

          {autoEnhance && (
            <div className="bg-blue-50 rounded-md p-2 text-xs flex items-center">
              <SlidersHorizontal className="h-4 w-4 text-blue-500 mr-2" />
              <span>Auto-enhancement will optimize this {cropBoxes[selectedCropIndex].memorabiliaType || 'item'}</span>
            </div>
          )}

          <Button
            className="w-full mt-3"
            onClick={onExtractSelected}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Extract Selected Item
          </Button>
        </div>
      )}

      {/* Staged Cards Section */}
      <div className="mb-3">
        <h3 className="text-md font-medium mb-2">
          Extracted Items ({stagedCards.length})
        </h3>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {stagedCards.length === 0 ? (
          <div className="text-center p-6 text-gray-400 border-2 border-dashed rounded-md">
            <p className="text-sm">
              No items extracted yet. Select and extract items to preview them here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {stagedCards.map((card) => (
              <div key={card.id} className="relative bg-gray-50 border rounded-md overflow-hidden">
                <img 
                  src={card.previewUrl} 
                  alt="Staged card" 
                  className="w-full h-36 object-contain"
                />
                
                {card.cropBox.memorabiliaType && (
                  <div className="absolute top-1 left-1">
                    <MemorabiliaTypeIndicator 
                      type={card.cropBox.memorabiliaType} 
                      confidence={card.cropBox.confidence || 0.7}
                    />
                  </div>
                )}
                
                <div className="absolute top-1 right-1">
                  <button 
                    onClick={() => onRemoveStagedCard(card.id)}
                    className="p-1 bg-white/80 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <XCircle className="h-5 w-5 text-red-500" />
                  </button>
                </div>
                
                <div className="p-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => onSelectStagedCard(card.id)}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Create Card
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-none pt-4 border-t mt-4">
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
