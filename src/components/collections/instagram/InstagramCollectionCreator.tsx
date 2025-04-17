
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardRarity, InstagramPost } from '@/lib/types';
import { Collection, useCards } from '@/context/CardContext';
import { toast } from 'sonner';

interface InstagramCollectionCreatorProps {
  posts: InstagramPost[];
  onCollectionCreated?: (collection: Collection) => void;
}

const InstagramCollectionCreator: React.FC<InstagramCollectionCreatorProps> = ({
  posts,
  onCollectionCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  
  const { addCard, createCollection } = useCards();
  
  const handleTogglePost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for your collection');
      return;
    }
    
    if (selectedPosts.length === 0) {
      toast.error('Please select at least one post');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create cards from selected posts
      const cardPromises = selectedPosts.map(postId => {
        const post = posts.find(p => p.id === postId);
        if (!post) return null;
        
        return addCard({
          title: post.caption.substring(0, 50) + (post.caption.length > 50 ? '...' : ''),
          description: post.caption,
          imageUrl: post.mediaUrl || post.imageUrl,
          thumbnailUrl: post.thumbnailUrl || post.mediaUrl || post.imageUrl,
          tags: post.tags || ['instagram'],
          isPublic: true,
          effects: [],
          rarity: CardRarity.COMMON,
          designMetadata: {
            cardStyle: {
              template: 'instagram',
              effect: 'social',
              borderRadius: '12px',
              borderColor: '#e1306c',
              shadowColor: '#8a3ab9',
              frameWidth: 2,
              frameColor: '#e1306c'
            },
            textStyle: {
              titleColor: '#262626',
              titleAlignment: 'left',
              titleWeight: 'bold',
              descriptionColor: '#333333'
            },
            cardMetadata: {
              category: 'social',
              series: 'instagram',
              cardType: 'post'
            }
          }
        });
      });
      
      const createdCards = await Promise.all(cardPromises);
      const validCards = createdCards.filter(Boolean) as Card[];
      
      // Create collection with the cards
      if (createCollection) {
        const newCollection = await createCollection({
          title,
          description,
          cards: validCards,
          coverImageUrl: posts.find(p => p.id === selectedPosts[0])?.mediaUrl || 
                         posts.find(p => p.id === selectedPosts[0])?.thumbnailUrl ||
                         posts.find(p => p.id === selectedPosts[0])?.imageUrl,
          cardIds: validCards.map(card => card.id),
          isPublic: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        toast.success('Collection created successfully!');
        
        // Notify parent component
        if (onCollectionCreated) {
          onCollectionCreated(newCollection);
        }
      } else {
        toast.error('Collection creation not available');
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedPosts([]);
    } catch (error) {
      toast.error('Failed to create collection');
      console.error('Error creating collection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Create Instagram Collection</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Collection Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter collection title"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your collection"
            rows={3}
          />
        </div>
        
        <div>
          <Label className="block mb-3">Select Posts</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {posts.map(post => (
              <div 
                key={post.id}
                onClick={() => handleTogglePost(post.id)}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedPosts.includes(post.id) 
                    ? 'border-primary scale-95 opacity-80' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={post.thumbnailUrl || post.mediaUrl || post.imageUrl} 
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-600">Selected {selectedPosts.length} of {posts.length} posts</p>
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating Collection...' : 'Create Collection'}
        </Button>
      </form>
    </div>
  );
};

export default InstagramCollectionCreator;
