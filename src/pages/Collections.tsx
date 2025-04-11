
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { PlusCircle, Filter } from 'lucide-react';
import CollectionGrid from '@/components/collections/CollectionGrid';

const Collections = () => {
  const { collections, isLoading } = useCards();
  
  return (
    <PageLayout
      title="Collections | CardShow"
      description="Manage your card collections"
    >
      <Container className="py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
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
        
        <CollectionGrid 
          collections={collections}
          isLoading={isLoading}
        />
      </Container>
    </PageLayout>
  );
};

export default Collections;
