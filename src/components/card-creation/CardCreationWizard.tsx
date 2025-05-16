
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Download, 
  Undo, 
  Redo, 
  HelpCircle 
} from 'lucide-react';
import { Card as CardType } from '@/lib/types/cardTypes';
import { useUndoRedoState } from '@/hooks/useUndoRedoState';
import { toastUtils } from '@/lib/utils/toast-utils';
import { Card as CardUI } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';

// Import wizard steps
import TemplateSelectionStep from './steps/TemplateSelectionStep';
import CardUploadStep from './steps/CardUploadStep';
import DesignStep from './steps/DesignStep';
import EffectsStep from './steps/CardEffectsStep';
import TextDetailsStep from './steps/CardTextStep';
import FinalizeStep from './steps/CardPreviewStep';

// Import wizard components
import WizardProgress from './components/WizardProgress';
import CardPreview from './components/CardPreview';
import HelpPanel from './components/HelpPanel';

// Define props for CardTextStep
export interface CardTextStepProps {
  cardData: Partial<CardType>;
  setCardData?: (data: Partial<CardType>) => void;
  onUpdate?: (updates: Partial<CardType>) => void;
  onContinue?: () => void;
}

interface CardCreationWizardProps {
  initialData?: Partial<CardType>;
  onSave: (cardData: CardType) => void;
  onCancel: () => void;
}

const WIZARD_STEPS = [
  { key: 'template', label: 'Template' },
  { key: 'upload', label: 'Image' },
  { key: 'design', label: 'Design' },
  { key: 'effects', label: 'Effects' },
  { key: 'text', label: 'Text' },
  { key: 'finalize', label: 'Finalize' },
];

/**
 * An improved wizard component for creating cards
 */
const CardCreationWizard: React.FC<CardCreationWizardProps> = ({
  initialData = {},
  onSave,
  onCancel,
}) => {
  // Create wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [helpVisible, setHelpVisible] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  
  // Set up undo/redo functionality with initial data
  const { 
    state: cardData, 
    setState: setCardData,
    undo, 
    redo, 
    canUndo, 
    canRedo,
    pushState: addToHistory
  } = useUndoRedoState<Partial<CardType>>({
    ...initialData,
    effects: initialData.effects || [],
    tags: initialData.tags || [],
    createdAt: initialData.createdAt || new Date().toISOString(),
    updatedAt: initialData.updatedAt || new Date().toISOString(),
  });
  
  // Reference to the preview element for capturing
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Handle card data updates
  const updateCardData = (updates: Partial<CardType>) => {
    const updatedData = { ...cardData, ...updates };
    setCardData(updatedData);
    addToHistory(updatedData);
    triggerAutoSave();
  };
  
  // Auto-save functionality
  const triggerAutoSave = () => {
    setIsAutoSaving(true);
    // In a real implementation, this would save to a database or local storage
    setTimeout(() => {
      setIsAutoSaving(false);
      setLastSaved(new Date());
    }, 1000);
  };
  
  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      // Validate current step
      const isValid = validateCurrentStep();
      if (isValid) {
        setCurrentStep(currentStep + 1);
        toastUtils.info("Step completed", `${WIZARD_STEPS[currentStep].label} completed`);
      }
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (index: number) => {
    // Only allow going to a step if all previous steps are valid
    if (index > currentStep) {
      for (let i = currentStep; i < index; i++) {
        if (!validateStep(i)) {
          toastUtils.warning("Incomplete step", `Please complete step ${i + 1} first`);
          return;
        }
      }
    }
    setCurrentStep(index);
  };
  
  // Validation functions
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Template
        return true; // Template is optional
      case 1: // Image
        return !!cardData.imageUrl;
      case 2: // Design
        return true; // Design is optional
      case 3: // Effects
        return true; // Effects are optional
      case 4: // Text
        return !!cardData.title; // Title is required
      default:
        return true;
    }
  };
  
  const validateCurrentStep = (): boolean => {
    const valid = validateStep(currentStep);
    if (!valid) {
      toastUtils.warning("Incomplete step", "Please complete all required fields");
    }
    return valid;
  };
  
  // Export functions
  const exportCard = (format: string) => {
    if (!previewRef.current) return;
    
    toastUtils.info("Exporting card", `Exporting card as ${format.toUpperCase()}`);
    
    // In a real implementation, this would use a library like html-to-image
    // to capture the preview and download it
    setTimeout(() => {
      toastUtils.success("Export completed", "Card exported successfully");
    }, 1000);
  };
  
  // Save function
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
      const newCard = {
        ...cardData,
        id: cardData.id || uuidv4(),
        createdAt: cardData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CardType;

      toastUtils.success(
        "Success!",
        "Your card has been created successfully."
      );

      onSave(newCard);
    } catch (error) {
      toastUtils.error(
        "Error saving card",
        "There was a problem saving your card. Please try again."
      );
      console.error("Error saving card:", error);
    }
  };
  
  // Complete creation function
  const handleCompleteCreation = async () => {
    try {
      setIsSubmitting(true);
      
      // Create a new Card instance with the collected data
      const newCard = {
        id: `card-${Date.now()}`,
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || '',
        tags: cardData.tags || [],
        effects: cardData.effects || [],
        player: cardData.player || '',
        team: cardData.team || '',
        year: cardData.year || '',
        userId: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        designMetadata: {
          cardStyle: cardData.designMetadata?.cardStyle || {},
          textStyle: cardData.designMetadata?.textStyle || {},
          marketMetadata: {},
          cardMetadata: {
            effects: cardData.effects || []
          }
        }
      };
      
      // Add the card to the context or make API call
      onSave(newCard as CardType);
      
      toastUtils.success("Card Created!", "Your card has been successfully created.");
      
    } catch (error) {
      console.error('Error creating card:', error);
      toastUtils.error("Error Creating Card", "There was an error creating your card. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <TemplateSelectionStep
            selectedTemplate={cardData.designMetadata?.cardStyle?.template || 'classic'}
            onSelectTemplate={(template) => 
              updateCardData({
                designMetadata: {
                  ...cardData.designMetadata,
                  cardStyle: {
                    ...cardData.designMetadata?.cardStyle,
                    template
                  }
                }
              })
            }
          />
        );
      case 1:
        return (
          <CardUploadStep
            imageUrl={cardData.imageUrl || ''}
            cardData={cardData}
            setCardData={updateCardData}
            onImageUpload={(imageUrl) => updateCardData({ imageUrl })}
          />
        );
      case 2:
        return (
          <DesignStep
            cardData={cardData}
            onUpdate={updateCardData}
          />
        );
      case 3:
        return (
          <EffectsStep
            effectStack={[]} // This needs to be replaced with actual effect stack
            addEffect={() => {}} // These need to be replaced with actual functions
            removeEffect={() => {}}
            updateEffectSettings={() => {}}
            onContinue={goToNextStep}
          />
        );
      case 4:
        return (
          <TextDetailsStep
            cardData={cardData}
            onUpdate={updateCardData}
          />
        );
      case 5:
        return (
          <FinalizeStep
            cardData={cardData}
            onSave={handleSave}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Preview Panel */}
      <div className="order-last lg:order-first">
        <div className="sticky top-24">
          <CardUI className="p-4">
            <h2 className="text-lg font-bold mb-4">Preview</h2>
            <CardPreview
              card={cardData as CardType}
              className="mx-auto max-w-full"
            />
            
            <div className="flex flex-col gap-4 mt-6">
              {/* Actions */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                >
                  <Undo className="h-4 w-4 mr-1" />
                  Undo
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                >
                  <Redo className="h-4 w-4 mr-1" />
                  Redo
                </Button>
              </div>
              
              {/* Quick Export */}
              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => exportCard('png')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                
                <Button 
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
              
              {/* Auto Save Status */}
              <div className="text-xs text-center text-muted-foreground mt-2">
                {isAutoSaving ? (
                  <span>Auto saving...</span>
                ) : lastSaved ? (
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                ) : (
                  <span>Changes will be auto-saved</span>
                )}
              </div>
            </div>
          </CardUI>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="lg:col-span-2">
        <CardUI className="p-6">
          {/* Progress Bar */}
          <WizardProgress
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            onStepClick={goToStep}
          />
          
          {/* Help Toggle */}
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHelpVisible(!helpVisible)}
              className="text-xs"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              {helpVisible ? 'Hide Help' : 'Show Help'}
            </Button>
          </div>
          
          {/* Help Panel */}
          {helpVisible && (
            <HelpPanel
              stepKey={WIZARD_STEPS[currentStep].key}
              onClose={() => setHelpVisible(false)}
            />
          )}
          
          {/* Step Content */}
          <div className="py-6">
            <h2 className="text-2xl font-bold mb-6">
              {WIZARD_STEPS[currentStep].label}
            </h2>
            {renderStepContent()}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={currentStep === 0 ? onCancel : goToPreviousStep}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            
            {currentStep < WIZARD_STEPS.length - 1 ? (
              <Button onClick={goToNextStep}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button variant="default" onClick={handleCompleteCreation}>
                <Save className="h-4 w-4 mr-1" />
                Save Card
              </Button>
            )}
          </div>
        </CardUI>
      </div>
    </div>
  );
};

export default CardCreationWizard;
