
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { PlusCircle, Filter, Globe } from 'lucide-react';
import CollectionGrid from '@/components/collections/CollectionGrid';
import ContentTypeNavigation from '@/components/navigation/ContentTypeNavigation';
import { collectionsNavItems } from '@/config/navigation';
import SampleCardsButton from '@/components/gallery/SampleCardsButton';

const Collections = () => {
  const { collections, isLoading } = useCards();
  
  // Create navigation items for content type navigation
  const navigationItems = collectionsNavItems.map(item => ({
    label: item.title,
    path: item.path,
    icon: item.icon ? <item.icon className="h-4 w-4" /> : undefined,
    description: item.description
  }));
  
  return (
    <PageLayout
      title="Collections | CardShow"
      description="Manage your card collections"
      hideBreadcrumbs={false}
    >
      <Container className="py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Collections</h1>
            <p className="text-muted-foreground mt-1">Organize your cards into themed collections</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button asChild>
              <Link to="/collections/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Collection
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
        
        {collections.length === 0 && !isLoading && (
          <div className="mb-10 p-8 border border-dashed rounded-lg text-center">
            <h3 className="text-lg font-medium mb-3">No collections yet</h3>
            <p className="text-muted-foreground mb-6">Create a collection or generate sample cards to get started</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/collections/new">
                  <PlusCircle className="h-4 w-4 mr-2" /> 
                  Create a Collection
                </Link>
              </Button>
              
              <Button asChild variant="secondary">
                <Link to="/collections/commons">
                  <Globe className="h-4 w-4 mr-2" />
                  Generate Commons Cards
                </Link>
              </Button>
            </div>
          </div>
        )}
        
        <CollectionGrid 
          collections={collections}
          isLoading={isLoading}
        />
      </Container>
    </PageLayout>
  );
};

export default Collections;
