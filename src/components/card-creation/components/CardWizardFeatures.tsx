
import React from 'react';
import { Upload, Palette, Sparkles } from 'lucide-react';

const CardWizardFeatures: React.FC = () => {
  return (
    <div className="mt-4 flex w-full items-start gap-6 justify-center">
      <div className="flex grow shrink-0 basis-0 flex-col items-center gap-2">
        <Upload className="text-xl text-litmus-green" />
        <span className="text-xs font-medium text-center">
          Upload Card Image
        </span>
      </div>
      <div className="flex grow shrink-0 basis-0 flex-col items-center gap-2">
        <Palette className="text-xl text-litmus-green" />
        <span className="text-xs font-medium text-center">
          Customize Design
        </span>
      </div>
      <div className="flex grow shrink-0 basis-0 flex-col items-center gap-2">
        <Sparkles className="text-xl text-litmus-green" />
        <span className="text-xs font-medium text-center">
          Add Special Effects
        </span>
      </div>
    </div>
  );
};

export default CardWizardFeatures;
