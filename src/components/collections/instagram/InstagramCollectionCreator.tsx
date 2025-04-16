import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

interface InstagramPost {
  id: string;
  caption: string;
  mediaUrl: string;
  thumbnailUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  timestamp: string;
  username: string;
  postId: string;
  tags?: string[];
}

const InstagramCollectionCreator = () => {
  const { createCollection } = useCards();
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<InstagramPost[]>([]);
  const [collectionName, setCollectionName] = useState('');
  const [description, setDescription] = useState('');
  const [collectionTags, setCollectionTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (username) {
      fetchInstagramPosts(username);
    }
  }, [username]);
  
  const fetchInstagramPosts = async (username: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      const mockPosts: InstagramPost[] = [
        {
          id: '1',
          postId: '1',
          username: username,
          mediaType: 'IMAGE',
          mediaUrl: 'https://images.unsplash.com/photo-1682685797497-f296491f814c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          thumbnailUrl: 'https://images.unsplash.com/photo-1682685797497-f296491f814c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          caption: 'Sample post 1',
          permalink: 'https://instagram.com/p/1',
          timestamp: new Date().toISOString(),
          tags: ['sample', 'test']
        },
        {
          id: '2',
          postId: '2',
          username: username,
          mediaType: 'IMAGE',
          mediaUrl: 'https://images.unsplash.com/photo-1696224908344-5382a3c949d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          thumbnailUrl: 'https://images.unsplash.com/photo-1696224908344-5382a3c949d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          caption: 'Sample post 2',
          permalink: 'https://instagram.com/p/2',
          timestamp: new Date().toISOString(),
          tags: ['sample', 'test']
        }
      ];
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      toast.error('Failed to fetch Instagram posts');
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePostSelection = (post: InstagramPost) => {
    if (selectedPosts.find(p => p.id === post.id)) {
      setSelectedPosts(selectedPosts.filter(p => p.id !== post.id));
    } else {
      setSelectedPosts([...selectedPosts, post]);
    }
  };

  const handleCreateCollection = async () => {
    try {
      setIsSubmitting(true);
      
      if (selectedPosts.length === 0) {
        toast.error('Please select at least one post');
        return;
      }
      
      const collectionCards = selectedPosts.map(post => {
        const card: Omit<Card, "id" | "createdAt" | "updatedAt"> = {
          title: post.caption.substring(0, 50) || `Instagram post from ${username}`,
          description: post.caption,
          imageUrl: post.mediaUrl,
          thumbnailUrl: post.thumbnailUrl || post.mediaUrl,
          tags: post.tags || [],
          userId: 'anonymous',
          isPublic: true,
          effects: [],
          rarity: 'common',
          designMetadata: DEFAULT_DESIGN_METADATA
        };
        return card;
      });
      
      // Create the collection with all required properties
      const newCollection = await createCollection({
        name: collectionName,
        description: description,
        cards: [],
        coverImageUrl: selectedPosts[0]?.mediaUrl || '',
        tags: collectionTags,
        userId: 'anonymous',
        isPublic: true,
        cardIds: [],
        visibility: 'public' as const,
        allowComments: true,
        designMetadata: {},
        instagramSource: {
          username: username,
          lastFetched: new Date().toISOString(),
          autoUpdate: false
        }
      });
      
      toast.success('Collection created successfully');
      setSelectedPosts([]);
      setCollectionName('');
      setDescription('');
      setCollectionTags([]);
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="username">Instagram Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      
      {isLoading && <p>Loading posts...</p>}
      
      <div className="grid grid-cols-3 gap-4">
        {posts.map(post => (
          <div
            key={post.id}
            className={`relative cursor-pointer ${selectedPosts.find(p => p.id === post.id) ? 'border-2 border-blue-500' : ''}`}
            onClick={() => togglePostSelection(post)}
          >
            <img src={post.thumbnailUrl} alt={post.caption} className="aspect-square object-cover" />
            <div className="absolute top-0 left-0 w-full h-full bg-black/20 flex items-center justify-center text-white text-xl">
              {selectedPosts.find(p => p.id === post.id) && '✓'}
            </div>
          </div>
        ))}
      </div>
      
      <div>
        <Label htmlFor="collectionName">Collection Name</Label>
        <Input
          id="collectionName"
          type="text"
          placeholder="Enter collection name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          type="text"
          placeholder="Enter tags, separated by commas"
          value={collectionTags.join(',')}
          onChange={(e) => setCollectionTags(e.target.value.split(','))}
        />
      </div>
      
      <Button onClick={handleCreateCollection} disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Collection'}
      </Button>
    </div>
  );
};

export default InstagramCollectionCreator;
