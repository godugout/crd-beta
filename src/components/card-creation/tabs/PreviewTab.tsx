
import React from 'react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface PreviewTabProps {
  onSave: () => void;
}

const PreviewTab: React.FC<PreviewTabProps> = ({ onSave }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4 ${isMobile ? 'text-center' : 'text-left'}`}>Preview Your Card</h2>
      <p className={isMobile ? 'text-center' : 'text-left'}>Preview and export options will be implemented here.</p>
      
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
