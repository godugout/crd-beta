
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
  
  // Define collectionsNavItems here since it's referenced in the component
  const collectionsNavItems = [
    { path: "all", title: "All Collections", icon: () => <Layout size={16} /> },
    { path: "featured", title: "Featured", icon: () => <Globe size={16} /> },
    { path: "private", title: "Private", icon: () => <Layout size={16} /> },
  ];
  
  return (
    <PageLayout
      title="Collections"
      description="Manage your card collections"
      hideBreadcrumbs={false}
      primaryAction={{
        label: "New Collection",
        icon: <PlusCircle className="h-4 w-4" />,
        onClick: () => setShowCreateDialog(true)
      }}
    >
      <Container className="py-6">
        <div className="flex items-center gap-3 mb-4">
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
        </div>
          
        <div className="backdrop-blur-md bg-[var(--bg-secondary)]/30 p-1 rounded-xl border border-[var(--border-primary)]">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-transparent h-auto p-0 w-full">
              {collectionsNavItems.map((item, i) => (
                <TabsTrigger 
                  key={i} 
                  value={item.path} 
                  className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto"
                >
                  <div className="flex items-center gap-2 w-full">
                    {typeof item.icon === 'function' ? item.icon() : item.icon}
                    <span className="hidden md:inline">{item.title}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {collections.length === 0 && !isLoading && (
          <div className="mt-10 p-8 backdrop-blur-md bg-[var(--bg-secondary)]/30 border border-dashed border-[var(--border-primary)] rounded-xl text-center">
            <h3 className="text-lg font-medium mb-3">No collections yet</h3>
            <p className="text-[var(--text-tertiary)] mb-6">Create a collection or generate sample cards to get started</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="rainbow" 
                onClick={() => setShowCreateDialog(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" /> 
                Create a Collection
              </Button>
              
              <Button variant="glass">
                <Link to="/collections/commons" className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Generate Commons Cards
                </Link>
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <CollectionGrid 
            collections={collections}
            isLoading={isLoading}
          />
        </div>
      </Container>

      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </PageLayout>
  );
};

export default Collections;
