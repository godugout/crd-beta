
import React from 'react';
import { ProgressSteps } from '@/components/ui/progress-steps';

interface CardEditorNavigationProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  validateCurrentStep: (step: number) => boolean;
}

const CardEditorNavigation: React.FC<CardEditorNavigationProps> = ({
  steps,
  currentStep,
  onStepClick,
  validateCurrentStep
}) => {
  return (
    <>
      {/* Progress steps - hidden on mobile */}
      <div className="hidden md:block mb-8">
        <ProgressSteps 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={(step) => {
            // Allow going back to previous steps freely
            if (step < currentStep) {
              validateCurrentStep(currentStep) && onStepClick(step);
            }
          }}
        />
      </div>
      
      {/* Small progress indicator for mobile */}
      <div className="flex justify-between items-center mb-4 md:hidden">
        <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
        <span className="font-medium">{steps[currentStep]}</span>
      </div>
    </>
  );
};

export default CardEditorNavigation;
