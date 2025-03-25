
import { useState } from 'react';
import { toast } from 'sonner';

export const useCardEditorSteps = (totalSteps: number, validateStepFn?: (step: number) => boolean) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    // If a validation function is provided, run it
    if (validateStepFn && !validateStepFn(currentStep)) {
      return;
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  return {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep
  };
};
