
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Undo, Redo } from 'lucide-react';
import { useCardEditor } from '@/lib/state/card-editor/context';

interface CardEditorActionsProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSaving?: boolean;
}

const CardEditorActions: React.FC<CardEditorActionsProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  isFirstStep,
  isLastStep,
  isSaving = false
}) => {
  const { canUndo, canRedo, undo, redo } = useCardEditor();
  
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
        >
          <Undo className="h-4 w-4 mr-1" />
          Undo
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
        >
          <Redo className="h-4 w-4 mr-1" />
          Redo
        </Button>
      </div>
      
      <div className="flex space-x-2">
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={onPrevious}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        )}
        
        {isLastStep ? (
          <Button 
            onClick={onSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save Card
              </>
            )}
          </Button>
        ) : (
          <Button onClick={onNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardEditorActions;
