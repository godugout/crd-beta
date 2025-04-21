
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Grid3X3, LayoutList, Plus } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/context/CardContext';
import CollectionGrid from '@/components/collections/CollectionGrid';
import CollectionList from '@/components/collections/CollectionList';

const CollectionGallery = () => {
  const { collections, isLoading } = useCards();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');

  // Ensure collections is always an array
  const safeCollections = Array.isArray(collections) ? collections : [];

  // Filter collections based on search term and active tab
  const filteredCollections = safeCollections.filter(collection => {
    if (!collection) return false;
    
    const matchesSearch = (collection.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (collection.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'private') return matchesSearch && collection.visibility === 'private';
    if (activeTab === 'public') return matchesSearch && collection.visibility === 'public';
    
    return matchesSearch;
  });

  return (
    <PageLayout
      title="Collections"
      description="Organize your cards into themed collections"
    >
      <div className="container mx-auto px-4 py-8">
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
                  collections={filteredCollections.filter(c => c && c.visibility === 'private')} 
                  isLoading={isLoading} 
                />
              ) : (
                <CollectionList 
                  collections={filteredCollections.filter(c => c && c.visibility === 'private')} 
                  isLoading={isLoading} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="public" className="mt-4">
              {viewMode === 'grid' ? (
                <CollectionGrid 
                  collections={filteredCollections.filter(c => c && c.visibility === 'public')} 
                  isLoading={isLoading} 
                />
              ) : (
                <CollectionList 
                  collections={filteredCollections.filter(c => c && c.visibility === 'public')} 
                  isLoading={isLoading} 
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default CollectionGallery;
