
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SaveRemixSection: React.FC = () => {
  const handleSaveRemix = () => {
    toast.success("Remix saved to your collection!");
  };

  return (
    <div className="pt-4">
      <Button 
        onClick={handleSaveRemix}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium"
        size="lg"
      >
        Save Remix
      </Button>
    </div>
  );
};

export default SaveRemixSection;
