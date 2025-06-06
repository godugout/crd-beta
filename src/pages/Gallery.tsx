
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Gallery = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Cards', count: 1247 },
    { id: 'sports', label: 'Sports', count: 892 },
    { id: 'entertainment', label: 'Entertainment', count: 234 },
    { id: 'gaming', label: 'Gaming', count: 121 },
  ];

  const featuredCards = [
    {
      id: 1,
      title: "Aaron Judge Home Run Record",
      creator: "BaseballFan2023",
      views: 15420,
      likes: 2847,
      category: "Sports",
      gradient: "from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/10",
      border: "[var(--brand-primary)]/30"
    },
    {
      id: 2,
      title: "Vintage Mickey Mantle Tribute",
      creator: "CardCollector",
      views: 9876,
      likes: 1965,
      category: "Classic",
      gradient: "from-[var(--brand-accent)]/20 to-[var(--brand-warning)]/10",
      border: "[var(--brand-accent)]/30"
    },
    {
      id: 3,
      title: "Shohei Ohtani Two-Way Star",
      creator: "MLBFanatic",
      views: 12358,
      likes: 2103,
      category: "Sports",
      gradient: "from-[var(--brand-success)]/20 to-[var(--brand-primary)]/10",
      border: "[var(--brand-success)]/30"
    }
  ];

  return (
    <PageLayout
      title="Gallery"
      description="Discover amazing digital cards from creators worldwide"
      fullWidth={true}
      hideBreadcrumbs={true}
      hideDescription={true}
      contentClassName="p-0"
    >
      {/* Simplified Header Section */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[var(--brand-accent)]/15 to-[var(--brand-warning)]/10 rounded-full blur-3xl"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-none">
              Card <span className="text-brand-gradient">Gallery</span>
            </h1>
            
            <p className="text-xl text-[var(--text-tertiary)] max-w-3xl mx-auto leading-relaxed mb-8">
              Explore thousands of unique digital cards created by talented artists and collectors
            </p>

            {/* Unified Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/60" />
                <Input
                  placeholder="Search cards, creators, or collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-4 text-lg bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/60 focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)] backdrop-blur-xl"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        {/* Simplified Navigation Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="w-full max-w-xl mx-auto justify-center p-1 bg-white/5 border border-white/10 rounded-xl">
            <TabsTrigger value="all" className="flex-1 py-3 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white">
              All Cards
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex-1 py-3 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Recent
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex-1 py-3 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Featured
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex-1 py-3 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Popular
            </TabsTrigger>
          </TabsList>

          {/* Unified Filter Controls */}
          <div className="flex items-center justify-between mt-6 mb-8">
            {/* Category Pills */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white shadow-[var(--shadow-brand)]'
                      : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {filter.label}
                  <Badge className="ml-2 bg-white/20 text-white/90">
                    {filter.count}
                  </Badge>
                </button>
              ))}
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
              
              <Button variant="glass" size="sm" className="px-4">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <TabsContent value="all">
            {/* Card Grid */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="group">
                  <div className="bento-card bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                    {/* Card content placeholder */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-white/10 to-white/5 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-white/40 text-2xl font-bold">CARD</div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1">Sample Card #{index + 1}</h3>
                    <p className="text-[var(--text-tertiary)] text-sm mb-3">by Creator{index + 1}</p>
                    
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {Math.floor(Math.random() * 1000)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="featured">
            {/* Featured Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCards.map((card) => (
                <div key={card.id} className="group">
                  <div className={`bento-card relative overflow-hidden h-full bg-gradient-to-br ${card.gradient} border border-${card.border} hover:border-${card.border.replace('/30', '/50')} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
                    {/* Card Image Placeholder */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-white/10 to-white/5 rounded-lg mb-6 flex items-center justify-center">
                      <div className="text-white/40 text-4xl font-bold">CARD</div>
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-[var(--text-tertiary)] mb-4">by {card.creator}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-white/60">
                          <Star className="w-4 h-4" />
                          {card.likes.toLocaleString()}
                        </span>
                        
                        <Badge className={`bg-gradient-to-r ${card.gradient} border border-${card.border} text-white font-medium`}>
                          {card.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="group">
                  <div className="bento-card bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                    {/* Card content placeholder */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-white/10 to-white/5 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-white/40 text-2xl font-bold">CARD</div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1">New Card #{index + 1}</h3>
                    <p className="text-[var(--text-tertiary)] text-sm mb-3">by Creator{index + 1}</p>
                    
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="text-xs text-[var(--brand-accent)]">New</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="popular">
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="group">
                  <div className="bento-card bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                    {/* Card content placeholder */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-white/10 to-white/5 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-white/40 text-2xl font-bold">CARD</div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1">Popular Card #{index + 1}</h3>
                    <p className="text-[var(--text-tertiary)] text-sm mb-3">by Creator{index + 1}</p>
                    
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {Math.floor(1000 + Math.random() * 9000)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </PageLayout>
  );
};

export default Gallery;
