
import React from 'react';
import { Sparkles } from 'lucide-react';

const CardWizardHeader: React.FC = () => {
  return (
    <div className="mb-4 flex items-center">
      <Sparkles className="mr-2 h-6 w-6 text-litmus-green" />
      <h2 className="text-2xl font-bold">Create your <span className="text-litmus-green">CRD</span></h2>
    </div>
  );
};

export default CardWizardHeader;
