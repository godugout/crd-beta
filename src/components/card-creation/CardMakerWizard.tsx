
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CardDesignState, CardLayer } from '../CardCreator';
import { WIZARD_STEPS } from './constants/wizardSteps';
import { CardEffect } from './hooks/useCardEffectsStack';
import UploadTab from './tabs/UploadTab';
import DesignTab from './tabs/DesignTab';
import EffectsTab from './tabs/EffectsTab';
import TextTab from './tabs/TextTab';
import PreviewTab from './tabs/PreviewTab';
import CardPreviewSidebar from './components/CardPreviewSidebar';
import CardWizardSteps from './components/CardWizardSteps';
import CardWizardHeader from './components/CardWizardHeader';
import CardWizardFeatures from './components/CardWizardFeatures';

interface CardMakerWizardProps {
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
}

const CardMakerWizard: React.FC<CardMakerWizardProps> = ({
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
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const previewCanvasRef = useRef<HTMLDivElement>(null);
  
  const goToNextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="grid md:grid-cols-5 gap-8">
      {/* Card Preview Section */}
      <div className="md:col-span-2 flex max-w-[576px] grow shrink-0 basis-0 flex-col items-start gap-2 self-stretch rounded-md bg-card px-8 py-8 shadow-lg">
        <CardWizardHeader />
        
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start justify-center gap-4">
          <div className="relative w-full aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-lg">
            <CardPreviewSidebar
              cardData={cardData}
              layers={layers}
              activeLayerId={activeLayer?.id || null}
              effectClasses={effectClasses}
              onLayerSelect={setActiveLayerId}
              onLayerUpdate={updateLayer}
              previewCanvasRef={previewCanvasRef}
              hideControls={true}
            />
          </div>
        </div>
        
        <CardWizardFeatures />
      </div>

      {/* Wizard Content Section */}
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
          />
        </div>
        
        <div className={`flex ${currentStep === 0 ? 'justify-end' : 'justify-between'} mt-6`}>
          {currentStep > 0 && (
            <Button 
              variant="outline"
              onClick={goToPreviousStep}
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </Button>
          )}
          {currentStep < WIZARD_STEPS.length - 1 && (
            <Button 
              className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
              onClick={goToNextStep}
            >
              Continue <ArrowRight size={16} className="ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

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
  onContinue
}) => {
  switch (currentStep) {
    case 0:
      return (
        <UploadTab
          onContinue={onContinue}
          layers={layers}
          setLayers={setLayers}
          activeLayerId={activeLayer?.id || null}
          setActiveLayerId={setActiveLayerId}
          updateLayer={updateLayer}
        />
      );
    case 1:
      return (
        <DesignTab
          onContinue={onContinue}
          cardData={cardData}
          setCardData={setCardData}
          layers={layers}
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
          cardData={cardData}
        />
      );
    default:
      return null;
  }
};

export default CardMakerWizard;
