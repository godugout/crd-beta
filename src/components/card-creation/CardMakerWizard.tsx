
import React, { useRef } from 'react';
import { useCardEffectsStack } from './hooks/useCardEffectsStack';
import { useLayers } from './hooks/useLayers';
import { useCardWizard, Step } from './hooks/useCardWizard';
import CardPreviewSidebar from './components/CardPreviewSidebar';
import CardWizardHeader from './components/CardWizardHeader';
import CardWizardFeatures from './components/CardWizardFeatures';
import CardWizardNavigation from './components/CardWizardNavigation';
import CardWizardStepContent from './components/CardWizardStepContent';
import { WizardStep, WIZARD_STEPS, INITIAL_CARD_STATE } from './constants/wizardSteps';
import { CardDesignState } from './CardCreator';

export interface CardMakerWizardProps {
  initialStep?: number;
}

const CardMakerWizard: React.FC<CardMakerWizardProps> = ({ initialStep = 0 }) => {
  const previewCanvasRef = useRef<HTMLDivElement>(null);
  
  const { effectStack, addEffect, removeEffect, updateEffectSettings, getEffectClasses } = useCardEffectsStack();
  const {
    layers,
    activeLayerId,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    setActiveLayer
  } = useLayers();

  const {
    currentStep,
    cardData,
    setCardData,
    handleNext,
    handleBack,
    handleImageCaptured,
    handleSaveCard,
    canProceedToNextStep
  } = useCardWizard(WIZARD_STEPS as Step[], INITIAL_CARD_STATE);

  const handleAddLayer = (type: 'image' | 'text' | 'shape') => {
    const newLayer = {
      type,
      content: type === 'text' ? 'New Text' : (type === 'image' ? '' : {}),
      position: { x: 50, y: 50, z: layers.length + 1 },
      size: { width: type === 'text' ? 'auto' : 100, height: type === 'text' ? 'auto' : 100 },
      rotation: 0,
      opacity: 1,
      visible: true,
      effectIds: []
    };
    
    addLayer(newLayer);
  };

  return (
    <div className="flex h-full w-full flex-col items-start gap-4 bg-default-background px-6 py-6">
      <div className="flex w-full grow shrink-0 basis-0 flex-wrap items-start gap-4 md:flex-row md:flex-wrap md:gap-6">
        <CardPreviewSection 
          cardData={cardData}
          layers={layers}
          activeLayerId={activeLayerId}
          effectClasses={getEffectClasses()}
          setActiveLayer={setActiveLayer}
          updateLayer={updateLayer}
          previewCanvasRef={previewCanvasRef}
        />
        
        <CardWizardSection
          wizardSteps={WIZARD_STEPS}
          currentStep={currentStep}
          cardData={cardData}
          setCardData={setCardData}
          onImageCaptured={handleImageCaptured}
          onNext={handleNext}
          onBack={handleBack}
          onSaveCard={handleSaveCard}
          canProceedToNextStep={canProceedToNextStep}
          layers={layers}
          activeLayerId={activeLayerId}
          setActiveLayer={setActiveLayer}
          updateLayer={updateLayer}
          deleteLayer={deleteLayer}
          moveLayerUp={moveLayerUp}
          moveLayerDown={moveLayerDown}
          onAddLayer={handleAddLayer}
          effectClasses={getEffectClasses()}
          effectStack={effectStack}
          addEffect={addEffect}
          removeEffect={removeEffect}
          updateEffectSettings={updateEffectSettings}
        />
      </div>
    </div>
  );
};

export default CardMakerWizard;
