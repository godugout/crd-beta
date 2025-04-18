
import React from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';

interface CollectionStatusProps {
  collectionData: any;
  isLoading: boolean;
  onViewCollection: () => void;
  onRegenerate: () => void;
}

export const CollectionStatus: React.FC<CollectionStatusProps> = ({
  collectionData,
  isLoading,
  onViewCollection,
  onRegenerate
}) => {
  return (
    <div className="text-center space-y-4">
      <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
        <h2 className="text-2xl font-semibold text-primary mb-2">
          Commons Cards Collection Available
        </h2>
        {collectionData && (
          <div className="mb-4">
            <p className="font-medium">{collectionData.name}</p>
            {collectionData.description && (
              <p className="text-sm text-muted-foreground">{collectionData.description}</p>
            )}
          </div>
        )}
        <Button 
          onClick={onViewCollection}
          size="lg"
          className="w-full"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Commons Cards Collection
        </Button>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <p className="text-sm text-muted-foreground mb-4">
          You can regenerate the Commons Cards collection if you want to refresh the content.
        </p>
        <Button 
          onClick={onRegenerate}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingState size="sm" className="mr-2" /> 
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Commons Cards
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
