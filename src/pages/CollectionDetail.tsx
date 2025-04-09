
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import CardGrid from '@/components/gallery/CardGrid';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Grid, List, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardList from '@/components/gallery/CardList';
import { toast } from 'sonner';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { collections, cards, isLoading } = useCards();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const collection = collections.find(c => c.id === id);
  const collectionCards = collection 
    ? cards.filter(card => collection.cardIds.includes(card.id))
    : [];
  
  if (isLoading) {
    return (
      <PageLayout title="Loading Collection..." description="Please wait">
        <div className="max-w-7xl mx-auto p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!collection) {
    return (
      <PageLayout title="Collection Not Found" description="The requested collection could not be found">
        <div className="max-w-7xl mx-auto p-4 text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Collection Not Found</h1>
          <p className="mb-8">The collection you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/collections">Browse Collections</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const handleCardClick = (cardId: string) => {
    // Navigate to card detail view
  };

  const handleShareCollection = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Collection link copied to clipboard'))
      .catch(() => toast.error('Failed to copy collection link'));
  };

  return (
    <PageLayout 
      title={collection.name} 
      description={collection.description || 'View cards in this collection'}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Collection header */}
        <div className="mb-8">
          <Link 
            to="/collections" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to collections
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{collection.name}</h1>
              {collection.description && (
                <p className="text-gray-600 mt-2">{collection.description}</p>
              )}
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span className="inline-flex items-center mr-4">
                  {collectionCards.length} card{collectionCards.length !== 1 ? 's' : ''}
                </span>
                <span className="capitalize">{collection.visibility}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-gray-100' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-gray-100' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShareCollection}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {collectionCards.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">No cards in this collection yet</h2>
              <p className="text-gray-600 mb-6">This collection is empty. Add some cards to see them here.</p>
              <Button asChild>
                <Link to="/cards">Browse Cards</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Cards</TabsTrigger>
              {/* Additional tabs could be added here for card categories */}
            </TabsList>
            <TabsContent value="all">
              {viewMode === 'grid' ? (
                <CardGrid 
                  cards={collectionCards}
                  onCardClick={handleCardClick}
                  cardEffects={[]}
                  className=""
                />
              ) : (
                <CardList 
                  cards={collectionCards}
                  onCardClick={handleCardClick}
                  className=""
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PageLayout>
  );
};

export default CollectionDetail;
