
import React from 'react';
import Stepper from '@/components/ui/stepper';
import { CardDesignState, CardLayer } from '../CardCreator';
import CardWizardStepContent from './CardWizardStepContent';
import CardWizardNavigation from './CardWizardNavigation';
import { WizardStep } from '../constants/wizardSteps';
import { CardEffect } from '../hooks/useCardEffectsStack';

interface CardWizardSectionProps {
  wizardSteps: WizardStep[];
  currentStep: number;
  cardData: CardDesignState;
  setCardData: React.Dispatch<React.SetStateAction<CardDesignState>>;
  onImageCaptured: (imageUrl: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveCard: () => void;
  canProceedToNextStep: boolean;
  layers: CardLayer[];
  activeLayerId: string | null;
  setActiveLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<CardLayer>) => void;
  deleteLayer: (layerId: string) => void;
  moveLayerUp: (layerId: string) => void;
  moveLayerDown: (layerId: string) => void;
  onAddLayer: (type: 'image' | 'text' | 'shape') => void;
  effectClasses: string;
  effectStack: CardEffect[];
  addEffect: (name: string, settings?: any) => void;
  removeEffect: (id: string) => void;
  updateEffectSettings: (id: string, settings: any) => void;
}

const CardWizardSection: React.FC<CardWizardSectionProps> = ({
  wizardSteps,
  currentStep,
  cardData,
  setCardData,
  onImageCaptured,
  onNext,
  onBack,
  onSaveCard,
  canProceedToNextStep,
  layers,
  activeLayerId,
  setActiveLayer,
  updateLayer,
  deleteLayer,
  moveLayerUp,
  moveLayerDown,
  onAddLayer,
  effectClasses,
  effectStack,
  addEffect,
  removeEffect,
  updateEffectSettings
}) => {
  return (
    <div className="flex grow shrink-0 basis-0 flex-col items-start justify-center gap-6 self-stretch px-6 py-6 md:px-0 md:py-0">
      <Stepper>
        {wizardSteps.map((step, index) => (
          <Stepper.Step
            key={index}
            variant={index === currentStep ? 'active' : index < currentStep ? 'completed' : 'inactive'}
            stepNumber={(index + 1).toString()}
            label={step.name}
            firstStep={index === 0}
            lastStep={index === wizardSteps.length - 1}
          />
        ))}
      </Stepper>
      
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start justify-center gap-6">
        <h1 className="w-full text-2xl font-bold text-default-font">
          {wizardSteps[currentStep].name} Your Card
        </h1>
        
        <div className="w-full bg-white rounded-lg border shadow-sm p-6">
          <CardWizardStepContent 
            currentStep={currentStep}
            cardData={cardData}
            setCardData={setCardData}
            onImageCaptured={onImageCaptured}
            onNext={onNext}
            onSaveCard={onSaveCard}
            layers={layers}
            activeLayerId={activeLayerId}
            setActiveLayer={setActiveLayer}
            updateLayer={updateLayer}
            deleteLayer={deleteLayer}
            moveLayerUp={moveLayerUp}
            moveLayerDown={moveLayerDown}
            onAddLayer={onAddLayer}
            effectClasses={effectClasses}
            effectStack={effectStack}
            addEffect={addEffect}
            removeEffect={removeEffect}
            updateEffectSettings={updateEffectSettings}
          />
        </div>
      </div>
      
      <CardWizardNavigation 
        currentStep={currentStep}
        totalSteps={wizardSteps.length}
        onNext={currentStep < wizardSteps.length - 1 ? onNext : onSaveCard}
        onBack={onBack}
        canProceed={canProceedToNextStep}
      />
    </div>
  );
};

export default CardWizardSection;
