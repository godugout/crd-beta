
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';

interface CardCreationFlowProps {
  initialMetadata?: any;
}

const CardCreationFlow: React.FC<CardCreationFlowProps> = ({
  initialMetadata
}) => {
  const navigate = useNavigate();
  const { addCard } = useCards();

  const handleCreateCard = async (cardData: Partial<Card>) => {
    try {
      await addCard(cardData);
      navigate('/gallery');
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  return (
    <div className="space-y-6 bg-[var(--bg-primary)] min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Create New Card</h2>
        <p className="text-[var(--text-secondary)]">
          Use the unified card editor to create your custom trading card.
        </p>
      </div>
    </div>
  );
};

export default CardCreationFlow;
