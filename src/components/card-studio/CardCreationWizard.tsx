
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardTemplate } from '@/components/card-templates/TemplateLibrary';
import { Card } from '@/lib/types/cardTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Undo, Redo } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useCards } from '@/context/CardContext';
import { toastUtils } from '@/lib/utils/toast-utils';
import WizardStepper from './WizardStepper';
import CardCanvas from './canvas/CardCanvas';
import ImageUploadStep from './steps/ImageUploadStep';
import DesignStep from './steps/DesignStep';
import ElementsStep from './steps/ElementsStep';
import EffectsStep from './steps/EffectsStep';
import TextStep from './steps/TextStep';
import FinalizeStep from './steps/FinalizeStep';
import { v4 as uuidv4 } from 'uuid';

interface CardCreationWizardProps {
  initialTemplate?: CardTemplate | null;
  initialData?: Partial<Card>;
  onComplete: (card: Card) => void;
  onCancel: () => void;
}

const STEPS = [
  { key: 'upload', label: 'Upload Image' },
  { key: 'design', label: 'Design' },
  { key: 'elements', label: 'Elements' },
  { key: 'effects', label: 'Effects' },
  { key: 'text', label: 'Text' },
  { key: 'finalize', label: 'Finalize' },
];

// Default design metadata to ensure we have the properties we need
const DEFAULT_DESIGN_METADATA = {
  cardStyle: {
    template: 'classic',
    effect: 'none',
    borderRadius: '8px',
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0,0,0,0.2)',
    frameWidth: 2,
    frameColor: '#000000',
  },
  textStyle: {
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#000000',
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333',
  },
  cardMetadata: {
    category: 'general',
    series: 'base',
    cardType: 'standard',
  },
  marketMetadata: {
    price: 0,
    currency: 'USD',
    availableForSale: false,
    editionSize: 1,
    editionNumber: 1,
  }
};

const CardCreationWizard: React.FC<CardCreationWizardProps> = ({
  initialTemplate,
  initialData,
  onComplete,
  onCancel
}) => {
  const navigate = useNavigate();
  const { addCard } = useCards();
  const [currentStep, setCurrentStep] = useState(0);
  const [cardData, setCardData] = useState<Partial<Card>>({
    title: '',
    description: '',
    imageUrl: '',
    tags: [],
    player: '',
    team: '',
    year: '',
    effects: [],
    designMetadata: DEFAULT_DESIGN_METADATA,
    ...initialData,
  });

  // Set up undo/redo history
  const { 
    state: cardState,
    setState: setCardState,
    canUndo,
    canRedo,
    undo,
    redo,
    addToHistory
  } = useUndoRedo<Partial<Card>>(cardData);

  // Update our working cardData from the undo/redo state
  useEffect(() => {
    setCardData(cardState);
  }, [cardState]);

  // When user makes changes, add to history
  const handleCardUpdate = useCallback((updates: Partial<Card>) => {
    const updatedCard = { ...cardData, ...updates };
    setCardData(updatedCard);
    addToHistory(updatedCard);
  }, [cardData, addToHistory]);

  // Set up autosave
  const { 
    lastSaved,
    isSaving,
    saveStatus
  } = useAutoSave({
    data: cardData,
    key: `card_draft_${initialTemplate?.id || 'new'}`,
    saveInterval: 30000 // 30 seconds
  });

  // Navigate between steps
  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Final save process
  const handleSave = async () => {
    try {
      // Ensure we have required fields
      if (!cardData.title || !cardData.imageUrl) {
        toastUtils.error(
          "Missing information",
          "Please provide a title and image for your card"
        );
        return;
      }

      // Create a complete card
      const newCard = await addCard({
        ...cardData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Card);

      toastUtils.success(
        "Success!",
        "Your card has been created successfully."
      );

      onComplete(newCard);
    } catch (error) {
      toastUtils.error(
        "Error saving card",
        "There was a problem saving your card. Please try again."
      );
      console.error("Error saving card:", error);
    }
  };

  // Determine if we can proceed to the next step
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Image upload
        return Boolean(cardData.imageUrl);
      default:
        return true;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress tracker */}
      <WizardStepper 
        steps={STEPS} 
        currentStep={currentStep} 
        onChange={setCurrentStep} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Design Canvas - Always visible */}
        <div className="lg:col-span-2">
          <CardCanvas 
            cardData={cardData}
            onUpdate={handleCardUpdate}
          />
          
          {/* Undo/Redo Controls */}
          <div className="mt-4 flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={undo} 
              disabled={!canUndo}
            >
              <Undo className="h-4 w-4 mr-1" /> Undo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={redo} 
              disabled={!canRedo}
            >
              <Redo className="h-4 w-4 mr-1" /> Redo
            </Button>
            
            <div className="ml-2 text-xs text-gray-500 flex items-center">
              {saveStatus === 'saved' && (
                <span>Last saved: {new Date(lastSaved).toLocaleTimeString()}</span>
              )}
              {saveStatus === 'saving' && (
                <span>Saving...</span>
              )}
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="lg:row-start-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            {currentStep === 0 && (
              <ImageUploadStep 
                imageUrl={cardData.imageUrl || ''} 
                onImageSelect={(url) => handleCardUpdate({ imageUrl: url })} 
              />
            )}
            {currentStep === 1 && (
              <DesignStep 
                cardData={cardData}
                onUpdate={handleCardUpdate}
              />
            )}
            {currentStep === 2 && (
              <ElementsStep 
                cardData={cardData}
                onUpdate={handleCardUpdate}
              />
            )}
            {currentStep === 3 && (
              <EffectsStep 
                effects={cardData.effects || []}
                onUpdate={(effects) => handleCardUpdate({ effects })}
              />
            )}
            {currentStep === 4 && (
              <TextStep 
                cardData={cardData}
                onUpdate={handleCardUpdate}
              />
            )}
            {currentStep === 5 && (
              <FinalizeStep 
                cardData={cardData}
                onUpdate={handleCardUpdate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        
        <div className="flex space-x-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={goToPreviousStep}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          
          {currentStep < STEPS.length - 1 ? (
            <Button 
              onClick={goToNextStep} 
              disabled={!canProceed()}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-1" /> Save Card
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCreationWizard;
