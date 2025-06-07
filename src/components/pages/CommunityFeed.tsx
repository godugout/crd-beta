
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card as CardComponent, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Card } from '@/lib/types/cardTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const CommunityFeed = () => {
  const [posts, setPosts] = useState<Card[]>([
    {
      id: '1',
      title: 'Exciting Game Highlights',
      description: 'Check out the amazing highlights from last night\'s game!',
      imageUrl: '/images/card-placeholder.png',
      thumbnailUrl: '/images/card-placeholder.png',
      userId: 'user1',
      tags: ['basketball', 'highlights', 'sports'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effects: [],
      designMetadata: {
        cardStyle: {
          template: 'classic',
          effect: 'none',
          borderRadius: '8px',
          borderColor: '#000000',
          frameColor: '#000000',
          frameWidth: 2,
          shadowColor: 'rgba(0,0,0,0.2)',
        },
        textStyle: {
          titleColor: '#000000',
          titleAlignment: 'center',
          titleWeight: 'bold',
          descriptionColor: '#333333',
        },
        marketMetadata: {
          isPrintable: false,
          isForSale: false,
          includeInCatalog: false,
        },
        cardMetadata: {
          category: 'general',
          cardType: 'standard',
          series: 'base',
        },
      },
    },
    {
      id: '2',
      title: 'New Card Design',
      description: 'I just created a new card design. What do you think?',
      imageUrl: '/images/card-placeholder.png',
      thumbnailUrl: '/images/card-placeholder.png',
      userId: 'user2',
      tags: ['carddesign', 'digitalart', 'creative'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effects: [],
      designMetadata: {
        cardStyle: {
          template: 'modern',
          effect: 'glow',
          borderRadius: '12px',
          borderColor: '#333333',
          frameColor: '#333333',
          frameWidth: 3,
          shadowColor: 'rgba(0,0,0,0.3)',
        },
        textStyle: {
          titleColor: '#FFFFFF',
          titleAlignment: 'left',
          titleWeight: 'bold', // Changed from 'semibold' to 'bold'
          descriptionColor: '#EEEEEE',
        },
        marketMetadata: {
          isPrintable: true,
          isForSale: true,
          includeInCatalog: true,
        },
        cardMetadata: {
          category: 'art',
          cardType: 'limitededition',
          series: 'artistseries',
        },
      },
    },
  ]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Community Feed</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <CardComponent key={post.id}>
            <CardHeader>
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <CardTitle className="text-sm font-semibold">{post.title}</CardTitle>
                  <p className="text-xs text-gray-500">@username</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <img src={post.imageUrl} alt={post.title} className="w-full rounded-md mb-3" />
              <p className="text-sm text-gray-700">{post.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </CardComponent>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
