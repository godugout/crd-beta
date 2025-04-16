
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useCollection } from '@/context/card/hooks';
import { Collection, InstagramPost } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { Loader, Instagram, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

const InstagramCollectionCreator: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  
  const { addCollection } = useCollection();
  const navigate = useNavigate();
  
  const fetchInstagramPosts = async () => {
    if (!username.trim()) {
      toast.error('Please enter an Instagram username');
      return;
    }
    
    setIsLoadingPosts(true);
    setErrorMessage(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('instagram-scraper', {
        body: { username: username.replace('@', '') }
      });
      
      if (error) {
        console.error('Instagram API error:', error);
        setErrorMessage(`Error connecting to Instagram: ${error.message}`);
        toast.error('Failed to fetch Instagram posts');
        return;
      }
      
      if (!data?.posts || data.posts.length === 0) {
        setErrorMessage('No posts found for this Instagram account');
        toast.error('No Instagram posts found');
        return;
      }
      
      // Transform Instagram posts to our format
      const posts: InstagramPost[] = data.posts.map((post: any) => ({
        id: post.id,
        postId: post.id,
        username: username,
        caption: post.caption || '',
        imageUrl: post.media_url,
        permalink: post.permalink,
        timestamp: post.timestamp,
        mediaType: post.media_type,
        mediaUrl: post.media_url,
        thumbnailUrl: post.thumbnail_url || post.media_url,
      }));
      
      setInstagramPosts(posts);
      toast.success(`Found ${posts.length} Instagram posts`);
    } catch (error: any) {
      console.error('Error fetching Instagram posts:', error);
      setErrorMessage(`Error: ${error.message}`);
      toast.error('Failed to connect to Instagram');
    } finally {
      setIsLoadingPosts(false);
    }
  };
  
  const handleConnectInstagram = async () => {
    setIsConnecting(true);
    try {
      await fetchInstagramPosts();
    } finally {
      setIsConnecting(false);
    }
  };
  
  const createCollectionFromPosts = async () => {
    if (instagramPosts.length === 0) {
      toast.error('No Instagram posts to create collection from');
      return;
    }
    
    try {
      setIsConnecting(true);
      
      // Create a new collection with Instagram content
      const newCollection: Collection = {
        id: `instagram-${Date.now()}`,
        name: `${username}'s Instagram Collection`,
        description: `Photos imported from Instagram account @${username}`,
        cards: instagramPosts.map((post, index) => adaptToCard({
          id: `instagram-card-${post.postId || index}`,
          title: post.caption?.substring(0, 50) || `Instagram post ${index + 1}`,
          description: post.caption || '',
          imageUrl: post.mediaUrl,
          thumbnailUrl: post.thumbnailUrl || post.mediaUrl,
          createdAt: post.timestamp || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 'user-1',
          tags: ['instagram', 'imported'],
          effects: []
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        coverImageUrl: instagramPosts[0]?.mediaUrl || '',
        tags: ['instagram', 'social', 'imported'],
        userId: 'user-1',
        isPublic: true,
        instagramSource: {
          username: username,
          lastFetched: new Date().toISOString(),
          autoUpdate: false
        }
      };
      
      // Add the collection
      const result = await addCollection(newCollection);
      
      toast.success(`Successfully created collection from Instagram posts`);
      
      // Navigate to the collection page
      navigate(`/collections/${result.id}`);
    } catch (error: any) {
      console.error('Error creating Instagram collection:', error);
      toast.error('Failed to create Instagram collection');
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import from Instagram</CardTitle>
          <CardDescription>
            Connect your Instagram account to import your photos as collectible cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Instagram Username</label>
                <Input 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="@username"
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleConnectInstagram}
                disabled={!username.trim() || isConnecting || isLoadingPosts}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {isLoadingPosts ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Instagram className="mr-2 h-4 w-4" />
                    Find Posts
                  </>
                )}
              </Button>
            </div>
            
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      
      {instagramPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Instagram Posts</CardTitle>
            <CardDescription>
              {instagramPosts.length} posts found from @{username}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {instagramPosts.slice(0, 8).map((post) => (
                <div key={post.id} className="aspect-square rounded-md overflow-hidden">
                  <img 
                    src={post.mediaUrl} 
                    alt={post.caption || 'Instagram post'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {instagramPosts.length > 8 && (
                <div className="aspect-square rounded-md overflow-hidden bg-gray-100 flex items-center justify-center text-gray-500">
                  +{instagramPosts.length - 8} more
                </div>
              )}
            </div>
            
            <Button 
              onClick={createCollectionFromPosts}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating Collection...
                </>
              ) : (
                'Create Collection from Posts'
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstagramCollectionCreator;
