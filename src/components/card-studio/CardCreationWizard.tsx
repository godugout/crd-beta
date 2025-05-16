
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { v4 as uuidv4 } from 'uuid';
import ImageStep from './steps/ImageStep';
import TextStep from './steps/TextStep';
import DesignStep from './steps/DesignStep';
import EffectsStep from './steps/EffectsStep';
import FinalizeStep from './steps/FinalizeStep';
import PreviewStep from './steps/PreviewStep';
import StepperControl from './components/StepperControl';

interface CardCreationWizardProps {
  initialCard?: Partial<Card>;
  onComplete: (card: Card) => void;
  onCancel: () => void;
}

const DEFAULT_MARKET_METADATA = {
  isPrintable: false,
  isForSale: false,
  includeInCatalog: false,
  price: 0,
  currency: 'USD',
  availableForSale: false,
  editionSize: 1,
  editionNumber: 1,
};

const CardCreationWizard: React.FC<CardCreationWizardProps> = ({
  initialCard,
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState(0);
  const [cardData, setCardData] = useState<Partial<Card>>({
    id: initialCard?.id || uuidv4(),
    title: initialCard?.title || '',
    description: initialCard?.description || '',
    imageUrl: initialCard?.imageUrl || '',
    thumbnailUrl: initialCard?.thumbnailUrl || '',
    tags: initialCard?.tags || [],
    effects: initialCard?.effects || [],
    userId: initialCard?.userId || '',
    createdAt: initialCard?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designMetadata: initialCard?.designMetadata || {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        shadowColor: 'rgba(0,0,0,0.3)',
        frameWidth: 4,
        frameColor: '#e0e0e0'
      },
      textStyle: {
        fontFamily: 'Inter',
        titleColor: '#1a1a1a',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#555555'
      },
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard',
      },
      marketMetadata: DEFAULT_MARKET_METADATA
    }
  });

  const handleUpdate = (updates: Partial<Card>) => {
    setCardData(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleEffectUpdate = (effects: string[]) => {
    setCardData(prev => ({
      ...prev,
      effects,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleComplete = () => {
    // Ensure all required fields are set
    const completedCard = {
      ...cardData,
      designMetadata: {
        ...cardData.designMetadata,
        marketMetadata: {
          ...DEFAULT_MARKET_METADATA,
          ...(cardData.designMetadata?.marketMetadata || {})
        }
      }
    } as Card;
    
    onComplete(completedCard);
  };

  const steps = [
    { title: 'Image', component: <ImageStep cardData={cardData} onUpdate={handleUpdate} /> },
    { title: 'Text', component: <TextStep cardData={cardData} onUpdate={handleUpdate} /> },
    { title: 'Design', component: <DesignStep cardData={cardData} onUpdate={handleUpdate} /> },
    { title: 'Effects', component: <EffectsStep cardData={cardData} onUpdateEffects={handleEffectUpdate} /> },
    { title: 'Finalize', component: <FinalizeStep cardData={cardData} onUpdate={handleUpdate} /> },
    { title: 'Preview', component: <PreviewStep cardData={cardData} /> },
  ];

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Your Card</h1>
      
      <div className="mb-8">
        {steps[step].component}
      </div>
      
      <StepperControl
        currentStep={step + 1}
        totalSteps={steps.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onComplete={handleComplete}
        onCancel={onCancel}
        isFinalStep={step === steps.length - 2}
      />
    </div>
  );
};

export default CardCreationWizard;
