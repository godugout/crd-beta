
import React from 'react';
import { Check, Crop, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CropBoxProps } from './CropBox';

interface StagedCardProps {
  id: string;
  cropBox: CropBoxProps;
  previewUrl: string;
}

interface EditorSidebarProps {
  cropBoxes: CropBoxProps[];
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  onExtractCard: () => void;
  onCancel: () => void;
  stagedCards: StagedCardProps[];
  onSelectStagedCard: (id: string) => void;
  onRemoveStagedCard: (id: string) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  cropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  onExtractCard,
  onCancel,
  stagedCards,
  onSelectStagedCard,
  onRemoveStagedCard
}) => {
  return (
    <div className="h-full flex flex-col p-4">
      <h3 className="font-medium mb-4">Crop Areas</h3>
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 mb-6">
          {cropBoxes.map((box, index) => (
            <div 
              key={index}
              className={cn(
                "border rounded-lg overflow-hidden cursor-pointer",
                selectedCropIndex === index ? "ring-2 ring-cardshow-blue" : ""
              )}
              onClick={() => setSelectedCropIndex(index)}
            >
              <div className="aspect-[2.5/3.5] relative bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-cardshow-slate-light">
                  Area {index + 1}
                </span>
                
                <div className="absolute right-1 top-1">
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
        
        <div className="flex justify-end mb-6">
          <button
            onClick={onExtractCard}
            className="px-3 py-1.5 bg-cardshow-blue text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-1 text-sm"
          >
            <Crop className="h-3.5 w-3.5" />
            Add to Staging
          </button>
        </div>
        
        {stagedCards.length > 0 && (
          <>
            <h3 className="font-medium mb-2">Staged Cards</h3>
            <div className="grid grid-cols-2 gap-2">
              {stagedCards.map((card) => (
                <div key={card.id} className="relative group">
                  <div 
                    className="border rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-cardshow-blue transition-all"
                    onClick={() => onSelectStagedCard(card.id)}
                  >
                    <div className="aspect-[2.5/3.5] relative">
                      <img 
                        src={card.previewUrl} 
                        alt="Staged card preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveStagedCard(card.id)}
                    className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-cardshow-slate mb-4">
          {stagedCards.length > 0 
            ? "Click on a staged card to select it for your digital card."
            : "Create crop areas and add them to the staging area."}
        </p>
        
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          
          {stagedCards.length > 0 && (
            <button
              onClick={() => onSelectStagedCard(stagedCards[stagedCards.length - 1].id)}
              className="px-4 py-2 bg-cardshow-blue text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Use Latest
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
