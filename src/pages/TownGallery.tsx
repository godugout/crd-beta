
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import TownGalleryCard from '@/components/towns/TownGalleryCard';
import TownGalleryFilters from '@/components/towns/TownGalleryFilters';
import TownGalleryLoading from '@/components/towns/TownGalleryLoading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Building, Filter, Grid3X3, LayoutList, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTownGalleryData from '@/hooks/useTownGalleryData';

const TownGallery = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pass required arguments to useTownGalleryData hook
  // Adding empty filter and sorting options as default parameters
  const { towns, loading, error } = useTownGalleryData({}, {});
  
  return (
    <PageLayout 
      title="Towns" 
      description="Browse town memories and groups"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' 
                ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]' 
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' 
                ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]' 
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}
            >
              <LayoutList size={16} />
            </button>
          </div>
          
          <Button variant="soft" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <Button 
            variant="default" 
            size="sm"
            className="bg-[var(--brand-primary)] text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Town
          </Button>
        </div>
      }
    >
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-[var(--bg-secondary)]/30 backdrop-blur-md border border-[var(--border-primary)] rounded-xl overflow-hidden">
            <TabsList className="w-full grid grid-cols-3 bg-transparent p-1 h-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto">
                All Towns
              </TabsTrigger>
              <TabsTrigger value="featured" className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto">
                Featured
              </TabsTrigger>
              <TabsTrigger value="nearby" className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto">
                Nearby
              </TabsTrigger>
            </TabsList>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="all">
            {loading ? (
              <TownGalleryLoading />
            ) : towns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {towns.map(town => (
                  <TownGalleryCard key={town.id} town={town} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No towns found</p>
                <p className="text-gray-400">Try adjusting your filters or check back later</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="featured">
            {loading ? (
              <TownGalleryLoading />
            ) : towns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {towns.map(town => (
                  <TownGalleryCard key={town.id} town={town} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No towns found</p>
                <p className="text-gray-400">Try adjusting your filters or check back later</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="nearby">
            {loading ? (
              <TownGalleryLoading />
            ) : towns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {towns.map(town => (
                  <TownGalleryCard key={town.id} town={town} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No towns found</p>
                <p className="text-gray-400">Try adjusting your filters or check back later</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default TownGallery;
