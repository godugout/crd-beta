import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Sparkles, Upload, Palette, Type, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CardPreviewSidebar from './components/CardPreviewSidebar';
import UploadTab from './tabs/UploadTab';
import DesignTab from './tabs/DesignTab';
import EffectsTab from './tabs/EffectsTab';
import TextTab from './tabs/TextTab';
import PreviewTab from './tabs/PreviewTab';
import { CardDesignState } from './CardCreator';
import { useCardEffectsStack } from './hooks/useCardEffectsStack';
import { useLayers } from './hooks/useLayers';
import Stepper from '@/components/ui/stepper';
import { v4 as uuid } from 'uuid';

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

const CardMakerWizard: React.FC<CardMakerWizardProps> = ({ initialStep = 0 }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const navigate = useNavigate();
  const location = useLocation();
  const { step } = useParams<{ step?: string }>();
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

  useEffect(() => {
    if (step) {
      const stepIndex = steps.findIndex(s => s.path === step);
      if (stepIndex >= 0) {
        setCurrentStep(stepIndex);
      }
    } else if (location.pathname === '/card-creator') {
      navigate('/card-creator/upload', { replace: true });
    }
  }, [step, location, navigate]);

  const handleImageCaptured = (imageUrl: string) => {
    setCardData(prev => ({ ...prev, imageUrl }));
  };

  const goToStep = (step: number) => {
    if (currentStep === 0 && !cardData.imageUrl && step > 0) {
      toast.error('Please upload an image first');
      return;
    }
    
    if (step < 0 || step >= steps.length) return;
    
    navigate(`/card-creator/${steps[step].path}`);
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
  
  const handleSaveCard = () => {
    const cardId = uuid();
    
    const cardToSave = {
      id: cardId,
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '',
      tags: cardData.tags,
      designMetadata: {
        borderColor: cardData.borderColor,
        backgroundColor: cardData.backgroundColor,
        borderRadius: cardData.borderRadius,
        layers,
        effects: effectStack
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Saving card:', cardToSave);
    
    toast.success('Card saved successfully!');
    
    setTimeout(() => {
      navigate('/cards');
    }, 1500);
  };

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
        return (
          <EffectsTab onContinue={handleNext} />
        );
      case 3:
        return (
          <TextTab onContinue={handleNext} />
        );
      case 4:
        return (
          <PreviewTab 
            onSave={handleSaveCard}
            cardImage={cardData.imageUrl || undefined}
            cardTitle={cardData.title}
            cardEffect={getEffectClasses()}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-start gap-4 bg-default-background px-6 py-6">
      <div className="flex w-full grow shrink-0 basis-0 flex-wrap items-start gap-4 md:flex-row md:flex-wrap md:gap-6">
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
            {currentStep < steps.length - 1 ? (
              <Button
                variant="default"
                onClick={handleNext}
                disabled={currentStep === 0 && !cardData.imageUrl}
                className="flex items-center gap-1"
              >
                Next <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleSaveCard}
                className="flex items-center gap-1"
              >
                Save Card
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardMakerWizard;
