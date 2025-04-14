
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CardEffect } from './hooks/useCardEffectsStack';
import { WIZARD_STEPS } from './constants/wizardSteps';
import CardWizardStepContent from './components/CardWizardStepContent';
import CardPreviewSidebar from './components/CardPreviewSidebar';
import CardWizardSteps from './components/CardWizardSteps';
import CardWizardHeader from './components/CardWizardHeader';
import CardWizardFeatures from './components/CardWizardFeatures';
import { CardDesignState, CardLayer } from './types/cardTypes';

interface CardMakerWizardProps {
  cardData?: CardDesignState;
  setCardData?: (cardData: CardDesignState) => void;
  layers?: CardLayer[];
  setLayers?: (layers: CardLayer[]) => void;
  activeLayer?: CardLayer | null;
  setActiveLayerId?: (layerId: string) => void;
  updateLayer?: (layerId: string, updates: Partial<CardLayer>) => void;
  effectStack?: CardEffect[];
  addEffect?: (name: string, settings?: any) => void;
  removeEffect?: (id: string) => void;
  updateEffectSettings?: (id: string, settings: any) => void;
  effectClasses?: string;
}

const CardMakerWizard: React.FC<CardMakerWizardProps> = ({
  cardData = {
    title: '',
    description: '',
    tags: [],
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    imageUrl: null,
  },
  setCardData = () => {},
  layers = [],
  setLayers = () => {},
  activeLayer = null,
  setActiveLayerId = () => {},
  updateLayer = () => {},
  effectStack = [],
  addEffect = () => {},
  removeEffect = () => {},
  updateEffectSettings = () => {},
  effectClasses = '',
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
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
      <CardPreviewSection 
        cardData={cardData}
        layers={layers}
        activeLayer={activeLayer}
        setActiveLayerId={setActiveLayerId}
        updateLayer={updateLayer}
        effectClasses={effectClasses}
        previewCanvasRef={previewCanvasRef}
      />

      <WizardContentSection
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
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
        effectClasses={effectClasses}
        goToNextStep={goToNextStep}
        goToPreviousStep={goToPreviousStep}
      />
    </div>
  );
};

export default CardMakerWizard;
