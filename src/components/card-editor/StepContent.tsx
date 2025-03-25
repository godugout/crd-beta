
import React from 'react';
import CardBasicInfo from './CardBasicInfo';
import CardDesignCustomization from './CardDesignCustomization';
import CardTextCustomization from './CardTextCustomization';
import CardPreview from './CardPreview';

interface StepContentProps {
  currentStep: number;
  cardState: any; // Using any for brevity, but should be properly typed
}

const StepContent: React.FC<StepContentProps> = ({ currentStep, cardState }) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    tags,
    setTags,
    newTag,
    setNewTag,
    fabricSwatches,
    setFabricSwatches,
    imageFile,
    imageUrl,
    handleImageUpload,
    cardStyle,
    setCardStyle,
    textStyle,
    setTextStyle
  } = cardState;

  switch (currentStep) {
    case 0:
      return (
        <CardBasicInfo 
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          tags={tags}
          setTags={setTags}
          newTag={newTag}
          setNewTag={setNewTag}
          fabricSwatches={fabricSwatches}
          setFabricSwatches={setFabricSwatches}
          imageFile={imageFile}
          imageUrl={imageUrl}
          onImageUpload={handleImageUpload}
        />
      );
    case 1:
      return (
        <CardDesignCustomization 
          imageUrl={imageUrl}
          cardStyle={cardStyle}
          setCardStyle={setCardStyle}
        />
      );
    case 2:
      return (
        <CardTextCustomization 
          imageUrl={imageUrl}
          textStyle={textStyle}
          setTextStyle={setTextStyle}
          cardTitle={title}
          setCardTitle={setTitle}
          cardDescription={description}
          setCardDescription={setDescription}
        />
      );
    case 3:
      return (
        <CardPreview 
          imageUrl={imageUrl}
          title={title}
          description={description}
          fabricSwatches={fabricSwatches}
          cardStyle={cardStyle}
          textStyle={textStyle}
        />
      );
    default:
      return null;
  }
};

export default StepContent;
