
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  key: string;
  label: string;
}

interface WizardStepperProps {
  steps: Step[];
  currentStep: number;
  onChange: (step: number) => void;
}

const WizardStepper: React.FC<WizardStepperProps> = ({
  steps,
  currentStep,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap justify-center md:justify-between items-center">
      <ol className="flex flex-wrap items-center w-full text-sm font-medium text-center text-gray-500">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <li 
              key={step.key}
              className={cn(
                "flex items-center",
                index < steps.length - 1 ? "md:w-auto flex-auto" : "flex-none"
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <button
                type="button"
                className={cn(
                  "flex flex-col md:flex-row items-center justify-center w-full",
                  index < steps.length - 1 && "md:after:content-[''] md:after:w-full md:after:h-1 md:after:border-b md:after:border-gray-200 md:after:border-1 md:after:hidden md:after:mx-6 md:after:inline-block",
                  (isCompleted) && "md:after:border-primary"
                )}
                onClick={() => onChange(index)}
              >
                <span 
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                    isActive && "bg-primary text-white",
                    isCompleted && "bg-primary-light text-primary",
                    !isActive && !isCompleted && "bg-gray-100"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
                <span 
                  className={cn(
                    "hidden md:inline-flex ml-2 text-sm",
                    isActive ? "text-primary" : "text-gray-500"
                  )}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default WizardStepper;
