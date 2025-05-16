import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types/cardTypes'; 

const SampleCardsButton = () => {
  const { addCard } = useCards();
  const { toast } = useToast();
  
  const addSampleCards = () => {
    // Sample card 1
    const sampleCard1: Omit<Card, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Sample Baseball Card',
      description: 'A classic baseball card with holographic effects',
      imageUrl: '/placeholder-card.png',
      thumbnailUrl: '/placeholder-card.png',
      tags: ['baseball', 'sample', 'holographic'],
      userId: 'sample-user',
      effects: ['holographic', 'refractor'],
      player: 'John Doe',
      team: 'Cardinals',
      year: '2023',
      designMetadata: {
        cardStyle: {
          template: 'classic',
          effect: 'holographic',
          borderRadius: '12px',
          borderColor: '#c9a66b',
          backgroundColor: '#f5f5f5',
          frameWidth: 8,
          frameColor: '#c9a66b',
          shadowColor: 'rgba(0,0,0,0.3)'
        },
        textStyle: {
          titleColor: '#333',
          titleAlignment: 'center',
          titleWeight: 'bold',
          descriptionColor: '#666'
        },
        cardMetadata: {
          category: 'sports',
          series: 'demo',
          cardType: 'baseball'
        },
        marketMetadata: {
          price: 0,
          currency: 'USD',
          availableForSale: false,
          editionSize: 100,
          editionNumber: 1,
          isPrintable: true,
          isForSale: false,
          includeInCatalog: true
        }
      }
    };
    
    // Sample card 2
    const sampleCard2: Omit<Card, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Sample Football Card',
      description: 'A classic football card with holographic effects',
      imageUrl: '/placeholder-card.png',
      thumbnailUrl: '/placeholder-card.png',
      tags: ['football', 'sample', 'holographic'],
      userId: 'sample-user',
      effects: ['holographic', 'refractor'],
      player: 'Jane Doe',
      team: 'Giants',
      year: '2023',
      designMetadata: {
        cardStyle: {
          template: 'classic',
          effect: 'holographic',
          borderRadius: '12px',
          borderColor: '#c9a66b',
          backgroundColor: '#f5f5f5',
          frameWidth: 8,
          frameColor: '#c9a66b',
          shadowColor: 'rgba(0,0,0,0.3)'
        },
        textStyle: {
          titleColor: '#333',
          titleAlignment: 'center',
          titleWeight: 'bold',
          descriptionColor: '#666'
        },
        cardMetadata: {
          category: 'sports',
          series: 'demo',
          cardType: 'football'
        },
        marketMetadata: {
          price: 0,
          currency: 'USD',
          availableForSale: false,
          editionSize: 100,
          editionNumber: 1,
          isPrintable: true,
          isForSale: false,
          includeInCatalog: true
        }
      }
    };
    
    // Sample card 3
    const sampleCard3: Omit<Card, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Sample Basketball Card',
      description: 'A classic basketball card with holographic effects',
      imageUrl: '/placeholder-card.png',
      thumbnailUrl: '/placeholder-card.png',
      tags: ['basketball', 'sample', 'holographic'],
      userId: 'sample-user',
      effects: ['holographic', 'refractor'],
      player: 'Sam Smith',
      team: 'Heat',
      year: '2023',
      designMetadata: {
        cardStyle: {
          template: 'classic',
          effect: 'holographic',
          borderRadius: '12px',
          borderColor: '#c9a66b',
          backgroundColor: '#f5f5f5',
          frameWidth: 8,
          frameColor: '#c9a66b',
          shadowColor: 'rgba(0,0,0,0.3)'
        },
        textStyle: {
          titleColor: '#333',
          titleAlignment: 'center',
          titleWeight: 'bold',
          descriptionColor: '#666'
        },
        cardMetadata: {
          category: 'sports',
          series: 'demo',
          cardType: 'basketball'
        },
        marketMetadata: {
          price: 0,
          currency: 'USD',
          availableForSale: false,
          editionSize: 100,
          editionNumber: 1,
          isPrintable: true,
          isForSale: false,
          includeInCatalog: true
        }
      }
    };
    
    // Add the sample cards
    addCard(sampleCard1);
    addCard(sampleCard2);
    addCard(sampleCard3);
    
    toast({
      title: "Sample Cards Added",
      description: "Sample cards have been added to your collection.",
      variant: "success"
    });
  };
  
  return (
    <Button onClick={addSampleCards} variant="outline" size="sm" className="flex items-center gap-1">
      <Sparkles className="h-4 w-4" />
      <span>Add Sample Cards</span>
    </Button>
  );
};

export default SampleCardsButton;
