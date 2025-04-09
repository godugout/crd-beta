
import React from 'react';
import CardUploadInfo from './CardUploadInfo';
import CardDesignCustomization from './CardDesignCustomization';
import CardEffects from './CardEffects';
import CardTextOverlay from './CardTextOverlay';
import CardPreview from './CardPreview';

interface StepContentProps {
  currentStep: number;
  cardState: any;
}

const StepContent: React.FC<StepContentProps> = ({ currentStep, cardState }) => {
  switch (currentStep) {
    case 0:
      return (
        <CardUploadInfo
          title={cardState.title}
          setTitle={cardState.setTitle}
          description={cardState.description}
          setDescription={cardState.setDescription}
          player={cardState.player}
          setPlayer={cardState.setPlayer}
          team={cardState.team}
          setTeam={cardState.setTeam}
          year={cardState.year}
          setYear={cardState.setYear}
          tags={cardState.tags}
          setTags={cardState.setTags}
          imageUrl={cardState.imageUrl}
          setImageUrl={cardState.setImageUrl}
          onFileChange={cardState.handleFileChange}
        />
      );
    case 1:
      return (
        <CardDesignCustomization
          imageUrl={cardState.imageUrl}
          cardStyle={cardState.cardStyle}
          setCardStyle={cardState.setCardStyle}
        />
      );
    case 2:
      return (
        <CardEffects
          selectedEffect={cardState.selectedEffect}
          onEffectChange={cardState.setSelectedEffect}
          imageUrl={cardState.imageUrl}
        />
      );
    case 3:
      return (
        <CardTextOverlay
          imageUrl={cardState.imageUrl}
        />
      );
    case 4:
      return (
        <CardPreview
          title={cardState.title}
          description={cardState.description}
          player={cardState.player}
          team={cardState.team}
          year={cardState.year}
          tags={cardState.tags}
          imageUrl={cardState.imageUrl}
          cardStyle={cardState.cardStyle}
          selectedEffect={cardState.selectedEffect}
        />
      );
    default:
      return <div>Unknown step</div>;
  }
};

export default StepContent;
