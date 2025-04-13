
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CardWizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

const CardWizardNavigation: React.FC<CardWizardNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  canProceed
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 0}
        className="flex items-center gap-1"
      >
        <ChevronLeft size={16} /> Back
      </Button>
      {currentStep < totalSteps - 1 ? (
        <Button
          variant="default"
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-1"
        >
          Next <ChevronRight size={16} />
        </Button>
      ) : (
        <Button
          variant="default"
          onClick={onNext}
          className="flex items-center gap-1"
        >
          Save Card
        </Button>
      )}
    </div>
  );
};

export default CardWizardNavigation;
