
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';
import CardGalleryComponent from '@/components/CardGallery';

const CardGallery = () => {
  return (
    <PageLayout
      title="Card Gallery"
      description="Browse your digital cards and collections"
    >
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Card Gallery</h1>
            <p className="text-muted-foreground">
              Browse your digital cards and collections
            </p>
          </div>
          <div>
            <Button asChild>
              <Link to="/cards/create" className="flex items-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Card
              </Link>
            </Button>
          </div>
        </div>
        
        <CardGalleryComponent />
      </div>
    </PageLayout>
  );
};

export default CardGallery;
