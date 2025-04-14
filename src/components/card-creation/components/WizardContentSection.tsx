import React from 'react';
import CardWizardSteps from './CardWizardSteps';
import CardWizardStepContent from './CardWizardStepContent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WIZARD_STEPS } from '../constants/wizardSteps';
import { CardDesignState, CardLayer } from '../types/cardTypes';
import { CardEffect } from '../types/cardTypes';
import WizardNavigationButtons from './WizardNavigationButtons';

interface WizardContentSectionProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
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
  effectClasses: string;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const WizardContentSection: React.FC<WizardContentSectionProps> = ({
  currentStep,
  setCurrentStep,
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
  effectClasses,
  goToNextStep,
  goToPreviousStep
}) => {
  return (
    <div className="md:col-span-3">
      <CardWizardSteps 
        steps={WIZARD_STEPS} 
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep}
      />
      
      <div className="mt-8">
        <CardWizardStepContent 
          currentStep={currentStep}
          cardData={cardData}
          setCardData={setCardData}
          layers={layers}
          setLayers={setLayers}
          activeLayer={activeLayer}
          setActiveLayerId={setActiveLayerId}
          updateLayer={updateLayer}
          effectStack={effectStack}
          addEffect={addEffect}
          removeEffect={removeEffect}
          updateEffectSettings={updateEffectSettings}
          onContinue={goToNextStep}
          effectClasses={effectClasses}
        />
      </div>
      
      <WizardNavigationButtons 
        currentStep={currentStep} 
        onNext={goToNextStep} 
        onBack={goToPreviousStep} 
      />
    </div>
  );
};

export default WizardContentSection;
