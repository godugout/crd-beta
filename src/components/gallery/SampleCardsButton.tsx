import React from 'react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { adaptCardToCardData } from '@/types/card';
import { sampleCardsData } from '@/data/cardData';
import { toast } from '@/components/ui/use-toast';

interface SampleCardsButtonProps {
  className?: string;
}

const SampleCardsButton: React.FC<SampleCardsButtonProps> = ({ className }) => {
  const { addCard } = useCards();

  const addSampleCards = async () => {
    try {
      sampleCardsData.forEach(async (cardData) => {
        const adaptedCard = adaptCardToCardData(cardData);
        await addCard(adaptedCard);
      });
      handleSuccess();
    } catch (error) {
      console.error("Error adding sample cards:", error);
      handleError();
    }
  };

  const handleSuccess = () => {
    toast({
      id: `sample-cards-success-${Date.now()}`,
      title: 'Sample Cards Added',
      description: 'Sample cards have been added to your collection.',
      variant: 'default'
    });
  };

  const handleError = () => {
    toast({
      id: `sample-cards-error-${Date.now()}`,
      title: 'Error Adding Cards',
      description: 'There was a problem adding the sample cards. Please try again.',
      variant: 'destructive'
    });
  };

  return (
    <Button className={className} onClick={addSampleCards}>
      Add Sample Cards
    </Button>
  );
};

export default SampleCardsButton;
