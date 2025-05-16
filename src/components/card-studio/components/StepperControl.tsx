
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface StepperControlProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onCancel: () => void;
  isFinalStep: boolean;
}

const StepperControl: React.FC<StepperControlProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onComplete,
  onCancel,
  isFinalStep
}) => {
  return (
    <div className="flex justify-between mt-8 border-t pt-6">
      <div>
        <Button variant="outline" onClick={onCancel} type="button">
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
      
      <div className="flex space-x-2">
        {currentStep > 1 && (
          <Button variant="outline" onClick={onPrev} type="button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        
        {currentStep < totalSteps ? (
          <Button onClick={onNext} type="button">
            {isFinalStep ? (
              <>
                Complete
                <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button onClick={onComplete} type="button">
            Finish
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="text-xs text-gray-500 self-center">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default StepperControl;
