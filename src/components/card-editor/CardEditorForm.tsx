import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ProgressSteps } from '@/components/ui/progress-steps';
import CardBasicInfo from './CardBasicInfo';
import CardDesignCustomization, { CardStyle } from './CardDesignCustomization';
import CardTextCustomization, { TextStyle } from './CardTextCustomization';
import CardPreview from './CardPreview';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface CardEditorFormProps {
  card?: any;
  className?: string;
}

const steps = ["Upload & Info", "Card Design", "Card Text", "Preview"];

const CardEditorForm: React.FC<CardEditorFormProps> = ({ card, className }) => {
  const navigate = useNavigate();
  const { addCard, updateCard } = useCards();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(card?.imageUrl || '');
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [tags, setTags] = useState<string[]>(card?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [fabricSwatches, setFabricSwatches] = useState<any[]>(card?.fabricSwatches || []);
  
  // Card design customization state - fix borderRadius from number to string
  const [cardStyle, setCardStyle] = useState<CardStyle>({
    effect: 'classic',
    brightness: 100,
    contrast: 100,
    saturation: 100,
    borderWidth: 0,
    borderRadius: '8px', // Changed from number to string
    borderColor: '#ffffff',
    backgroundColor: '#ffffff'
  });
  
  // Card text customization state
  const [textStyle, setTextStyle] = useState<TextStyle>({
    titleFont: 'sans',
    titleSize: 24,
    titleColor: '#ffffff',
    titleAlignment: 'left',
    titleWeight: 'bold',
    titleStyle: 'normal',
    descriptionFont: 'sans',
    descriptionSize: 12,
    descriptionColor: '#ffffff',
    showOverlay: true,
    overlayOpacity: 50,
    overlayColor: '#000000',
    overlayPosition: 'bottom'
  });
  
  const handleImageUpload = (file: File, url: string) => {
    setImageFile(file);
    setImageUrl(url);
  };
  
  const goToNextStep = () => {
    if (currentStep === 0 && !imageUrl) {
      toast.error('Please upload an image');
      return;
    }
    
    if (currentStep === 0 && !title.trim()) {
      toast.error('Please provide a title');
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = () => {
    // Create metadata for fabric swatches
    const fabricMetadata = fabricSwatches.map(swatch => ({
      type: swatch.type,
      team: swatch.team,
      year: swatch.year,
      manufacturer: swatch.manufacturer,
      position: swatch.position,
      size: swatch.size
    }));
    
    if (card) {
      // Update existing card
      updateCard(card.id, {
        title,
        description,
        imageUrl,
        thumbnailUrl: imageUrl, // In a real app, we'd generate a thumbnail
        tags,
        fabricSwatches: fabricMetadata,
        designMetadata: {
          cardStyle,
          textStyle
        }
      });
      toast.success('Card updated successfully');
    } else {
      // Add new card
      addCard({
        title,
        description,
        imageUrl,
        thumbnailUrl: imageUrl, // In a real app, we'd generate a thumbnail
        tags,
        fabricSwatches: fabricMetadata,
        designMetadata: {
          cardStyle,
          textStyle
        }
      });
      toast.success('Card created successfully');
    }
    
    // Navigate to gallery
    navigate('/gallery');
  };

  return (
    <div className={className}>
      <div className="max-w-4xl mx-auto mb-8">
        <ProgressSteps 
          steps={steps}
          currentStep={currentStep}
          className="mb-8"
        />
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <StepContent 
            currentStep={currentStep}
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
            cardStyle={cardStyle}
            setCardStyle={setCardStyle}
            textStyle={textStyle}
            setTextStyle={setTextStyle}
          />
          
          <NavigationButtons 
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevious={goToPreviousStep}
            onNext={goToNextStep}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

interface StepContentProps {
  currentStep: number;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  fabricSwatches: any[];
  setFabricSwatches: (swatches: any[]) => void;
  imageFile: File | null;
  imageUrl: string;
  onImageUpload: (file: File, url: string) => void;
  cardStyle: CardStyle;
  setCardStyle: (style: CardStyle) => void;
  textStyle: TextStyle;
  setTextStyle: (style: TextStyle) => void;
}

const StepContent: React.FC<StepContentProps> = (props) => {
  const {
    currentStep,
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
    onImageUpload,
    cardStyle,
    setCardStyle,
    textStyle,
    setTextStyle
  } = props;

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
          onImageUpload={onImageUpload}
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

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit
}) => {
  return (
    <div className="mt-8 flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>
      
      {currentStep < totalSteps - 1 ? (
        <Button
          type="button"
          onClick={onNext}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSubmit}
        >
          <Save className="mr-1 h-4 w-4" />
          Save Card
        </Button>
      )}
    </div>
  );
};

export default CardEditorForm;
