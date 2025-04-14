
import React from 'react';
import { WizardStep } from '../constants/wizardSteps';

interface CardWizardStepsProps {
  steps: WizardStep[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const CardWizardSteps: React.FC<CardWizardStepsProps> = ({ 
  steps, 
  currentStep, 
  setCurrentStep 
}) => {
  return (
    <div className="flex items-center mb-4 w-full">
      {steps.map((step, index) => (
        <div 
          key={step.path} 
          className="flex items-center"
          onClick={() => index <= currentStep ? setCurrentStep(index) : null}
        >
          <div 
            className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
              currentStep === index 
                ? 'bg-litmus-green text-white' 
                : index < currentStep 
                  ? 'bg-green-100 text-litmus-green border-2 border-litmus-green' 
                  : 'bg-gray-100 text-gray-400'
            }`}
          >
            {index + 1}
          </div>
          <span 
            className={`ml-2 ${
              currentStep === index 
                ? 'font-medium text-litmus-green' 
                : index < currentStep 
                  ? 'text-litmus-green' 
                  : 'text-gray-400'
            } ${index === steps.length - 1 ? '' : 'hidden md:block'}`}
          >
            {step.name}
          </span>
          {index < steps.length - 1 && (
            <div className="w-8 md:w-12 h-px bg-gray-300 mx-1 md:mx-3"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CardWizardSteps;
