
import React from 'react';
import UploadTab from '../tabs/UploadTab';
import DesignTab from '../tabs/DesignTab';
import EffectsTab from '../tabs/EffectsTab';
import TextTab from '../tabs/TextTab';
import PreviewTab from '../tabs/PreviewTab';
import { CardEffect } from '../hooks/useCardEffectsStack';
import { CardDesignState, CardLayer } from '../types/cardTypes';

interface CardWizardStepContentProps {
  currentStep: number;
  cardData: CardDesignState;
  setCardData: (cardData: CardDesignState) => void;
  layers: CardLayer[];
  setLayers: (layers: CardLayer[]) => void;
  activeLayer: CardLayer | null;
  setActiveLayerId: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<CardLayer>) => void;
  effectStack: CardEffect[];
  addEffect: (name: string, settings?: any) => void;
  removeEffect: (id: string) => void;
  updateEffectSettings: (id: string, settings: any) => void;
  onContinue: () => void;
  effectClasses: string;
}

const CardWizardStepContent: React.FC<CardWizardStepContentProps> = ({
  currentStep,
  cardData,
  setCardData,
  layers,
  setLayers,
  activeLayer,
  setActiveLayerId,
  updateLayer,
  effectStack,
  addEffect,
  removeEffect,
  updateEffectSettings,
  onContinue,
  effectClasses
}) => {
  switch (currentStep) {
    case 0:
      return (
        <UploadTab
          cardData={cardData}
          setCardData={setCardData}
          onImageCaptured={(url: string) => {
            setCardData({...cardData, imageUrl: url});
            onContinue();
          }}
          onContinue={onContinue}
        />
      );
    case 1:
      return (
        <DesignTab
          cardData={cardData}
          setCardData={setCardData}
          layers={layers}
          activeLayerId={activeLayer?.id || null}
          onImageUpload={(url: string) => setCardData({...cardData, imageUrl: url})}
          onLayerSelect={setActiveLayerId}
          onLayerUpdate={updateLayer}
          onAddLayer={() => {}}
          onDeleteLayer={() => {}}
          onMoveLayerUp={() => {}}
          onMoveLayerDown={() => {}}
          onContinue={onContinue}
        />
      );
    case 2:
      return (
        <EffectsTab
          onContinue={onContinue}
          effectStack={effectStack}
          addEffect={addEffect}
          removeEffect={removeEffect}
          updateEffectSettings={updateEffectSettings}
        />
      );
    case 3:
      return (
        <TextTab
          onContinue={onContinue}
          cardData={cardData}
          setCardData={setCardData}
        />
      );
    case 4:
      return (
        <PreviewTab
          onSave={() => {console.log('Saving card:', cardData)}}
          cardImage={cardData.imageUrl}
          cardTitle={cardData.title}
          cardEffect={effectClasses}
          cardData={cardData}
        />
      );
    default:
      return null;
  }
};

export default CardWizardStepContent;
