
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <PageLayout 
      title="Home" 
      description="Welcome to your digital collection"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Collection</h1>
          <p className="text-lg text-gray-600 mb-8">
            Create, manage, and share your digital card collection
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/cards/create">Create New Card</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/cards">Browse Gallery</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-3">Card Gallery</h2>
            <p className="mb-4">Browse your collection of cards and memories</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/cards">View Cards</Link>
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-3">Collections</h2>
            <p className="mb-4">Organize your cards into themed collections</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/collections">View Collections</Link>
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-3">Memory Packs</h2>
            <p className="mb-4">Explore themed memory packs</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/packs">Browse Packs</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
