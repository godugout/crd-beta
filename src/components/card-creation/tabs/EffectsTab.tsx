
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface EffectsTabProps {
  onContinue: () => void;
}

const EffectsTab: React.FC<EffectsTabProps> = ({ onContinue }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Apply Effects</h2>
      <p>Effects editor will be implemented here.</p>
      
      <div className="flex justify-end mt-6">
        <Button 
          className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
          onClick={onContinue}
        >
          Continue <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default EffectsTab;
