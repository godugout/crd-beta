
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Gallery = () => {
  return (
    <PageLayout 
      title="Gallery | CardShow" 
      description="Browse our collection of cards"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Card Gallery</h1>
          <Button asChild>
            <Link to="/cards/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Card
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Placeholder for future card gallery items */}
          <div className="bg-muted flex items-center justify-center h-64 rounded-lg">
            Coming soon: Card Gallery
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Gallery;
