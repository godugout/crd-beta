
import React from 'react';
import StepIndicator from './StepIndicator';

interface StepProgressProps {
  currentStep: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  return (
    <div className="flex justify-between items-center max-w-3xl mx-auto py-4">
      <StepIndicator step={1} label="Upload" current={currentStep} />
      <div className="flex-1 h-0.5 bg-gray-200 mx-2">
        <div className="h-full bg-litmus-green" style={{ width: `${currentStep > 1 ? 100 : 0}%` }}></div>
      </div>
      <StepIndicator step={2} label="Design" current={currentStep} />
      <div className="flex-1 h-0.5 bg-gray-200 mx-2">
        <div className="h-full bg-litmus-green" style={{ width: `${currentStep > 2 ? 100 : 0}%` }}></div>
      </div>
      <StepIndicator step={3} label="Effects" current={currentStep} />
      <div className="flex-1 h-0.5 bg-gray-200 mx-2">
        <div className="h-full bg-litmus-green" style={{ width: `${currentStep > 3 ? 100 : 0}%` }}></div>
      </div>
      <StepIndicator step={4} label="Text" current={currentStep} />
      <div className="flex-1 h-0.5 bg-gray-200 mx-2">
        <div className="h-full bg-litmus-green" style={{ width: `${currentStep > 4 ? 100 : 0}%` }}></div>
      </div>
      <StepIndicator step={5} label="Preview" current={currentStep} />
    </div>
  );
};

export default StepProgress;
