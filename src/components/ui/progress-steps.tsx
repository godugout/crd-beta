
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
  onStepClick?: (step: number) => void;
}

export const ProgressSteps = ({
  steps,
  currentStep,
  className,
  onStepClick,
}: ProgressStepsProps) => {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className={cn("w-full space-y-4", className)}>
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div 
              key={index} 
              className={cn(
                "flex flex-col items-center space-y-2",
                isActive && "text-primary font-medium",
                isCompleted && "text-primary",
                onStepClick && "cursor-pointer"
              )}
              onClick={() => onStepClick && onStepClick(index)}
            >
              <div 
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "border-gray-200 bg-gray-50"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <span className="text-xs text-center">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
