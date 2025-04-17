
import React from 'react';
import InstagramCollectionCreator from '@/components/collections/instagram/InstagramCollectionCreator';

// Define the props type here if it's not exported from the component
interface InstagramPostType {
  id: string;
  imageUrl: string;
  caption?: string;
  timestamp?: string;
  username?: string;
  // Add other required properties
}

// Provide the required posts prop (with an empty array if not available)
const InstagramCollectionPage = () => {
  const emptyPosts: InstagramPostType[] = [];
  
  return (
    <InstagramCollectionCreator posts={emptyPosts} />
  );
};

export default InstagramCollectionPage;
