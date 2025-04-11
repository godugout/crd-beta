
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardPreview } from '@/components/ui/card-preview';
import { Search as SearchIcon, FilterX } from 'lucide-react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Mock search results
  const mockCards = [
    {
      id: '1',
      title: 'Oakland Home Run',
      description: 'Amazing home run at the Oakland Coliseum',
      imageUrl: 'https://placehold.co/600x800/092916/FFFFFF/png?text=Oakland+Card',
      tags: ['Oakland', 'Home Run', '2023']
    },
    {
      id: '2',
      title: 'SF Giants Victory',
      description: 'Giants win the championship series',
      imageUrl: 'https://placehold.co/600x800/FD5A1E/FFFFFF/png?text=Giants+Card',
      tags: ['SF Giants', 'Victory', 'Championship']
    }
  ];

  const mockCollections = [
    {
      id: '1',
      title: 'Best of 2023',
      description: 'Top moments from the 2023 season',
      imageUrl: 'https://placehold.co/600x400/1A472A/FFFFFF/png?text=2023+Collection',
      cardCount: 12
    },
    {
      id: '2',
      title: 'Oakland Memories',
      description: 'Collection of Oakland baseball memories',
      imageUrl: 'https://placehold.co/600x400/092916/FFFFFF/png?text=Oakland+Memories',
      cardCount: 24
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // In a real implementation, this would trigger an API search
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  return (
    <PageLayout
      title="Search | CardShow"
      description="Search for cards, collections, and more"
    >
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="text-muted-foreground mt-1">Find cards, collections, and users</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search cards, collections, teams..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>

        <Tabs defaultValue="cards">
          <TabsList className="mb-6">
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            {mockCards.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mockCards.map(card => (
                  <CardPreview
                    key={card.id}
                    imageUrl={card.imageUrl}
                    title={card.title}
                    description={card.description}
                    tags={card.tags}
                    onClick={() => console.log('Card clicked:', card.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FilterX className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Results Found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="collections">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCollections.map(collection => (
                <div key={collection.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div 
                    className="h-48 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${collection.imageUrl})` }}
                  ></div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{collection.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{collection.description}</p>
                    <p className="text-sm">{collection.cardCount} cards</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="text-center py-12">
              <FilterX className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Results Found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms</p>
            </div>
          </TabsContent>

          <TabsContent value="teams">
            <div className="text-center py-12">
              <FilterX className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Results Found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms</p>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </PageLayout>
  );
};

export default Search;
