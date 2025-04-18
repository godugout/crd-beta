
import React from 'react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';

interface InitialGenerationStateProps {
  onGenerate: () => void;
  isLoading: boolean;
}

export const InitialGenerationState: React.FC<InitialGenerationStateProps> = ({
  onGenerate,
  isLoading
}) => {
  return (
    <div className="text-center">
      <p className="mb-6">
        This will create or update the "Commons Cards" collection with sample trading cards
        featuring public domain images from Wikimedia Commons.
      </p>

      <Button
        onClick={onGenerate}
        disabled={isLoading}
        size="lg"
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      >
        {isLoading ? (
          <>
            <LoadingState size="sm" className="mr-2" />
            Generating Commons Cards...
          </>
        ) : (
          'Create/Update Commons Cards Collection'
        )}
      </Button>
    </div>
  );
};
