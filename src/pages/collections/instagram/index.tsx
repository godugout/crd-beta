
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import InstagramCollectionCreator from '@/components/collections/instagram/InstagramCollectionCreator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstagramCollectionPage = () => {
  return (
    <PageLayout 
      title="Instagram Collection" 
      description="Create a collection from Instagram posts"
    >
      <div className="container mx-auto py-8">
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Instagram API Access Required</AlertTitle>
          <AlertDescription>
            This feature requires an Instagram API access token to be configured. 
            Please ensure you have set up the INSTAGRAM_ACCESS_TOKEN in your Supabase environment.
            <Link to="/collections" className="text-blue-500 hover:underline ml-2">
              Return to Collections
            </Link>
          </AlertDescription>
        </Alert>
        
        <InstagramCollectionCreator />
      </div>
    </PageLayout>
  );
};

export default InstagramCollectionPage;
