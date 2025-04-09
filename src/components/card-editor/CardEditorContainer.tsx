
import React from 'react';
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
        toast.error('Please upload an image');
        return false;
      }
      
      if (!cardState.title.trim()) {
        toast.error('Please provide a title');
        return false;
      }
    }
    return true;
  };
  
  const { currentStep, goToNextStep, goToPreviousStep } = useCardEditorSteps(
    steps.length, 
    validateCurrentStep
  );
  
  const handleSubmit = () => {
    const cardData = cardState.getCardData();
    
    if (card) {
      // Update existing card
      updateCard(card.id, cardData);
      toast.success('Card updated successfully');
    } else {
      // Add new card
      addCard(cardData);
      toast.success('Card created successfully');
    }
    
    // Navigate to gallery
    navigate('/gallery');
  };

  return (
    <div className={className}>
      <div className="max-w-4xl mx-auto mb-8">
        <ProgressSteps 
          steps={steps}
          currentStep={currentStep}
          className="mb-8"
        />
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
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
