
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardCreationStepperProps {
  steps: { name: string; description: string }[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const CardCreationStepper: React.FC<CardCreationStepperProps> = ({
  steps,
  currentStep,
  onStepClick
}) => {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between text-sm font-medium text-center text-gray-500 md:text-base">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
          
          return (
            <li key={step.name} className={cn("relative w-full", index !== 0 && "ml-6")}>
              {index !== 0 && (
                <div className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200">
                  <div 
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
              
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick}
                className={cn(
                  "group flex flex-col items-center justify-center",
                  onStepClick && "cursor-pointer"
                )}
              >
                <span className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors duration-300 ease-in-out mb-2",
                  isActive 
                    ? "bg-primary text-white" 
                    : isCompleted 
                      ? "bg-primary text-white" 
                      : "bg-gray-100"
                )}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className={isActive ? "text-white" : "text-gray-600"}>
                      {index + 1}
                    </span>
                  )}
                </span>
                
                <span className={cn(
                  "text-xs font-medium block max-w-[80px] mx-auto text-center",
                  isActive || isCompleted ? "text-primary" : "text-gray-500"
                )}>
                  {step.name}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CardCreationStepper;
