
import React from 'react';
import { CheckIcon } from 'lucide-react';

export interface StepperStepProps {
  variant?: 'active' | 'completed' | 'inactive';
  stepNumber: string;
  label: string;
  firstStep?: boolean;
  lastStep?: boolean;
}

const StepperStep: React.FC<StepperStepProps> = ({
  variant = 'inactive',
  stepNumber,
  label,
  firstStep = false,
  lastStep = false,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        {!firstStep && (
          <div
            className={`w-full h-0.5 ${
              variant === 'completed' ? 'bg-litmus-green' : 'bg-gray-200'
            }`}
          />
        )}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            variant === 'active'
              ? 'bg-litmus-green text-white'
              : variant === 'completed'
              ? 'bg-litmus-green text-white'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          {variant === 'completed' ? (
            <CheckIcon className="h-4 w-4 text-white" />
          ) : (
            stepNumber
          )}
        </div>
        {!lastStep && (
          <div
            className={`w-full h-0.5 ${
              variant === 'completed' ? 'bg-litmus-green' : 'bg-gray-200'
            }`}
          />
        )}
      </div>
      <span
        className={`text-xs mt-1 ${
          variant === 'active'
            ? 'text-litmus-green font-medium'
            : variant === 'completed'
            ? 'text-litmus-green'
            : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
};

const Stepper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full items-center justify-between">
      {children}
    </div>
  );
};

Stepper.Step = StepperStep;

export default Stepper;
