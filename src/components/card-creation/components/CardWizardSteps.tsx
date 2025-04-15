
import React from 'react';
import { WizardStep } from '../constants/wizardSteps';
import { Check } from 'lucide-react';

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
    <div className="flex flex-wrap justify-between items-center mb-8">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className="flex flex-col items-center"
          onClick={() => {
            if (index <= currentStep) {
              setCurrentStep(index);
            }
          }}
        >
          <div 
            className={`
              flex items-center justify-center w-10 h-10 rounded-full
              ${index === currentStep 
                ? 'bg-litmus-green text-white' 
                : index < currentStep 
                  ? 'bg-green-100 text-litmus-green border border-litmus-green' 
                  : 'bg-gray-100 text-gray-400'}
              ${index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}
              transition-colors duration-200
            `}
          >
            {index < currentStep ? (
              <Check size={20} />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          <span 
            className={`
              text-xs mt-2 hidden md:block
              ${index === currentStep ? 'text-litmus-green font-medium' : 'text-gray-500'}
            `}
          >
            {step.name}
          </span>
          
          {index < steps.length - 1 && (
            <div className="hidden md:block w-8 h-0.5 mx-1 bg-gray-200"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CardWizardSteps;
