
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { PlusCircle, Filter, Globe, Layout, ListFilter } from 'lucide-react';
import CollectionGrid from '@/components/collections/CollectionGrid';
import ContentTypeNavigation from '@/components/navigation/ContentTypeNavigation';
import { collectionsNavItems } from '@/config/navigation';
import SampleCardsButton from '@/components/gallery/SampleCardsButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Collections = () => {
  const { collections, isLoading } = useCards();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  
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
      primaryAction={{
        label: "New Collection",
        icon: <PlusCircle className="h-4 w-4" />,
        href: "/collections/new"
      }}
    >
      <Container className="py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground spectrum-text inline-block">Collections</h1>
              <p className="text-[var(--text-secondary)] mt-1">Organize your cards into themed collections</p>
            </div>

            <div className="flex items-center gap-3">
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
              
              <Button variant="rainbow" asChild className="sm:min-w-[140px]">
                <Link to="/collections/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Collection
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Content type navigation with enhanced styling */}
          <div className="backdrop-blur-md bg-[var(--bg-secondary)]/30 p-1 rounded-xl border border-[var(--border-primary)]">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-transparent h-auto p-0 w-full">
                {navigationItems.map((item, i) => (
                  <TabsTrigger 
                    key={i} 
                    value={item.path} 
                    asChild
                    className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto"
                  >
                    <Link to={item.path} className="flex items-center gap-2 w-full">
                      {item.icon}
                      <span className="hidden md:inline">{item.label}</span>
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {collections.length === 0 && !isLoading && (
          <div className="mt-10 p-8 backdrop-blur-md bg-[var(--bg-secondary)]/30 border border-dashed border-[var(--border-primary)] rounded-xl text-center">
            <h3 className="text-lg font-medium mb-3">No collections yet</h3>
            <p className="text-[var(--text-tertiary)] mb-6">Create a collection or generate sample cards to get started</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="rainbow" asChild>
                <Link to="/collections/new">
                  <PlusCircle className="h-4 w-4 mr-2" /> 
                  Create a Collection
                </Link>
              </Button>
              
              <Button variant="glass" asChild>
                <Link to="/collections/commons">
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
    </PageLayout>
  );
};

export default Collections;
