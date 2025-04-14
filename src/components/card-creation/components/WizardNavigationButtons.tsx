
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WIZARD_STEPS } from '../constants/wizardSteps';

interface WizardNavigationButtonsProps {
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
}

const WizardNavigationButtons: React.FC<WizardNavigationButtonsProps> = ({
  currentStep,
  onNext,
  onBack
}) => {
  return (
    <div className={`flex ${currentStep === 0 ? 'justify-end' : 'justify-between'} mt-6`}>
      {currentStep > 0 && (
        <Button 
          variant="outline"
          onClick={onBack}
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
      )}
      {currentStep < WIZARD_STEPS.length - 1 && (
        <Button 
          className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
          onClick={onNext}
        >
          Continue <ArrowRight size={16} className="ml-1" />
        </Button>
      )}
    </div>
  );
};

export default WizardNavigationButtons;
