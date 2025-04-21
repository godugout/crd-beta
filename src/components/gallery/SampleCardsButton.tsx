
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { sampleCards } from '@/data/sampleCards';
import { toast } from 'sonner';
import { Card } from '@/lib/types';

interface SampleCardsButtonProps {
  onClick?: () => void;
}

const SampleCardsButton: React.FC<SampleCardsButtonProps> = ({ onClick }) => {
  const { addCard } = useCards();

  const handleLoadSampleCards = async () => {
    try {
      // Track the number of cards added
      let cardsAdded = 0;

      // Process each sample card
      for (const card of sampleCards) {
        // Clone card to avoid mutating the source
        const cardToAdd: Partial<Card> = {
          ...card,
          // Ensure we use a new ID to avoid duplicates
          id: undefined
        };

        // Add the card using our context
        await Promise.resolve(addCard(cardToAdd));
        cardsAdded++;
      }

      // Show success message
      toast.success(`Added ${cardsAdded} sample cards successfully`);
      
      // Call the onClick callback if provided
      if (onClick) onClick();
      
    } catch (error) {
      console.error('Error adding sample cards:', error);
      toast.error('Failed to add sample cards');
    }
  };

  return (
    <Button onClick={handleLoadSampleCards} variant="secondary">
      Load Sample Cards
    </Button>
  );
};

export default SampleCardsButton;
