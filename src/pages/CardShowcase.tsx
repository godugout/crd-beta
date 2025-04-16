import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const CardShowcase = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        
        // In a production app, fetch from API
        const sampleCards: Card[] = [
          {
            id: 'showcase-1',
            title: 'Featured Card 1',
            description: 'This is a featured card',
            imageUrl: '/featured-card-1.jpg',
            thumbnailUrl: '/featured-card-1-thumb.jpg',
            collectionId: 'featured-collection',
            userId: 'system',
            teamId: 'system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublic: true,
            tags: ['featured', 'showcase'],
            designMetadata: {},
            effects: ['Holographic', 'Chrome'], // Add required effects property
          },
          {
            id: 'showcase-2',
            title: 'Featured Card 2',
            description: 'Another featured card',
            imageUrl: '/featured-card-2.jpg',
            thumbnailUrl: '/featured-card-2-thumb.jpg',
            collectionId: 'featured-collection',
            userId: 'system',
            teamId: 'system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublic: true,
            tags: ['featured', 'trending'],
            designMetadata: {},
            effects: ['Refractor'], // Add required effects property
          },
        ];
        
        setCards(sampleCards);
      } catch (error) {
        console.error('Error fetching showcase cards:', error);
        toast({
          title: 'Error loading showcase',
          description: 'Failed to load featured cards',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCards();
  }, [toast]);

  return (
    <PageLayout title="Card Showcase" description="Featured cards from the community">
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Cards</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map(card => (
              <div key={card.id} className="bg-white rounded-lg shadow-md p-4">
                <img src={card.imageUrl} alt={card.title} className="w-full h-48 object-cover mb-2 rounded-md" />
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
                <Button className="mt-4">View Card</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CardShowcase;
