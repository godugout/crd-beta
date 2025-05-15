
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import CardCreationWizard from '@/components/card-studio/CardCreationWizard';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/lib/types/cardTypes';
import { useCards } from '@/context/CardContext';

const CardStudio: React.FC = () => {
  const navigate = useNavigate();
  const { addCard } = useCards();
  const { toast } = useToast();
  
  // Handle completion of card creation
  const handleComplete = async (card: Card) => {
    try {
      // Add the card to the collection
      await addCard(card);
      
      // Show success message
      toast({
        title: "Card Created!",
        description: "Your card has been successfully created and saved to your collection.",
      });
      
      // Navigate to gallery with refresh parameter
      navigate('/gallery?refresh=true');
    } catch (error) {
      console.error('Error creating card:', error);
      toast({
        title: "Creation Failed",
        description: "There was a problem creating your card. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle cancellation
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <PageLayout
      title="Card Studio"
      description="Create amazing trading cards with our advanced design tools"
    >
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <CardCreationWizard
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </div>
    </PageLayout>
  );
};

export default CardStudio;
