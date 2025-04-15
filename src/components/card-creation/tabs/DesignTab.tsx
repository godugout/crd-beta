
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import CardEditorSidebar from '../CardEditorSidebar';
import CardLayersPanel from '../CardLayersPanel';
import { CardDesignState, CardLayer } from '../CardCreator';

interface DesignTabProps {
  cardData: CardDesignState;
  setCardData: React.Dispatch<React.SetStateAction<CardDesignState>>;
  layers: CardLayer[];
  activeLayerId: string | null;
  onImageUpload: (imageUrl: string) => void;
  onLayerSelect: (layerId: string) => void;
  onLayerUpdate: (layerId: string, updates: Partial<CardLayer>) => void;
  onAddLayer: (type: 'image' | 'text' | 'shape') => void;
  onDeleteLayer: (layerId: string) => void;
  onMoveLayerUp: (layerId: string) => void;
  onMoveLayerDown: (layerId: string) => void;
  onContinue: () => void;
}

const DesignTab: React.FC<DesignTabProps> = ({
  cardData,
  setCardData,
  layers,
  activeLayerId,
  onImageUpload,
  onLayerSelect,
  onLayerUpdate,
  onAddLayer,
  onDeleteLayer,
  onMoveLayerUp,
  onMoveLayerDown,
  onContinue
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Design Your Card</h2>
      {cardData.imageUrl ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardEditorSidebar
              cardData={cardData}
              onChange={setCardData}
              onImageUpload={onImageUpload}
            />
            
            <CardLayersPanel
              layers={layers}
              activeLayerId={activeLayerId}
              onLayerSelect={onLayerSelect}
              onLayerUpdate={onLayerUpdate}
              onAddLayer={onAddLayer}
              onDeleteLayer={onDeleteLayer}
              onMoveLayerUp={onMoveLayerUp}
              onMoveLayerDown={onMoveLayerDown}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
              onClick={onContinue}
            >
              Continue <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p>Upload a card image first to start designing</p>
        </div>
      )}
    </div>
  );
};

export default DesignTab;
