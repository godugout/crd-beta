
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  key: string;
  label: string;
}

interface WizardProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

const WizardProgress: React.FC<WizardProgressProps> = ({
  steps = [],
  currentStep = 0,
  onStepClick
}) => {
  // Safety check to ensure valid currentStep
  const validatedCurrentStep = Math.max(0, Math.min(currentStep, steps.length - 1));
  
  if (!steps || steps.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full">
      <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
        {steps.map((step, index) => (
          <li 
            key={step.key}
            className={cn(
              "flex md:w-full items-center cursor-pointer",
              index <= validatedCurrentStep ? "text-blue-600 dark:text-blue-500" : "text-gray-500"
            )}
            onClick={() => onStepClick && onStepClick(index)}
          >
            <span className={cn(
              "flex items-center justify-center w-6 h-6 me-2 text-xs border rounded-full shrink-0",
              index < validatedCurrentStep 
                ? "border-blue-600 bg-blue-100 dark:border-blue-500 dark:bg-blue-900" 
                : index === validatedCurrentStep
                  ? "border-blue-600 dark:border-blue-500"
                  : "border-gray-300 dark:border-gray-600"
            )}>
              {index < validatedCurrentStep ? (
                <Check className="w-3 h-3" />
              ) : (
                index + 1
              )}
            </span>
            <span className={cn(
              "hidden sm:inline-flex",
              index === validatedCurrentStep ? "font-bold" : ""
            )}>
              {step.label}
            </span>
            
            {index < steps.length - 1 && (
              <div className="flex-1 hidden sm:flex sm:ms-4 sm:me-6">
                <div className={cn(
                  "h-0.5 w-full relative top-2",
                  index < validatedCurrentStep ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                )}></div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default WizardProgress;
