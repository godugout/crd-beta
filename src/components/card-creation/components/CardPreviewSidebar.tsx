
import React from 'react';
import { Upload } from 'lucide-react';
import { CardDesignState, CardLayer } from '../CardCreator';
import CardPreviewCanvas from '../CardPreviewCanvas';

interface CardPreviewSidebarProps {
  cardData: CardDesignState;
  layers: CardLayer[];
  activeLayerId: string | null;
  effectClasses: string;
  onLayerSelect: (layerId: string) => void;
  onLayerUpdate: (layerId: string, updates: Partial<CardLayer>) => void;
  previewCanvasRef: React.RefObject<HTMLDivElement>;
}

const CardPreviewSidebar: React.FC<CardPreviewSidebarProps> = ({
  cardData,
  layers,
  activeLayerId,
  effectClasses,
  onLayerSelect,
  onLayerUpdate,
  previewCanvasRef
}) => {
  return (
    <div className="bg-gray-900 text-white rounded-lg overflow-hidden h-full flex flex-col shadow-lg">
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <h3 className="font-medium">Preview</h3>
        <span className="text-xs text-gray-400">Live view</span>
      </div>
      <div className="flex-grow flex items-center justify-center p-6 relative bg-gray-950">
        {cardData.imageUrl ? (
          <CardPreviewCanvas
            ref={previewCanvasRef}
            cardData={cardData}
            layers={layers}
            activeLayerId={activeLayerId}
            onLayerSelect={onLayerSelect}
            onLayerUpdate={onLayerUpdate}
            effectClasses={effectClasses}
          />
        ) : (
          <div className="text-center text-gray-400 p-10 w-full">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 mb-4 text-gray-600" />
              <p className="mb-2">Upload an image to preview</p>
              <p className="text-xs text-gray-500">Your CRD will appear here</p>
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-800 p-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">{cardData.title || "No title yet"}</h4>
          <p className="text-xs text-gray-400">{cardData.description || "Add a description to your CRD"}</p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
          <span className="text-xs text-gray-500">Auto saving</span>
          <div className="flex space-x-1">
            {cardData.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreviewSidebar;
