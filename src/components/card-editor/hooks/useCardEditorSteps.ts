
import { useState, useCallback } from 'react';

type StepValidator = (step: number) => boolean;

export function useCardEditorSteps(totalSteps: number, validateStep?: StepValidator) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const goToNextStep = useCallback(() => {
    if (validateStep && !validateStep(currentStep)) {
      return;
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps, validateStep]);
  
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);
  
  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  return {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
  };
}
