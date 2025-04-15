
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CardCreationWizard, { CardCreationStep } from './CardCreationWizard';
import ImageUploadStep from './steps/ImageUploadStep';
import TemplateSelectionStep from './steps/TemplateSelectionStep';
import PlayerDetailsStep from './steps/PlayerDetailsStep';
import EffectsSelectionStep from './steps/EffectsSelectionStep';
import ReviewPublishStep from './steps/ReviewPublishStep';

interface CardCreationIndexProps {
  className?: string;
  initialData?: any;
}

const CardCreationIndex: React.FC<CardCreationIndexProps> = ({ 
  className,
  initialData = {} 
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);
  
  // Define the steps for the wizard
  const steps: CardCreationStep[] = [
    {
      id: 'upload',
      label: 'Upload Image',
      component: <ImageUploadStep />
    },
    {
      id: 'template',
      label: 'Select Template',
      component: <TemplateSelectionStep />
    },
    {
      id: 'details',
      label: 'Player Details',
      component: <PlayerDetailsStep />
    },
    {
      id: 'effects',
      label: 'Add Effects',
      component: <EffectsSelectionStep />
    },
    {
      id: 'publish',
      label: 'Review & Publish',
      component: <ReviewPublishStep />
    }
  ];
  
  // Handle save functionality
  const handleSave = async (data: any) => {
    try {
      // This would typically be an API call to save the card
      console.log('Saving card with data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Card created successfully!');
      navigate('/gallery');
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving card:', error);
      return Promise.reject(error);
    }
  };

  return (
    <div className={className}>
      <CardCreationWizard
        steps={steps}
        onSave={handleSave}
        initialData={formData}
      />
    </div>
  );
};

export default CardCreationIndex;
