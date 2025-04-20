
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { useCardEditorState } from './hooks/useCardEditorState';
import { useCardEditorSteps } from './hooks/useCardEditorSteps';
import StepContent from './StepContent';
import CardEditorHeader from './components/CardEditorHeader';
import CardEditorNavigation from './components/CardEditorNavigation';
import CardEditorPreview from './components/CardEditorPreview';
import CardEditorActions from './components/CardEditorActions';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import ThreeColumnLayout from '../card-creation/layouts/ThreeColumnLayout';
import TemplatesPanel from './panels/TemplatesPanel';
import CardPreviewPanel from './panels/CardPreview';
import LayersPanel from './panels/LayersPanel';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/lib/types';

interface CardEditorContainerProps {
  card?: any;
  className?: string;
  initialMetadata?: any;
  onSave?: (card: any) => void;
  onCancel?: () => void;
}

const steps = ["Upload", "Design", "Effects", "Text", "Preview"];

const CardEditorContainer: React.FC<CardEditorContainerProps> = ({ 
  card, 
  className, 
  initialMetadata,
  onSave,
  onCancel
}) => {
  const navigate = useNavigate();
  const { addCard, updateCard } = useCards();
  const cardState = useCardEditorState({ initialCard: card, initialMetadata });
  
  const validateCurrentStep = (step: number) => {
    if (step === 0) {
      if (!cardState.imageUrl) {
        toast.error('Please upload an image for your CRD');
        return false;
      }
      
      if (!cardState.title.trim()) {
        toast.error('Please provide a title for your CRD');
        return false;
      }
    }
    return true;
  };
  
  const { currentStep, goToNextStep, goToPreviousStep, goToStep, isFirstStep, isLastStep } = useCardEditorSteps(
    steps.length, 
    validateCurrentStep
  );
  
  const handleSubmit = async () => {
    const currentDate = new Date().toISOString();
    
    const cardData: Partial<Card> = {
      id: card?.id || uuidv4(),
      title: cardState.title,
      description: cardState.description || '',
      imageUrl: cardState.imageUrl || '',
      thumbnailUrl: cardState.imageUrl || '',
      tags: cardState.tags || [],
      effects: cardState.selectedEffects || [],
      player: cardState.player,
      team: cardState.team,
      year: cardState.year,
      userId: 'current-user',
      createdAt: card?.createdAt || currentDate,
      updatedAt: currentDate,
      designMetadata: {
        ...DEFAULT_DESIGN_METADATA,
        cardStyle: cardState.cardStyle || DEFAULT_DESIGN_METADATA.cardStyle,
        effects: cardState.selectedEffects || [],
      },
      layers: cardState.layers || [],
    };
    
    try {
      // If onSave prop is provided, use it
      if (onSave) {
        onSave(cardData);
        return;
      }
      
      if (card) {
        // Update existing card
        await updateCard(cardData);
        toast.success('CRD updated successfully');
      } else {
        // Add new card
        await addCard(cardData);
        toast.success('CRD created successfully');
      }
      
      // Navigate to gallery with a refresh parameter to ensure updated data is fetched
      navigate('/gallery?refresh=true');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save CRD. Please try again.');
    }
  };

  const handleCancel = () => {
    // If onCancel prop is provided, use it
    if (onCancel) {
      onCancel();
      return;
    }
    
    // Default cancel behavior - navigate back
    navigate(-1);
  };

  return (
    <div className={`${className}`}>
      <ThreeColumnLayout
        leftPanel={
          <TemplatesPanel 
            selectedTemplate={cardState.cardStyle?.template}
            onTemplateSelect={(template) => cardState.setCardStyle({ ...cardState.cardStyle, template })}
          />
        }
        mainContent={
          <CardPreviewPanel
            cardData={cardState.getCardData()}
            onSave={handleSubmit}
            onCancel={handleCancel}
          />
        }
        rightPanel={
          <LayersPanel
            layers={cardState.layers}
            onLayerUpdate={cardState.updateLayer}
            onLayerDelete={cardState.deleteLayer}
            onLayerReorder={cardState.reorderLayers}
          />
        }
      />
    </div>
  );
};

export default CardEditorContainer;
