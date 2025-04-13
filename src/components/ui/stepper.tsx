
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepProps {
  variant?: 'active' | 'completed' | 'inactive';
  stepNumber: string;
  label: string;
  firstStep?: boolean;
  lastStep?: boolean;
}

interface StepperContextValue {
  activeStep: number;
  setActiveStep: (step: number) => void;
  steps: React.ReactElement<StepProps>[];
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined);

export const Stepper = ({ children }: { children: React.ReactNode }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Step
  ) as React.ReactElement<StepProps>[];

  return (
    <StepperContext.Provider value={{ activeStep, setActiveStep, steps }}>
      <div className="flex w-full items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {React.cloneElement(step, {
              variant: index === activeStep ? 'active' : index < activeStep ? 'completed' : 'inactive',
              firstStep: index === 0,
              lastStep: index === steps.length - 1,
              stepNumber: (index + 1).toString(),
            })}
          </React.Fragment>
        ))}
      </div>
    </StepperContext.Provider>
  );
};

const Step = ({ variant = 'inactive', stepNumber, label, firstStep = false, lastStep = false }: StepProps) => {
  const getStepColor = () => {
    switch (variant) {
      case 'active':
        return 'bg-litmus-green text-white';
      case 'completed':
        return 'bg-litmus-green text-white';
      default:
        return 'bg-gray-200 text-gray-500';
    }
  };

  const getLineColor = () => {
    switch (variant) {
      case 'active':
        return 'bg-gray-200';
      case 'completed':
        return 'bg-litmus-green';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="flex items-center">
      {!firstStep && (
        <div className={cn("flex-grow h-0.5", getLineColor())} style={{ width: '30px' }} />
      )}
      <div className="flex flex-col items-center">
        <div className={cn("flex items-center justify-center h-8 w-8 rounded-full", getStepColor())}>
          {variant === 'completed' ? <Check size={16} /> : stepNumber}
        </div>
        <span className="mt-1 text-xs font-medium">{label}</span>
      </div>
      {!lastStep && (
        <div className={cn("flex-grow h-0.5", getLineColor())} style={{ width: '30px' }} />
      )}
    </div>
  );
};

Stepper.Step = Step;

export default Stepper;
