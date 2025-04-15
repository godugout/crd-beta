
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Save } from 'lucide-react';

interface CardEditorActionsProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const CardEditorActions: React.FC<CardEditorActionsProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  isFirstStep,
  isLastStep
}) => {
  return (
    <div className="mt-6 flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      {isLastStep ? (
        <Button 
          onClick={onSubmit}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md flex items-center gap-2"
        >
          Create Card
          <Save className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          onClick={onNext}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CardEditorActions;
