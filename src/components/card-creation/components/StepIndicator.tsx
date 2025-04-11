
import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  step: number;
  label: string;
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ step, label, currentStep }) => (
  <div className={`flex flex-col items-center ${currentStep >= step ? 'text-litmus-green' : 'text-gray-400'}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
      currentStep > step ? 'bg-litmus-green text-white' : 
      currentStep === step ? 'border-2 border-litmus-green text-litmus-green' : 
      'border-2 border-gray-200 text-gray-400'
    }`}>
      {currentStep > step ? <Check size={18} /> : step}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default StepIndicator;
