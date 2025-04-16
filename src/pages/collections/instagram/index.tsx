
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import InstagramCollectionCreator from '@/components/collections/instagram/InstagramCollectionCreator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';

const InstagramCollectionPage = () => {
  return (
    <PageLayout 
      title="Instagram Collection" 
      description="Create a collection from Instagram posts"
    >
      <Container className="py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Instagram Collection</h1>
          <p className="text-muted-foreground">
            Import your Instagram feed to create a collection of digital cards
          </p>
        </div>
        
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Instagram API Access</AlertTitle>
          <AlertDescription>
            This feature uses Instagram's API to fetch your public posts. You need to provide a valid username.
            <Link to="/collections" className="text-blue-500 hover:underline ml-2">
              Return to Collections
            </Link>
          </AlertDescription>
        </Alert>
        
        <InstagramCollectionCreator />
      </Container>
    </PageLayout>
  );
};

export default InstagramCollectionPage;
