
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

interface CardForm {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  effects: string[];
}

const CardCreator = () => {
  const navigate = useNavigate();
  const { addCard } = useCards();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardData, setCardData] = useState<CardForm>({
    title: '',
    description: '',
    imageUrl: '',
    tags: [] as string[],
    effects: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCardData(prev => ({
      ...prev,
      tags: value.split(',').map(tag => tag.trim())
    }));
  };

  const handleEffectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCardData(prev => ({
      ...prev,
      effects: value.split(',').map(effect => effect.trim())
    }));
  };

  const handleCreateCard = async () => {
    if (isSubmitting) return;
    
    if (!cardData.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your card.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const cardToCreate = {
        id: uuidv4(),
        title: cardData.title,
        description: cardData.description,
        imageUrl: cardData.imageUrl,
        thumbnailUrl: cardData.imageUrl,
        tags: cardData.tags,
        effects: cardData.effects,
        userId: 'current-user',
        designMetadata: DEFAULT_DESIGN_METADATA,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const newCard = await addCard(cardToCreate);

      toast({
        title: "Card created!",
        description: "Your new card has been created successfully.",
      });

      navigate(`/cards/${newCard.id}`);
    } catch (error) {
      console.error("Error creating card:", error);
      toast({
        title: "Creation failed",
        description: "There was an error creating your card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="Create Card" description="Create a new card in your collection">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Create New Card</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={cardData.title}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={cardData.description}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={cardData.imageUrl}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              id="tags"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={cardData.tags.join(', ')}
              onChange={handleTagChange}
            />
          </div>

          <div>
            <label htmlFor="effects" className="block text-sm font-medium text-gray-700">Effects (comma separated)</label>
            <input
              type="text"
              name="effects"
              id="effects"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={cardData.effects.join(', ')}
              onChange={handleEffectChange}
            />
          </div>
          
          <div>
            <Button 
              onClick={handleCreateCard}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Creating..." : "Create Card"}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardCreator;
