import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { Card, Collection } from '@/lib/types';
import { InstagramPost } from '@/lib/types/instagram';
import { toast } from 'sonner';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

interface InstagramCollectionCreatorProps {
  instagramPosts: InstagramPost[];
  username: string;
  onComplete?: (collection: Collection) => void;
  onCancel?: () => void;
}

const InstagramCollectionCreator: React.FC<InstagramCollectionCreatorProps> = ({
  instagramPosts,
  username,
  onComplete,
  onCancel
}) => {
  const [selectedPosts, setSelectedPosts] = useState<InstagramPost[]>([]);
  const [collectionName, setCollectionName] = useState(`${username}'s Instagram Collection`);
  const [isCreating, setIsCreating] = useState(false);
  const { createCollection, addCard } = useCards();
  
  const togglePostSelection = (post: InstagramPost) => {
    setSelectedPosts(prev => {
      if (prev.find(p => p.id === post.id)) {
        return prev.filter(p => p.id !== post.id);
      } else {
        return [...prev, post];
      }
    });
  };
  
  const isPostSelected = (post: InstagramPost) => {
    return selectedPosts.find(p => p.id === post.id) !== undefined;
  };
  
  const handleCollectionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollectionName(e.target.value);
  };
  
  const handleCancelCreation = () => {
    if (onCancel) {
      onCancel();
    }
  };
  
  const handleCreateCollection = async () => {
    if (selectedPosts.length === 0) {
      toast.error('Please select at least one post');
      return;
    }
    
    if (!collectionName.trim()) {
      toast.error('Please provide a collection name');
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Create collection first
      const newCollection = await createCollection({
        name: collectionName,
        description: `Collection created from ${username}'s Instagram posts`,
        coverImageUrl: selectedPosts[0].mediaUrl,
        tags: ['instagram', username],
        userId: 'anonymous', // Would use actual user ID in a real app
        isPublic: true,
        visibility: 'public',
        allowComments: true,
        cardIds: [],
        designMetadata: {},
        instagramSource: {
          username,
          lastFetched: new Date().toISOString(),
          autoUpdate: false
        }
      });
      
      // Add cards for each selected post
      const cardPromises = selectedPosts.map(post => {
        return addCard({
          title: post.caption.slice(0, 50) + (post.caption.length > 50 ? '...' : ''),
          description: post.caption,
          imageUrl: post.mediaUrl,
          thumbnailUrl: post.thumbnailUrl || post.mediaUrl,
          tags: post.tags || ['instagram'],
          userId: 'anonymous', // Would use actual user ID in a real app
          isPublic: true,
          effects: [],
          rarity: 'common',
          collectionId: newCollection.id,
          designMetadata: DEFAULT_DESIGN_METADATA
        });
      });
      
      const createdCards = await Promise.all(cardPromises);
      
      toast.success(`Created collection with ${createdCards.length} cards!`);
      
      if (onComplete) {
        onComplete({
          ...newCollection,
          cards: createdCards
        });
      }
    } catch (error) {
      console.error('Error creating Instagram collection:', error);
      toast.error('Failed to create collection');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Create Instagram Collection</h2>
      
      <div className="mb-4">
        <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700">
          Collection Name
        </label>
        <input
          type="text"
          id="collectionName"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={collectionName}
          onChange={handleCollectionNameChange}
        />
      </div>
      
      <h3 className="text-md font-semibold mb-2">Select Posts</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {instagramPosts.map(post => (
          <div key={post.id} className="relative">
            <img
              src={post.thumbnailUrl}
              alt={post.caption}
              className={`w-full rounded-md cursor-pointer ${isPostSelected(post) ? 'ring-2 ring-indigo-500' : ''}`}
              onClick={() => togglePostSelection(post)}
            />
            {isPostSelected(post) && (
              <div className="absolute inset-0 bg-black opacity-50 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">Selected</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={handleCancelCreation}>
          Cancel
        </Button>
        <Button onClick={handleCreateCollection} disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create Collection'}
        </Button>
      </div>
    </div>
  );
};

export default InstagramCollectionCreator;
