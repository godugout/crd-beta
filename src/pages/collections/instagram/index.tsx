import React from 'react';
import InstagramCollectionCreator, { InstagramCollectionCreatorProps } from '@/components/collections/instagram/InstagramCollectionCreator';

// Provide the required posts prop (with an empty array if not available)
const InstagramCollectionPage = () => {
  return (
    <InstagramCollectionCreator posts={[]} /> // Provide empty array for posts if not available
  );
};

export default InstagramCollectionPage;
