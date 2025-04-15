
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { useCardEditorState } from './hooks/useCardEditorState';
import { useCardEditorSteps } from './hooks/useCardEditorSteps';
import StepContent from './StepContent';
import CardEditorHeader from './components/CardEditorHeader';
import CardEditorNavigation from './components/CardEditorNavigation';
import CardEditorPreview from './components/CardEditorPreview';
import CardEditorActions from './components/CardEditorActions';

interface CardEditorContainerProps {
  card?: any;
  className?: string;
  initialMetadata?: any;
}

const steps = ["Upload", "Design", "Effects", "Text", "Preview"];

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
  
  const { currentStep, goToNextStep, goToPreviousStep, goToStep, isFirstStep, isLastStep } = useCardEditorSteps(
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
    <div className={`max-w-7xl mx-auto ${className}`}>
      <CardEditorHeader title={card ? "Edit" : "Create a"} />
      
      <CardEditorNavigation 
        steps={steps} 
        currentStep={currentStep} 
        onStepClick={goToStep}
        validateCurrentStep={validateCurrentStep}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
            <StepContent 
              currentStep={currentStep}
              cardState={cardState}
            />
          </div>
          
          <CardEditorActions 
            onPrevious={goToPreviousStep}
            onNext={goToNextStep}
            onSubmit={handleSubmit}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
          />
          
          <div className="mt-4 flex justify-center md:justify-end">
            <p className="text-xs text-gray-500">Auto saving</p>
          </div>
        </div>
        
        <CardEditorPreview 
          imageUrl={cardState.imageUrl}
          title={cardState.title}
          description={cardState.description}
          tags={cardState.tags}
          player={cardState.player}
          team={cardState.team}
          year={cardState.year}
          cardStyle={cardState.cardStyle}
        />
      </div>
    </div>
  );
};

export default CardEditorContainer;
