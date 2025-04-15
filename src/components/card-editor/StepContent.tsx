
import React from 'react';
import CardUploadInfo from './CardUploadInfo';
import CardDesignCustomization from './CardDesignCustomization';
import CardEffects from './CardEffects';
import CardTextOverlay from './CardTextOverlay';
import CardPreview from './CardPreview';
import { useCardEditor } from '@/lib/state/card-editor/context';

interface StepContentProps {
  currentStep: number;
}

const StepContent: React.FC<StepContentProps> = ({ currentStep }) => {
  // Use our card editor context to get all the necessary state
  const { 
    design, 
    updateDesign, 
    effectsApplied,
    toggleEffect
  } = useCardEditor();
  
  // Handle effect toggle
  const handleEffectsChange = (effects: string[]) => {
    // Find which effects were added or removed
    const currentEffects = new Set(effectsApplied);
    
    // Toggle effects that changed
    effects.forEach(effect => {
      if (!currentEffects.has(effect)) {
        toggleEffect(effect, true);
      }
    });
    
    currentEffects.forEach(effect => {
      if (!effects.includes(effect)) {
        toggleEffect(effect, false);
      }
    });
  };

  // Create card style object from design state
  const cardStyle = {
    borderRadius: design.borderRadius,
    effect: 'classic', // Default effect
    borderColor: design.borderColor,
    backgroundColor: design.backgroundColor
  };

  // Update card style
  const setCardStyle = (style: any) => {
    updateDesign({
      borderRadius: style.borderRadius,
      borderColor: style.borderColor,
      backgroundColor: style.backgroundColor
    });
  };

  switch (currentStep) {
    case 0:
      return <CardUploadInfo />;
    case 1:
      return (
        <CardDesignCustomization 
          imageUrl={design.imageUrl || ''} 
          cardStyle={cardStyle}
          setCardStyle={setCardStyle}
        />
      );
    case 2:
      return (
        <CardEffects 
          selectedEffects={effectsApplied} 
          onEffectsChange={handleEffectsChange}
          imageUrl={design.imageUrl || ''}
        />
      );
    case 3:
      return <CardTextOverlay imageUrl={design.imageUrl || ''} />;
    case 4:
      return (
        <CardPreview 
          title={design.title}
          description={design.description}
          player={design.player || ''}
          team={design.team || ''}
          year={design.year || ''}
          tags={design.tags}
          imageUrl={design.imageUrl || ''}
          cardStyle={cardStyle}
          selectedEffects={effectsApplied}
        />
      );
    default:
      return <div>Unknown step</div>;
  }
};

export default StepContent;
