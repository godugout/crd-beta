
import React from 'react';
import { CardDesignState, CardLayer } from '../CardCreator';
import UploadTab from '../tabs/UploadTab';
import DesignTab from '../tabs/DesignTab';
import EffectsTab from '../tabs/EffectsTab';
import TextTab from '../tabs/TextTab';
import PreviewTab from '../tabs/PreviewTab';

interface CardWizardStepContentProps {
  currentStep: number;
  cardData: CardDesignState;
  setCardData: React.Dispatch<React.SetStateAction<CardDesignState>>;
  onImageCaptured: (imageUrl: string) => void;
  onNext: () => void;
  onSaveCard: () => void;
  layers: CardLayer[];
  activeLayerId: string | null;
  setActiveLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<CardLayer>) => void;
  deleteLayer: (layerId: string) => void;
  moveLayerUp: (layerId: string) => void;
  moveLayerDown: (layerId: string) => void;
  onAddLayer: (type: 'image' | 'text' | 'shape') => void;
  effectClasses: string;
}

const CardWizardStepContent: React.FC<CardWizardStepContentProps> = ({
  currentStep,
  cardData,
  setCardData,
  onImageCaptured,
  onNext,
  onSaveCard,
  layers,
  activeLayerId,
  setActiveLayer,
  updateLayer,
  deleteLayer,
  moveLayerUp,
  moveLayerDown,
  onAddLayer,
  effectClasses
}) => {
  switch (currentStep) {
    case 0:
      return (
        <UploadTab 
          cardData={cardData}
          setCardData={setCardData}
          onImageCaptured={onImageCaptured}
          onContinue={onNext}
        />
      );
    case 1:
      return (
        <DesignTab
          cardData={cardData}
          setCardData={setCardData}
          layers={layers}
          activeLayerId={activeLayerId}
          onImageUpload={onImageCaptured}
          onLayerSelect={setActiveLayer}
          onLayerUpdate={updateLayer}
          onAddLayer={onAddLayer}
          onDeleteLayer={deleteLayer}
          onMoveLayerUp={moveLayerUp}
          onMoveLayerDown={moveLayerDown}
          onContinue={onNext}
        />
      );
    case 2:
      return (
        <EffectsTab onContinue={onNext} />
      );
    case 3:
      return (
        <TextTab onContinue={onNext} />
      );
    case 4:
      return (
        <PreviewTab 
          onSave={onSaveCard}
          cardImage={cardData.imageUrl || undefined}
          cardTitle={cardData.title}
          cardEffect={effectClasses}
        />
      );
    default:
      return <div>Unknown step</div>;
  }
};

export default CardWizardStepContent;
