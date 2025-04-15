
import React from 'react';
import CardUploadInfo from './CardUploadInfo';
import CardDesignCustomization from './CardDesignCustomization';
import CardEffects from './CardEffects';
import CardTextOverlay from './CardTextOverlay';
import CardPreview from './CardPreview';

interface StepContentProps {
  currentStep: number;
}

const StepContent: React.FC<StepContentProps> = ({ currentStep }) => {
  switch (currentStep) {
    case 0:
      return <CardUploadInfo />;
    case 1:
      return <CardDesignCustomization />;
    case 2:
      return <CardEffects />;
    case 3:
      return <CardTextOverlay />;
    case 4:
      return <CardPreview />;
    default:
      return <div>Unknown step</div>;
  }
};

export default StepContent;
