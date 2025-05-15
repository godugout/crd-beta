
import React from 'react';

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
  steps, 
  currentStep, 
  onStepClick 
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between w-full relative">
        {/* Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gray-200 -translate-y-1/2 z-0"
          style={{ width: '100%' }}
        />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        
        {/* Steps */}
        {steps.map((step, index) => (
          <div 
            key={step.key} 
            className="relative z-10 flex flex-col items-center"
            onClick={() => onStepClick && onStepClick(index)}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                index <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            <span 
              className={`mt-2 text-xs font-medium ${
                index <= currentStep ? 'text-primary' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardProgress;
