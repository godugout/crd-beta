
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { toast } from 'sonner';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

interface SampleCardsButtonProps {
  className?: string;
}

const SampleCardsButton: React.FC<SampleCardsButtonProps> = ({ className }) => {
  const { addCard } = useCards();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSampleCards = async () => {
    setIsLoading(true);

    try {
      const sampleCards = [
        {
          title: 'Sample Baseball Card',
          description: 'Vintage baseball card from the golden era',
          imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
          thumbnailUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200',
          tags: ['baseball', 'vintage', 'collectible'],
          isPublic: true,
          userId: 'anonymous',
          effects: ['Holographic'],
          rarity: 'rare',
          designMetadata: DEFAULT_DESIGN_METADATA
        },
        {
          title: 'Basketball Legend',
          description: 'Limited edition basketball trading card',
          imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1',
          thumbnailUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=200',
          tags: ['basketball', 'limited', 'sports'],
          isPublic: true,
          userId: 'anonymous',
          effects: ['Refractor'],
          rarity: 'ultra-rare',
          designMetadata: DEFAULT_DESIGN_METADATA
        }
      ];

      for (const cardData of sampleCards) {
        // Type cast to fix Promise vs non-Promise return type issue
        const addCardPromise = addCard as unknown as (card: Omit<Card, "id" | "createdAt" | "updatedAt">) => Promise<Card>;
        await addCardPromise(cardData);
      }

      toast.success('Sample cards added!');
    } catch (error) {
      console.error('Error adding sample cards:', error);
      toast.error('Failed to add sample cards');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleAddSampleCards}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Adding...' : 'Add Sample Cards'}
    </Button>
  );
};

export default SampleCardsButton;
