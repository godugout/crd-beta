
import React from 'react';
import { Button } from '@/components/ui/button';

interface PreviewTabProps {
  onSave: () => void;
}

const PreviewTab: React.FC<PreviewTabProps> = ({ onSave }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Preview Your Card</h2>
      <p>Preview and export options will be implemented here.</p>
      
      <div className="flex justify-end mt-6">
        <Button 
          className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
          onClick={onSave}
        >
          Save CRD
        </Button>
      </div>
    </div>
  );
};

export default PreviewTab;
