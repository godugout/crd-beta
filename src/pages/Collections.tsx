import React, { useState } from 'react';
import { Plus, Search, Grid, List, Folder, Star, Eye, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import PageLayout from '@/components/navigation/PageLayout';
import CreateCollectionDialog from '@/components/collections/CreateCollectionDialog';

const Collections = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const featuredCollections = [
    {
      id: 1,
      name: "Baseball Legends",
      description: "The greatest players in baseball history",
      cardCount: 47,
      views: 8542,
      likes: 1203,
      owner: "BaseballHistorian",
      gradient: "from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/10",
      border: "[var(--brand-primary)]/30"
    },
    {
      id: 2,
      name: "Rookie Cards 2024",
      description: "Fresh faces making their mark",
      cardCount: 23,
      views: 5429,
      likes: 892,
      owner: "RookieWatcher",
      gradient: "from-[var(--brand-accent)]/20 to-[var(--brand-warning)]/10",
      border: "[var(--brand-accent)]/30"
    },
    {
      id: 3,
      name: "Vintage Treasures",
      description: "Classic cards from the golden era",
      cardCount: 112,
      views: 12847,
      likes: 2156,
      owner: "VintageCollector",
      gradient: "from-[var(--brand-success)]/20 to-[var(--brand-primary)]/10",
      border: "[var(--brand-success)]/30"
    }
  ];

  const myCollections = [
    { id: 1, name: "My Favorites", cardCount: 34, isPrivate: false },
    { id: 2, name: "Trade Bait", cardCount: 18, isPrivate: true },
    { id: 3, name: "Hall of Famers", cardCount: 67, isPrivate: false },
    { id: 4, name: "Modern Stars", cardCount: 29, isPrivate: false },
  ];

  return (
    <PageLayout
      title="Collections | CardShow"
      description="Organize and showcase your digital card collections"
      fullWidth={true}
    >
      {/* Enhanced Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[var(--brand-success)]/20 to-[var(--brand-primary)]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[var(--brand-accent)]/15 to-[var(--brand-warning)]/10 rounded-full blur-3xl"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative mb-8">
              <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                Card
                <span className="block text-brand-gradient">Collections</span>
              </h1>
            </div>
            
            <p className="text-2xl text-[var(--text-secondary)] mb-6 font-semibold">
              Organize & Showcase Your Cards
            </p>
            <p className="text-xl text-[var(--text-tertiary)] max-w-3xl mx-auto leading-relaxed mb-12">
              Create beautiful collections, discover curated sets from other collectors, and showcase your most prized digital cards
            </p>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap justify-center gap-6">
              <div className="relative">
                <CrdButton 
                  onClick={() => setShowCreateDialog(true)}
                  variant="spectrum" 
                  size="lg"
                  className="btn-sharp font-bold px-10 py-4 text-lg shadow-[var(--shadow-brand)]"
                >
                  <Plus className="mr-3 h-6 w-6" />
                  Create Collection
                </CrdButton>
              </div>
              
              <Button 
                variant="glass" 
                size="lg"
                className="font-bold px-10 py-4 text-lg border-2 border-[var(--border-highlight)] hover:border-[var(--border-glow)]"
              >
                <Search className="mr-3 h-6 w-6" />
                Explore Collections
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        {/* Enhanced Search & Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/60 focus:border-[var(--brand-primary)] backdrop-blur-xl"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* My Collections Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
                My <span className="text-brand-gradient">Collections</span>
              </h2>
              <p className="text-xl text-[var(--text-secondary)] font-medium">
                Your personal collections
              </p>
            </div>
            
            <CrdButton 
              onClick={() => setShowCreateDialog(true)}
              variant="spectrum" 
              size="lg" 
              className="btn-sharp"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Collection
            </CrdButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myCollections.map((collection) => (
              <div key={collection.id} className="group">
                <div className="bento-card bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden clip-corner-tr">
                  {/* Collection Icon */}
                  <div className="w-full aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-lg mb-4 flex items-center justify-center">
                    <Folder className="w-12 h-12 text-white/60" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{collection.name}</h3>
                      {collection.isPrivate && (
                        <Badge className="bg-white/10 text-white/80 text-xs">Private</Badge>
                      )}
                    </div>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      {collection.cardCount} cards
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Collections Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
                Featured <span className="text-brand-gradient">Collections</span>
              </h2>
              <p className="text-xl text-[var(--text-secondary)] font-medium">
                Curated by the community
              </p>
            </div>
            
            <Button variant="glass" size="lg" className="font-semibold">
              <Star className="w-5 h-5 mr-2" />
              View All Featured
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCollections.map((collection) => (
              <div key={collection.id} className="group">
                <div className={`bento-card relative overflow-hidden h-full bg-gradient-to-br ${collection.gradient} border border-${collection.border} hover:border-${collection.border.replace('/30', '/50')} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl clip-corner-tr`}>
                  {/* Collection Preview */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 rounded-lg mb-6 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-2 w-3/4 h-3/4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white/20 rounded aspect-[3/4] flex items-center justify-center">
                          <div className="text-white/40 text-xs font-bold">CARD</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">{collection.name}</h3>
                    <p className="text-[var(--text-tertiary)] mb-4 line-clamp-2">{collection.description}</p>
                    <p className="text-[var(--text-secondary)] text-sm mb-4">by {collection.owner}</p>
                    
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Folder className="w-4 h-4" />
                        {collection.cardCount} cards
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {collection.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {collection.likes.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
