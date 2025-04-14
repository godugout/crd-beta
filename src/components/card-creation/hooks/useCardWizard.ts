
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { toast } from 'sonner';
import { CardDesignState } from '../types/cardTypes';
import { LucideIcon } from 'lucide-react';

export interface Step {
  name: string;
  path: string;
  icon: LucideIcon;
}

export const useCardWizard = (steps: Step[], initialState: CardDesignState) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cardData, setCardData] = useState<CardDesignState>(initialState);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { step } = useParams<{ step?: string }>();

  useEffect(() => {
    if (step) {
      const stepIndex = steps.findIndex(s => s.path === step);
      if (stepIndex >= 0) {
        setCurrentStep(stepIndex);
      }
    } else if (location.pathname === '/card-creator') {
      navigate('/card-creator/upload', { replace: true });
    }
  }, [step, location, navigate, steps]);

  const goToStep = (stepIndex: number) => {
    if (currentStep === 0 && !cardData.imageUrl && stepIndex > 0) {
      toast.error('Please upload an image first');
      return;
    }
    
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    
    navigate(`/card-creator/${steps[stepIndex].path}`);
    setCurrentStep(stepIndex);
  };

  const handleNext = () => goToStep(currentStep + 1);
  const handleBack = () => goToStep(currentStep - 1);

  const handleImageCaptured = (imageUrl: string) => {
    setCardData(prev => ({ ...prev, imageUrl }));
  };
  
  const handleSaveCard = () => {
    const cardId = uuid();
    
    const cardToSave = {
      id: cardId,
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '',
      tags: cardData.tags,
      designMetadata: {
        borderColor: cardData.borderColor,
        backgroundColor: cardData.backgroundColor,
        borderRadius: cardData.borderRadius,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Saving card:', cardToSave);
    
    toast.success('Card saved successfully!');
    
    setTimeout(() => {
      navigate('/cards');
    }, 1500);
  };

  return {
    currentStep,
    cardData,
    setCardData,
    handleNext,
    handleBack,
    handleImageCaptured,
    handleSaveCard,
    canProceedToNextStep: currentStep === 0 ? !!cardData.imageUrl : true
  };
};
