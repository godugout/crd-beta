
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Card } from '@/lib/types/cardTypes';
import { Reaction } from '@/lib/types/interaction';
import { useToast } from '@/hooks/use-toast';
import { adaptToCard } from '@/lib/adapters/cardAdapter';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

const CommunityFeed = () => {
  const [feedCards, setFeedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCommunityCards = async () => {
      try {
        setLoading(true);
        
        // In a production app, fetch from API
        const communityCards: Card[] = [
          adaptToCard({
            id: 'community-1',
            title: 'Community Card 1',
            description: 'This is a community-created card',
            imageUrl: '/community-card-1.jpg',
            thumbnailUrl: '/community-card-1-thumb.jpg',
            userId: 'user1',
            collectionId: 'collection1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublic: true,
            tags: ['community', 'created'],
            reactions: [
              {
                id: 'reaction1',
                userId: 'user2',
                type: 'like',
                createdAt: new Date().toISOString(),
                targetType: 'card',
                targetId: 'community-1'
              }
            ],
            effects: ['Holographic'],
            designMetadata: DEFAULT_DESIGN_METADATA
          }),
          adaptToCard({
            id: 'community-2',
            title: 'Community Card 2',
            description: 'Another community-created card',
            imageUrl: '/community-card-2.jpg',
            thumbnailUrl: '/community-card-2-thumb.jpg',
            userId: 'user3',
            collectionId: 'collection2',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublic: true,
            tags: ['community', 'trending'],
            reactions: [],
            effects: ['Chrome', 'Refractor'],
            designMetadata: DEFAULT_DESIGN_METADATA
          }),
        ];
        
        setFeedCards(communityCards);
      } catch (error) {
        console.error('Error fetching community feed:', error);
        toast({
          title: 'Error loading feed',
          description: 'Failed to load community cards',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommunityCards();
  }, [toast]);

  return (
    <PageLayout title="Community Feed" description="See what others are creating">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Community Feed</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : feedCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedCards.map(card => (
              <div key={card.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img 
                    src={card.imageUrl || '/placeholder-card.png'} 
                    alt={card.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{card.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{card.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {card.tags?.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {new Date(card.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      {card.reactions?.length || 0} reactions
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No community cards found</h3>
            <p className="text-gray-500">Check back later for new content</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CommunityFeed;
