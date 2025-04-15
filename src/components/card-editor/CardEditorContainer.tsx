
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import StepContent from './StepContent';
import CardEditorHeader from './components/CardEditorHeader';
import CardEditorNavigation from './components/CardEditorNavigation';
import CardEditorPreview from './components/CardEditorPreview';
import CardEditorActions from './components/CardEditorActions';
import { CardEditorProvider, useCardEditor } from '@/lib/state/card-editor/context';

interface CardEditorContainerProps {
  card?: any;
  className?: string;
  initialMetadata?: any;
}

// Steps in the card editor process
const steps = ["Upload", "Design", "Effects", "Text", "Preview"];

// Container component for the card editor
const CardEditorContainer: React.FC<CardEditorContainerProps> = ({ card, className, initialMetadata }) => {
  // Wrap the editor components with our provider
  return (
    <CardEditorProvider initialCard={card}>
      <CardEditorContainerInner className={className} initialMetadata={initialMetadata} />
    </CardEditorProvider>
  );
};

// Inner component that uses the card editor context
const CardEditorContainerInner: React.FC<Omit<CardEditorContainerProps, 'card'>> = ({ 
  className, 
  initialMetadata 
}) => {
  const navigate = useNavigate();
  const { addCard, updateCard } = useCards();
  
  // Use our new card editor context
  const { 
    id,
    design,
    layers,
    activeLayer,
    currentStep,
    setCurrentStep,
    updateDesign,
    isSaving,
    setSaving,
    getCardData
  } = useCardEditor();
  
  // Apply initial metadata if provided (from image detection, etc)
  useEffect(() => {
    if (initialMetadata && !id) {
      updateDesign({
        title: initialMetadata.title || '',
        description: initialMetadata.text || '',
        tags: initialMetadata.tags || [],
        player: initialMetadata.player || '',
        team: initialMetadata.team || '',
        year: initialMetadata.year || ''
      });
    }
  }, [initialMetadata, id, updateDesign]);
  
  const validateCurrentStep = (step: number) => {
    if (step === 0) {
      if (!design.imageUrl) {
        toast.error('Please upload an image for your CRD');
        return false;
      }
      
      if (!design.title.trim()) {
        toast.error('Please provide a title for your CRD');
        return false;
      }
    }
    return true;
  };
  
  const goToNextStep = () => {
    if (currentStep < steps.length - 1 && validateCurrentStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length && (step <= currentStep || validateCurrentStep(currentStep))) {
      setCurrentStep(step);
    }
  };
  
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  const handleSubmit = async () => {
    const cardData = getCardData();
    
    try {
      setSaving(true);
      
      if (id) {
        // Update existing card
        await updateCard(id, cardData);
        toast.success('CRD updated successfully');
      } else {
        // Add new card
        await addCard(cardData);
        toast.success('CRD created successfully');
      }
      
      // Navigate to gallery with a refresh parameter to ensure updated data is fetched
      navigate('/gallery?refresh=true');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save CRD. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      <CardEditorHeader title={id ? "Edit" : "Create a"} />
      
      <CardEditorNavigation 
        steps={steps} 
        currentStep={currentStep} 
        onStepClick={goToStep}
        validateCurrentStep={validateCurrentStep}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
            <StepContent currentStep={currentStep} />
          </div>
          
          <CardEditorActions 
            onPrevious={goToPreviousStep}
            onNext={goToNextStep}
            onSubmit={handleSubmit}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            isSaving={isSaving}
          />
          
          <div className="mt-4 flex justify-center md:justify-end">
            <p className="text-xs text-gray-500">Auto saving</p>
          </div>
        </div>
        
        <CardEditorPreview />
      </div>
    </div>
  );
};

export default CardEditorContainer;
