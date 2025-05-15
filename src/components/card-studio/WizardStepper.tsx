
import React from 'react';
import { CheckCircle2, CircleDot } from 'lucide-react';

interface WizardStepperProps {
  steps: { key: string; label: string }[];
  currentStep: number;
  onChange: (step: number) => void;
}

const WizardStepper: React.FC<WizardStepperProps> = ({
  steps,
  currentStep,
  onChange
}) => {
  return (
    <div className="w-full">
      <div className="hidden md:flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step.key}
            className={`flex-1 ${index > 0 ? 'ml-4' : ''} relative`}
          >
            {/* Connector line */}
            {index > 0 && (
              <div 
                className={`absolute h-0.5 top-4 -left-4 right-1/2 
                  ${index <= currentStep ? 'bg-primary' : 'bg-gray-200'}`}
              />
            )}
            
            {/* Step button */}
            <button
              onClick={() => onChange(index)}
              className={`flex flex-col items-center w-full ${
                index === currentStep ? 'text-primary' : 
                index < currentStep ? 'text-gray-600' : 'text-gray-400'
              } focus:outline-none`}
            >
              {/* Step indicator */}
              <div className="relative">
                {index < currentStep ? (
                  <div className="rounded-full bg-primary text-white h-8 w-8 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                ) : index === currentStep ? (
                  <div className="rounded-full border-2 border-primary bg-primary/10 h-8 w-8 flex items-center justify-center">
                    <CircleDot className="h-5 w-5 text-primary" />
                  </div>
                ) : (
                  <div className="rounded-full border-2 border-gray-300 h-8 w-8 flex items-center justify-center">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                )}
              </div>
              
              {/* Step label */}
              <span className="mt-2 text-sm font-medium">{step.label}</span>
            </button>
          </div>
        ))}
      </div>
      
      {/* Mobile stepper (horizontal scrollable) */}
      <div className="flex md:hidden overflow-x-auto py-2">
        {steps.map((step, index) => (
          <button
            key={step.key}
            onClick={() => onChange(index)}
            className={`flex items-center mr-4 px-3 py-2 rounded-full ${
              index === currentStep 
                ? 'bg-primary/10 text-primary border border-primary/30'
                : index < currentStep 
                  ? 'bg-gray-100 text-gray-600' 
                  : 'bg-gray-100 text-gray-400'
            }`}
          >
            <div className={`rounded-full h-5 w-5 flex items-center justify-center mr-2 ${
              index === currentStep 
                ? 'bg-primary text-white' 
                : index < currentStep
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-300 text-gray-500'
            }`}>
              <span className="text-xs">{index + 1}</span>
            </div>
            <span className="text-sm whitespace-nowrap">{step.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WizardStepper;
