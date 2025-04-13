
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Upload, Palette, Type, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Stepper from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import CardPreviewSidebar from './components/CardPreviewSidebar';
import UploadTab from './tabs/UploadTab';
import DesignTab from './tabs/DesignTab';
import EffectsTab from './tabs/EffectsTab';
import TextTab from './tabs/TextTab';
import PreviewTab from './tabs/PreviewTab';
import { CardDesignState } from './CardCreator';
import { useCardEffectsStack } from './hooks/useCardEffectsStack';
import { useLayers } from './hooks/useLayers';

export interface CardMakerWizardProps {
  initialStep?: number;
}

const steps = [
  { name: 'Upload', icon: Upload },
  { name: 'Design', icon: Palette },
  { name: 'Effects', icon: Sparkles },
  { name: 'Text', icon: Type },
  { name: 'Preview', icon: Eye },
];

const CardMakerWizard: React.FC<CardMakerWizardProps> = ({ initialStep = 0 }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const navigate = useNavigate();
  const location = useLocation();
  const previewCanvasRef = React.useRef<HTMLDivElement>(null);
  
  // Initialize card state
  const [cardData, setCardData] = useState<CardDesignState>({
    title: '',
    description: '',
    tags: [],
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    imageUrl: null,
  });

  // Initialize card effects and layers
  const { effectStack, addEffect, removeEffect, toggleEffect, getEffectClasses } = useCardEffectsStack();
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

  // Handle navigation between steps
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('upload')) setCurrentStep(0);
    else if (path.includes('design')) setCurrentStep(1);
    else if (path.includes('effects')) setCurrentStep(2);
    else if (path.includes('text')) setCurrentStep(3);
    else if (path.includes('preview')) setCurrentStep(4);
  }, [location]);

  const handleImageCaptured = (imageUrl: string) => {
    setCardData(prev => ({ ...prev, imageUrl }));
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= steps.length) return;
    
    // Navigate to the appropriate route
    const routes = ['upload', 'design', 'effects', 'text', 'preview'];
    navigate(`/card-creator/${routes[step]}`);
    setCurrentStep(step);
  };

  const handleNext = () => goToStep(currentStep + 1);
  const handleBack = () => goToStep(currentStep - 1);

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

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <UploadTab 
            cardData={cardData}
            setCardData={setCardData}
            onImageCaptured={handleImageCaptured}
            onContinue={handleNext}
          />
        );
      case 1:
        return (
          <DesignTab
            cardData={cardData}
            setCardData={setCardData}
            layers={layers}
            activeLayerId={activeLayerId}
            onImageUpload={handleImageCaptured}
            onLayerSelect={setActiveLayer}
            onLayerUpdate={updateLayer}
            onAddLayer={handleAddLayer}
            onDeleteLayer={deleteLayer}
            onMoveLayerUp={moveLayerUp}
            onMoveLayerDown={moveLayerDown}
            onContinue={handleNext}
          />
        );
      case 2:
        return <EffectsTab onContinue={handleNext} />;
      case 3:
        return <TextTab onContinue={handleNext} />;
      case 4:
        return <PreviewTab onSave={() => console.log('Saving card:', cardData, layers)} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-start gap-4 bg-default-background px-6 py-6">
      <div className="flex w-full grow shrink-0 basis-0 flex-wrap items-start gap-4 md:flex-row md:flex-wrap md:gap-6">
        {/* Left panel - Card preview & info */}
        <div className="flex max-w-[576px] grow shrink-0 basis-0 flex-col items-start gap-2 self-stretch rounded-md bg-card px-8 py-8 shadow-lg">
          <div className="mb-4 flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-litmus-green" />
            <h2 className="text-2xl font-bold">Create your <span className="text-litmus-green">CRD</span></h2>
          </div>
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
          <div className="mt-4 flex w-full items-start gap-6 justify-center">
            <div className="flex grow shrink-0 basis-0 flex-col items-center gap-2">
              <Upload className="text-xl text-litmus-green" />
              <span className="text-xs font-medium text-center">
                Upload Card Image
              </span>
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-center gap-2">
              <Palette className="text-xl text-litmus-green" />
              <span className="text-xs font-medium text-center">
                Customize Design
              </span>
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-center gap-2">
              <Sparkles className="text-xl text-litmus-green" />
              <span className="text-xs font-medium text-center">
                Add Special Effects
              </span>
            </div>
          </div>
        </div>
        
        {/* Right panel - Step content */}
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
              {renderStepContent()}
            </div>
          </div>
          
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Back
            </Button>
            <Button
              variant="default"
              onClick={handleNext}
              disabled={currentStep === steps.length - 1 || (currentStep === 0 && !cardData.imageUrl)}
              className="flex items-center gap-1"
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardMakerWizard;
