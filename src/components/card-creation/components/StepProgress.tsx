
import React from 'react';

interface StepProgressProps {
  currentStep: number;
  steps?: string[];
}

const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  steps = ["Upload", "Design", "Effects", "Text", "Preview"]
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${index < currentStep ? 'bg-litmus-green text-white' : 
                  index === currentStep ? 'bg-litmus-green text-white' : 
                  'bg-gray-200 text-gray-500'}
              `}>
                {index + 1}
              </div>
              <span className="text-xs mt-1 text-center">
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-1 mx-2
                ${index < currentStep ? 'bg-litmus-green' : 'bg-gray-200'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
