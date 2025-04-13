
import React from 'react';
import { Upload, Palette, Sparkles, Type, Eye } from 'lucide-react';
import Stepper from '@/components/ui/stepper';
import { CardDesignState } from './CardCreator';
import { useCardEffectsStack } from './hooks/useCardEffectsStack';
import { useLayers } from './hooks/useLayers';
import { useCardWizard } from './hooks/useCardWizard';
import CardPreviewSidebar from './components/CardPreviewSidebar';
import CardWizardHeader from './components/CardWizardHeader';
import CardWizardFeatures from './components/CardWizardFeatures';
import CardWizardNavigation from './components/CardWizardNavigation';
import CardWizardStepContent from './components/CardWizardStepContent';

export interface CardMakerWizardProps {
  initialStep?: number;
}

const steps = [
  { name: 'Upload', icon: Upload, path: 'upload' },
  { name: 'Design', icon: Palette, path: 'design' },
  { name: 'Effects', icon: Sparkles, path: 'effects' },
  { name: 'Text', icon: Type, path: 'text' },
  { name: 'Preview', icon: Eye, path: 'preview' },
];

const initialCardState: CardDesignState = {
  title: '',
  description: '',
  tags: [],
  borderColor: '#000000',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  imageUrl: null,
};

const CardMakerWizard: React.FC<CardMakerWizardProps> = ({ initialStep = 0 }) => {
  const previewCanvasRef = React.useRef<HTMLDivElement>(null);
  
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
  } = useCardWizard(steps, initialCardState);

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
        <div className="flex max-w-[576px] grow shrink-0 basis-0 flex-col items-start gap-2 self-stretch rounded-md bg-card px-8 py-8 shadow-lg">
          <CardWizardHeader />
          
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start justify-center gap-4">
            <div className="relative w-full aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-lg">
              <CardPreviewSidebar
                cardData={cardData}
                layers={layers}
                activeLayerId={activeLayerId}
                effectClasses={getEffectClasses()}
                onLayerSelect={setActiveLayer}
                onLayerUpdate={updateLayer}
                previewCanvasRef={previewCanvasRef}
                hideControls={true}
              />
            </div>
          </div>
          
          <CardWizardFeatures />
        </div>
        
        <div className="flex grow shrink-0 basis-0 flex-col items-start justify-center gap-6 self-stretch px-6 py-6 md:px-0 md:py-0">
          <Stepper>
            {steps.map((step, index) => (
              <Stepper.Step
                key={index}
                variant={index === currentStep ? 'active' : index < currentStep ? 'completed' : 'inactive'}
                stepNumber={(index + 1).toString()}
                label={step.name}
                firstStep={index === 0}
                lastStep={index === steps.length - 1}
              />
            ))}
          </Stepper>
          
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start justify-center gap-6">
            <h1 className="w-full text-2xl font-bold text-default-font">
              {steps[currentStep].name} Your Card
            </h1>
            
            <div className="w-full bg-white rounded-lg border shadow-sm p-6">
              <CardWizardStepContent 
                currentStep={currentStep}
                cardData={cardData}
                setCardData={setCardData}
                onImageCaptured={handleImageCaptured}
                onNext={handleNext}
                onSaveCard={handleSaveCard}
                layers={layers}
                activeLayerId={activeLayerId}
                setActiveLayer={setActiveLayer}
                updateLayer={updateLayer}
                deleteLayer={deleteLayer}
                moveLayerUp={moveLayerUp}
                moveLayerDown={moveLayerDown}
                onAddLayer={handleAddLayer}
                effectClasses={getEffectClasses()}
              />
            </div>
          </div>
          
          <CardWizardNavigation 
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={currentStep < steps.length - 1 ? handleNext : handleSaveCard}
            onBack={handleBack}
            canProceed={canProceedToNextStep}
          />
        </div>
      </div>
    </div>
  );
};

export default CardMakerWizard;
