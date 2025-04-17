
import React from 'react';
import { Button } from '@/components/ui/button';
import { DownloadCloud } from 'lucide-react';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { Card, CardRarity, DesignMetadata } from '@/lib/types';

interface SampleCardsButtonProps {
  onCardsAdded?: (cards: Card[]) => void;
}

const SampleCardsButton: React.FC<SampleCardsButtonProps> = ({ onCardsAdded }) => {
  const { addCard } = useCards();
  
  const handleAddSampleCards = async () => {
    toast.info('Adding sample cards to your collection...');
    
    // Sample cards data
    const sampleCardsData = [
      {
        title: 'Vintage Baseball Card',
        description: 'A classic vintage baseball card from the golden era.',
        imageUrl: 'https://images.unsplash.com/photo-1624456735729-03594a40f9fb',
        thumbnailUrl: 'https://images.unsplash.com/photo-1624456735729-03594a40f9fb?w=300',
        tags: ['vintage', 'baseball', 'classic'],
        effects: ['aged', 'sepia']
      },
      {
        title: 'Modern Basketball Star',
        description: 'Limited edition card featuring a modern basketball superstar.',
        imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=300',
        tags: ['basketball', 'modern', 'star'],
        effects: ['holographic']
      },
      {
        title: 'Stadium Memories',
        description: 'A special card commemorating iconic stadium moments.',
        imageUrl: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0',
        thumbnailUrl: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?w=300',
        tags: ['stadium', 'memories', 'iconic'],
        effects: ['refractor']
      }
    ];
    
    try {
      const cardPromises = sampleCardsData.map(cardData => {
        const designMetadata: DesignMetadata = {
          cardStyle: {
            template: 'standard',
            effect: 'standard',
            borderRadius: '8px',
            borderColor: '#000',
            shadowColor: '#000',
            frameWidth: 2,
            frameColor: '#000'
          },
          textStyle: {
            titleColor: '#000',
            titleAlignment: 'center',
            titleWeight: 'bold',
            descriptionColor: '#333'
          },
          cardMetadata: {
            category: 'sample',
            series: 'demo',
            cardType: 'standard'
          },
          marketMetadata: {
            isPrintable: true,
            isForSale: false,
            includeInCatalog: true
          }
        };
        
        return addCard({ 
          ...cardData,
          isPublic: true,
          userId: 'demo-user',
          rarity: CardRarity.COMMON, // Use the enum instead of string
          designMetadata
        });
      });
      
      const addedCards = await Promise.all(cardPromises);
      
      toast.success(`Added ${addedCards.length} sample cards to your collection!`);
      
      if (onCardsAdded) {
        onCardsAdded(addedCards);
      }
    } catch (error) {
      toast.error('Failed to add sample cards');
      console.error('Error adding sample cards:', error);
    }
  };
  
  return (
    <Button onClick={handleAddSampleCards} variant="outline" className="gap-2">
      <DownloadCloud className="w-4 h-4" />
      Add Sample Cards
    </Button>
  );
};

export default SampleCardsButton;
