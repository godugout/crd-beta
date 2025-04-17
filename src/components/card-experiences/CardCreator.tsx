
// Create a minimal CardCreator component to fix error in Experiences.tsx
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCards } from '@/hooks/useCards';

export interface CardCreatorProps {
  onComplete?: (card: Card) => void;
}

const CardCreator: React.FC<CardCreatorProps> = ({ onComplete }) => {
  const { addCard } = useCards();
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreateSampleCard = async () => {
    setIsCreating(true);
    
    try {
      const newCard = await addCard({
        title: 'Sample Card',
        description: 'Created from the card creator experience',
        imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        effects: ['Holographic'],
        tags: ['sample', 'new']
      });
      
      if (onComplete) {
        onComplete(newCard);
      }
    } catch (error) {
      console.error('Error creating card:', error);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Create a New Card</h2>
        <p className="text-gray-400 mt-2">
          Design and customize your own digital collectible card
        </p>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleCreateSampleCard}
          disabled={isCreating}
          className="bg-green-500 hover:bg-green-600"
          size="lg"
        >
          {isCreating ? 'Creating...' : 'Create Sample Card'}
        </Button>
      </div>
    </div>
  );
};

export default CardCreator;
