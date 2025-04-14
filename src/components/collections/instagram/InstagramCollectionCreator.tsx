
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InstagramPost } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { v4 as uuidv4 } from 'uuid';
import { useCollection } from '@/context/card/hooks';

// Form schema
const formSchema = z.object({
  collectionName: z.string().min(1, 'Collection name is required'),
  instagramInput: z.string().min(1, 'Instagram username or URL is required'),
});

type FormValues = z.infer<typeof formSchema>;

const InstagramCollectionCreator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addCollection } = useCollection();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collectionName: '',
      instagramInput: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      // Parse the input to determine if it's a URL or username
      const isUrl = values.instagramInput.includes('instagram.com');
      
      const payload = isUrl 
        ? { url: values.instagramInput } 
        : { username: values.instagramInput };

      // Call our edge function to fetch Instagram posts
      const { data, error } = await supabase.functions.invoke('instagram-scraper', {
        body: payload,
      });

      if (error) {
        throw new Error(error.message || 'Failed to fetch Instagram posts');
      }

      if (!data || !data.posts || data.posts.length === 0) {
        throw new Error('No posts found for this Instagram account');
      }

      // Extract username from input
      let username = values.instagramInput;
      if (isUrl) {
        const match = values.instagramInput.match(/instagram\.com\/([^\/\?]+)/);
        if (match && match[1]) {
          username = match[1];
        }
      }

      // Create a new collection
      const newCollection = addCollection({
        name: values.collectionName,
        description: `Instagram collection for @${username}`,
        coverImageUrl: data.posts[0].media_url || data.posts[0].thumbnail_url,
        instagramSource: {
          username,
          lastFetched: new Date().toISOString(),
          autoUpdate: true,
        },
      });

      // Convert Instagram posts to cards
      const cards = data.posts.map((post: InstagramPost) => ({
        id: uuidv4(),
        title: `Instagram post by @${username}`,
        description: post.caption || '',
        imageUrl: post.media_url || post.thumbnail_url,
        thumbnailUrl: post.thumbnail_url || post.media_url,
        collectionId: newCollection.id,
        tags: ['instagram', username],
        instagramUsername: username,
        instagramPostId: post.id,
        instagramPost: post,
        createdAt: new Date(post.timestamp).toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Add cards to the collection
      cards.forEach(card => {
        if (newCollection) {
          addCardToCollection(newCollection.id, card);
        }
      });

      toast({
        title: "Instagram Collection Created",
        description: `Created collection with ${cards.length} posts from @${username}`,
      });

      // Navigate to the new collection
      navigate(`/collections/${newCollection.id}`);

    } catch (error) {
      console.error('Error creating Instagram collection:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to create Instagram collection',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create Instagram Collection</CardTitle>
        <CardDescription>
          Turn an Instagram profile into a collection of custom CRDs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="collectionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Instagram Collection" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a name for this collection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagramInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram Username or URL</FormLabel>
                  <FormControl>
                    <Input placeholder="@username or https://instagram.com/username" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter an Instagram username or profile URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size={16} className="mr-2" />
                  Fetching posts...
                </>
              ) : (
                "Create InstaCRD Collection"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Will fetch up to 33 most recent posts
        </p>
      </CardFooter>
    </Card>
  );
};

const addCardToCollection = (collectionId: string, card: any) => {
  // In a real implementation, this would call the addCardToCollection function
  // from context or a repository
  console.log('Adding card to collection:', collectionId, card);
  return true;
};

export default InstagramCollectionCreator;
