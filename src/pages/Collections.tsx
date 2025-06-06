
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { PlusCircle, Filter, Layout, ListFilter, Globe } from 'lucide-react';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateCollectionDialog from '@/components/collections/CreateCollectionDialog';

const Collections = () => {
  const { collections, isLoading } = useCards();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <PageLayout
      title="Collections"
      description="Manage your card collections"
      hideBreadcrumbs={false}
      className="pb-8"
      contentClassName="space-y-4"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' 
                ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]' 
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}
            >
              <Layout size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' 
                ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]' 
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}
            >
              <ListFilter size={16} />
            </button>
          </div>
          
          <Button variant="soft" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <Button 
            variant="default" 
            size="sm"
            onClick={() => setShowCreateDialog(true)}
            className="bg-[var(--brand-primary)] text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>
      }
    >
      <Container>
        <Tabs defaultValue="all" className="w-full">
          <div className="bg-[var(--bg-secondary)]/30 backdrop-blur-md border border-[var(--border-primary)] rounded-xl overflow-hidden">
            <TabsList className="w-full grid grid-cols-3 bg-transparent p-1 h-auto">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto"
              >
                <div className="flex items-center gap-2">
                  <Layout size={16} />
                  <span>All Collections</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="featured" 
                className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto"
              >
                <div className="flex items-center gap-2">
                  <Globe size={16} />
                  <span>Featured</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="private" 
                className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto"
              >
                <div className="flex items-center gap-2">
                  <Layout size={16} />
                  <span>Private</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-6">
            <CollectionGrid collections={collections} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="featured" className="mt-6">
            <CollectionGrid 
              collections={collections.filter(c => c.featured)} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="private" className="mt-6">
            <CollectionGrid 
              collections={collections.filter(c => c.visibility === 'private')} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </Container>

      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </PageLayout>
  );
};

export default Collections;
