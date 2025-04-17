
import React from 'react';
import InstagramCollectionCreator from '@/components/collections/instagram/InstagramCollectionCreator';
import { InstagramPost } from '@/lib/types/instagram';

// Define the props type here if it's not exported from the component
interface InstagramPostType {
  id: string;
  imageUrl: string;
  caption?: string;
  timestamp?: string;
  username?: string;
  // Add other required properties
}

// Convert InstagramPostType to InstagramPost
const convertToInstagramPost = (post: InstagramPostType): InstagramPost => {
  return {
    id: post.id,
    caption: post.caption || '',
    imageUrl: post.imageUrl,
    thumbnailUrl: post.imageUrl,
    postUrl: `https://instagram.com/p/${post.id}`,
    timestamp: post.timestamp || new Date().toISOString(),
    likes: 0,
    comments: 0,
    username: post.username || 'user',
    userProfileUrl: `https://instagram.com/${post.username || 'user'}`,
    mediaType: 'IMAGE',
    tags: []
  };
};

// Provide the required posts prop with proper conversion
const InstagramCollectionPage = () => {
  const emptyPosts: InstagramPostType[] = [];
  
  // Convert InstagramPostType to InstagramPost
  const convertedPosts = emptyPosts.map(convertToInstagramPost);
  
  return (
    <InstagramCollectionCreator posts={convertedPosts} />
  );
};

export default InstagramCollectionPage;
