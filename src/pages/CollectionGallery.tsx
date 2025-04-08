
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Grid3X3, LayoutList, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useCards } from '@/context/CardContext';
import CollectionGrid from '@/components/collections/CollectionGrid';
import CollectionList from '@/components/collections/CollectionList';

const CollectionGallery = () => {
  const { collections, isLoading } = useCards();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');

  // Filter collections based on search term and active tab
  const filteredCollections = collections?.filter(collection => {
    const matchesSearch = collection.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'private') return matchesSearch && collection.visibility === 'private';
    if (activeTab === 'public') return matchesSearch && collection.visibility === 'public';
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-16">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-cardshow-dark mb-2">Collections</h1>
              <p className="text-cardshow-slate">
                Organize your cards into themed collections
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input 
                type="search" 
                placeholder="Search collections..." 
                className="w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button asChild>
                <Link to="/collections/new" className="flex items-center whitespace-nowrap">
                  <Plus className="mr-2 h-4 w-4" />
                  New Collection
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Collections</TabsTrigger>
                  <TabsTrigger value="private">Private</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={viewMode === 'grid' ? 'bg-gray-100' : ''}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className={viewMode === 'list' ? 'bg-gray-100' : ''}
                    onClick={() => setViewMode('list')}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="all" className="mt-4">
                {viewMode === 'grid' ? (
                  <CollectionGrid collections={filteredCollections || []} isLoading={isLoading} />
                ) : (
                  <CollectionList collections={filteredCollections || []} isLoading={isLoading} />
                )}
              </TabsContent>
              
              <TabsContent value="private" className="mt-4">
                {viewMode === 'grid' ? (
                  <CollectionGrid 
                    collections={(filteredCollections || []).filter(c => c.visibility === 'private')} 
                    isLoading={isLoading} 
                  />
                ) : (
                  <CollectionList 
                    collections={(filteredCollections || []).filter(c => c.visibility === 'private')} 
                    isLoading={isLoading} 
                  />
                )}
              </TabsContent>
              
              <TabsContent value="public" className="mt-4">
                {viewMode === 'grid' ? (
                  <CollectionGrid 
                    collections={(filteredCollections || []).filter(c => c.visibility === 'public')} 
                    isLoading={isLoading} 
                  />
                ) : (
                  <CollectionList 
                    collections={(filteredCollections || []).filter(c => c.visibility === 'public')} 
                    isLoading={isLoading} 
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollectionGallery;
