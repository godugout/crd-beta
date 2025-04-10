
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { useCardEditorState } from './hooks/useCardEditorState';
import { useCardEditorSteps } from './hooks/useCardEditorSteps';
import StepContent from './StepContent';
import NavigationButtons from './NavigationButtons';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Save } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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
  const isMobile = useMediaQuery('(max-width: 768px)');
  
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
  
  const { currentStep, goToNextStep, goToPreviousStep, isFirstStep, isLastStep } = useCardEditorSteps(
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-4xl font-bold">Create a <span className="text-orange-500">CRD</span></h1>
        <Button variant="outline" size={isMobile ? "sm" : "default"} className="hidden md:flex">Switch to Multiple</Button>
      </div>
      
      {/* Progress steps - hidden on mobile */}
      <div className="hidden md:block mb-8">
        <ProgressSteps 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={(step) => {
            // Allow going back to previous steps freely
            if (step < currentStep) {
              validateCurrentStep(currentStep) && goToPreviousStep();
            }
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          {/* Small progress indicator for mobile */}
          <div className="flex justify-between items-center mb-4 md:hidden">
            <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
            <span className="font-medium">{steps[currentStep]}</span>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
            <StepContent 
              currentStep={currentStep}
              cardState={cardState}
            />
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={isFirstStep}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            {isLastStep ? (
              <Button 
                onClick={handleSubmit}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md flex items-center gap-2"
              >
                Create Card
                <Save className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={goToNextStep}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="mt-4 flex justify-center md:justify-end">
            <p className="text-xs text-gray-500">Auto saving</p>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 md:p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl">Preview</h3>
            <Button variant="ghost" size="icon" className="text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 3H3M21 3L13 11M21 3V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 13V21M21 21H13M21 21L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
          
          {cardState.imageUrl ? (
            <div 
              className="aspect-[2.5/3.5] rounded-md overflow-hidden mb-4" 
              style={{
                borderRadius: cardState.cardStyle.borderRadius,
                borderColor: cardState.cardStyle.borderColor || '#48BB78',
                backgroundColor: cardState.cardStyle.backgroundColor || 'transparent',
                borderWidth: '2px',
                borderStyle: 'solid'
              }}
            >
              <img 
                src={cardState.imageUrl} 
                alt="Card preview" 
                className="w-full h-full object-cover" 
                style={{ 
                  filter: cardState.cardStyle.effect === 'vintage' ? 'sepia(0.5)' : 
                         cardState.cardStyle.effect === 'chrome' ? 'contrast(1.1) brightness(1.1)' : 'none'
                }}
              />
            </div>
          ) : (
            <div className="aspect-[2.5/3.5] bg-gray-800 rounded-md flex items-center justify-center mb-4">
              <p className="text-gray-400">Upload an image to preview</p>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="font-semibold text-xl">{cardState.title || "No title yet"}</h4>
            <p className="text-gray-300 text-sm">{cardState.description || "Add a description to your CRD"}</p>
            
            {/* Tags display */}
            {cardState.tags && cardState.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {cardState.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-gray-800 text-xs rounded-full px-2 py-1">{tag}</span>
                ))}
              </div>
            )}
            
            {/* Additional card details */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              {cardState.player && (
                <div>
                  <p className="text-gray-400">Player</p>
                  <p>{cardState.player}</p>
                </div>
              )}
              {cardState.team && (
                <div>
                  <p className="text-gray-400">Team</p>
                  <p>{cardState.team}</p>
                </div>
              )}
              {cardState.year && (
                <div>
                  <p className="text-gray-400">Year</p>
                  <p>{cardState.year}</p>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4 text-white border-white hover:bg-gray-800"
          >
            Add back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardEditorContainer;
