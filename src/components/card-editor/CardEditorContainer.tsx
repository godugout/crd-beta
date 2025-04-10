
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
import { ArrowRight } from 'lucide-react';

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
    <div className={`max-w-7xl mx-auto ${className}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Create a <span className="text-orange-500">Card</span></h1>
        <Button variant="outline">Switch to Multiple</Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StepContent 
            currentStep={currentStep}
            cardState={cardState}
          />
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md flex items-center gap-2"
            >
              Create Card
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">Auto saving</p>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 text-white">
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
            <div className="aspect-[2.5/3.5] rounded-md overflow-hidden mb-4">
              <img 
                src={cardState.imageUrl} 
                alt="Card preview" 
                className="w-full h-full object-cover" 
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
