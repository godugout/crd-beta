
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { useCardEditorState } from './hooks/useCardEditorState';
import { useCardEditorSteps } from './hooks/useCardEditorSteps';
import StepContent from './StepContent';
import NavigationButtons from './NavigationButtons';

interface CardEditorContainerProps {
  card?: any;
  className?: string;
  initialMetadata?: any;
}

const steps = ["Upload & Info", "Card Design", "Effects", "Text Overlay", "Preview"];

const CardEditorContainer: React.FC<CardEditorContainerProps> = ({ card, className, initialMetadata }) => {
  const navigate = useNavigate();
  const { addCard, updateCard } = useCards();
  const cardState = useCardEditorState({ initialCard: card, initialMetadata });
  
  const validateCurrentStep = (step: number) => {
    if (step === 0) {
      if (!cardState.imageUrl) {
        toast.error('Please upload an image for your CRD');
        return false;
      }
      
      if (!cardState.title.trim()) {
        toast.error('Please provide a title for your CRD');
        return false;
      }
    }
    return true;
  };
  
  const { currentStep, goToNextStep, goToPreviousStep } = useCardEditorSteps(
    steps.length, 
    validateCurrentStep
  );
  
  const handleSubmit = async () => {
    const cardData = cardState.getCardData();
    
    try {
      if (card) {
        // Update existing card
        await updateCard(card.id, cardData);
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
    }
  };

  return (
    <div className={className}>
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-4">{card ? "Edit CRD" : "Create New CRD"}</h1>
        
        <ProgressSteps 
          steps={steps}
          currentStep={currentStep}
          className="mb-8"
        />
        
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-litmus-gray-800">
          <StepContent 
            currentStep={currentStep}
            cardState={cardState}
          />
          
          <NavigationButtons 
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevious={goToPreviousStep}
            onNext={goToNextStep}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CardEditorContainer;
