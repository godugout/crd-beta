
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Grid3X3 } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';
import CardGalleryComponent from '@/components/CardGallery';
import { cardsNavItems } from '@/config/navigationConfig';
import ContentTypeNavigation from '@/components/navigation/ContentTypeNavigation';

const CardGallery = () => {
  // Create navigation items for content type navigation
  const navigationItems = cardsNavItems.map(item => ({
    label: item.label,
    path: item.path,
    icon: item.icon ? <item.icon className="h-4 w-4" /> : undefined,
    description: item.description
  }));

  return (
    <PageLayout
      title="Card Gallery"
      description="Browse your digital cards and collections"
      hideBreadcrumbs={false} // Show breadcrumbs using the centralized approach
    >
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
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
        
        {/* Content type navigation */}
        <div className="mb-8">
          <ContentTypeNavigation 
            items={navigationItems}
            variant="pills"
          />
        </div>
        
        <CardGalleryComponent />
      </div>
    </PageLayout>
  );
};

export default CardGallery;
