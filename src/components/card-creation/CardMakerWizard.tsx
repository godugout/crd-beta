
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CardCreationStepper from './CardCreationStepper';
import CardUploadStep from './steps/CardUploadStep';
import CardDesignStep from './steps/CardDesignStep';
import CardEffectsStep from './steps/CardEffectsStep';
import CardTextStep from './steps/CardTextStep';
import CardPreviewStep from './steps/CardPreviewStep';
import CardPreview from './CardPreview';
import { CardDesignState, CardLayer, CardEffect } from './types/cardTypes';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface CardMakerWizardProps {
  cardData: CardDesignState;
  setCardData: (data: CardDesignState) => void;
  layers: CardLayer[];
  setLayers: (layers: CardLayer[]) => void;
  activeLayer: CardLayer | null;
  setActiveLayerId: (id: string) => void;
  updateLayer: (id: string, updates: Partial<CardLayer>) => void;
  effectStack: CardEffect[];
  addEffect: (name: string, settings?: any) => void;
  removeEffect: (id: string) => void;
  updateEffectSettings: (id: string, settings: any) => void;
  effectClasses: string;
  onSave: () => void;
  isEditing?: boolean;
}

const STEPS = [
  { name: "Upload", description: "Upload your image" },
  { name: "Design", description: "Customize the design" },
  { name: "Effects", description: "Add special effects" },
  { name: "Text", description: "Add text and details" },
  { name: "Preview", description: "Review and save" }
];

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
  onSave,
  isEditing = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const canProceed = () => {
    if (currentStep === 0) {
      return !!cardData.imageUrl && !!cardData.title.trim();
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || (stepIndex === currentStep + 1 && canProceed())) {
      setCurrentStep(stepIndex);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CardUploadStep 
            cardData={cardData}
            setCardData={setCardData}
            onContinue={handleNext}
          />
        );
      case 1:
        return (
          <CardDesignStep 
            cardData={cardData}
            setCardData={setCardData}
            layers={layers}
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayerId}
            addLayer={() => {}}
            updateLayer={updateLayer}
            deleteLayer={() => {}}
            moveLayerUp={() => {}}
            moveLayerDown={() => {}}
            onContinue={handleNext}
          />
        );
      case 2:
        return (
          <CardEffectsStep 
            effectStack={effectStack}
            addEffect={addEffect}
            removeEffect={removeEffect}
            updateEffectSettings={updateEffectSettings}
            onContinue={handleNext}
          />
        );
      case 3:
        return (
          <CardTextStep 
            cardData={cardData}
            setCardData={setCardData}
            onContinue={handleNext}
          />
        );
      case 4:
        return (
          <CardPreviewStep 
            cardData={cardData}
            effectClasses={effectClasses}
            onSave={onSave}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-[1400px] px-4 pt-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CardCreationStepper 
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
          
          <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 text-white"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={onSave}
                className="flex items-center gap-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 text-white"
              >
                <Save className="h-4 w-4" />
                {isEditing ? 'Update Card' : 'Create Card'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="order-first lg:order-last">
          <div className="sticky top-20">
            <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Preview</h2>
            <CardPreview 
              cardData={cardData}
              effectClasses={effectClasses}
            />
            
            {effectStack.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-[var(--text-primary)]">Applied Effects</h3>
                <div className="text-sm text-[var(--text-secondary)]">
                  <ul className="list-disc pl-5">
                    {effectStack.map(effect => (
                      <li key={effect.id}>{effect.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardMakerWizard;
