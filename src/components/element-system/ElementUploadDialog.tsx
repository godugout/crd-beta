
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ElementUploadForm from './ElementUploadForm';
import { ElementUploadMetadata } from '@/lib/types/cardElements';
import { elementUploadToCardElement } from '@/lib/utils/typeAdapters';

interface ElementUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onElementUploaded: (element: ElementUploadMetadata) => void;
  teamId?: string;
}

const ElementUploadDialog: React.FC<ElementUploadDialogProps> = ({
  open,
  onOpenChange,
  onElementUploaded,
  teamId,
}) => {
  const handleSubmit = (elementData: ElementUploadMetadata) => {
    // Add team ID if available
    if (teamId) {
      elementData.metadata = {
        ...elementData.metadata,
        teamId
      };
    }
    
    // In a real app, this would involve an API call
    onElementUploaded(elementData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload New Element</DialogTitle>
        </DialogHeader>
        
        <ElementUploadForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default ElementUploadDialog;
