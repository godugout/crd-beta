
import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepInfo {
  key: string;
  label: string;
}

interface WizardStepperProps {
  steps: StepInfo[];
  currentStep: number;
  onChange: (stepIndex: number) => void;
  className?: string;
}

const WizardStepper: React.FC<WizardStepperProps> = ({
  steps,
  currentStep,
  onChange,
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      <ol className="flex items-center w-full">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <li 
              className={cn(
                "flex items-center",
                index < steps.length - 1 ? "flex-1" : "",
              )}
            >
              <button
                type="button"
                className={cn(
                  "flex items-center gap-2",
                  index < currentStep 
                    ? "text-blue-600 hover:text-blue-800" 
                    : index === currentStep 
                    ? "text-blue-600" 
                    : "text-gray-500"
                )}
                onClick={() => onChange(index)}
              >
                <span 
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full shrink-0",
                    index < currentStep
                      ? "bg-blue-100 text-blue-600"
                      : index === currentStep
                      ? "border-2 border-blue-600 font-semibold"
                      : "border border-gray-300 text-gray-500"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </span>
                
                <span className={cn(
                  "hidden sm:block text-sm",
                  index === currentStep ? "font-medium" : ""
                )}>
                  {step.label}
                </span>
              </button>
            </li>
            
            {index < steps.length - 1 && (
              <li className="flex items-center flex-1">
                <div className="w-full bg-gray-200 h-0.5 mx-4">
                  <div 
                    className="bg-blue-600 h-0.5" 
                    style={{ 
                      width: index < currentStep ? '100%' : '0%',
                      transition: 'width 0.3s ease-in-out' 
                    }}
                  ></div>
                </div>
                <ChevronRight className="hidden sm:block w-4 h-4 text-gray-400" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </div>
  );
};

export default WizardStepper;
