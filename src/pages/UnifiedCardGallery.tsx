import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/hooks/useCards';
import { basketballCards } from '@/data/basketballCards';
import { Card } from '@/lib/types';
import { 
  Grid3X3, 
  List, 
  Filter, 
  PlusCircle, 
  Trash2, 
  Lock, 
  Unlock, 
  FolderPlus,
  Eye,
  Search,
  X,
  SlidersHorizontal,
  Calendar,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const UnifiedCardGallery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cards, loading, updateCard, deleteCard } = useCards();
  
  // State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterCreator, setFilterCreator] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Combine all card sources
  const allCards = useMemo(() => {
    const combined = cards && cards.length > 0 ? cards : basketballCards;
    return combined as Card[];
  }, [cards]);

  // Get all unique tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allCards.forEach(card => {
      card.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [allCards]);

  // Get unique rarities
  const allRarities = useMemo(() => {
    const rarities = new Set<string>();
    allCards.forEach(card => {
      if (card.rarity) rarities.add(card.rarity);
    });
    return Array.from(rarities);
  }, [allCards]);

  // Get unique creators
  const allCreators = useMemo(() => {
    const creators = new Set<string>();
    allCards.forEach(card => {
      if (card.player) creators.add(card.player);
      if (card.userId) creators.add(card.userId);
    });
    return Array.from(creators);
  }, [allCards]);

  // Filter cards by tab
  const filteredCardsByTab = useMemo(() => {
    let filtered = allCards;

    switch (activeTab) {
      case 'recent':
        filtered = allCards.filter(card => {
          const cardDate = new Date(card.createdAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return cardDate >= thirtyDaysAgo;
        });
        break;
      case 'favorites':
        // For now, show cards with higher rarity as "favorites"
        filtered = allCards.filter(card => card.rarity && ['rare', 'legendary'].includes(card.rarity));
        break;
      case 'all':
      default:
        filtered = allCards;
        break;
    }

    return filtered;
  }, [allCards, activeTab]);

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let filtered = filteredCardsByTab;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card => 
        card.title.toLowerCase().includes(query) ||
        (card.description && card.description.toLowerCase().includes(query)) ||
        (card.tags && card.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (card.player && card.player.toLowerCase().includes(query)) ||
        (card.team && card.team.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (filterTags.length > 0) {
      filtered = filtered.filter(card => 
        filterTags.some(tag => card.tags?.includes(tag))
      );
    }

    // Visibility filter
    if (filterVisibility !== 'all') {
      filtered = filtered.filter(card => {
        const isPublic = card.isPublic ?? true;
        return filterVisibility === 'public' ? isPublic : !isPublic;
      });
    }

    // Rarity filter
    if (filterRarity !== 'all') {
      filtered = filtered.filter(card => card.rarity === filterRarity);
    }

    // Creator filter
    if (filterCreator !== 'all') {
      filtered = filtered.filter(card => 
        card.player === filterCreator || card.userId === filterCreator
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'rarity':
          const rarityOrder = ['common', 'uncommon', 'rare', 'legendary'];
          return rarityOrder.indexOf(b.rarity || 'common') - rarityOrder.indexOf(a.rarity || 'common');
        default:
          return 0;
      }
    });
  }, [filteredCardsByTab, searchQuery, filterTags, filterVisibility, filterRarity, filterCreator, sortBy]);

  // Multi-select operations
  const handleSelectCard = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCards.length === filteredCards.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards(filteredCards.map(card => card.id));
    }
  };

  const handleBulkDelete = async () => {
    for (const cardId of selectedCards) {
      await deleteCard(cardId);
    }
    setSelectedCards([]);
    toast({
      title: "Cards deleted",
      description: `Deleted ${selectedCards.length} cards`,
    });
  };

  const handleBulkVisibilityChange = async (isPublic: boolean) => {
    for (const cardId of selectedCards) {
      await updateCard(cardId, { isPublic });
    }
    setSelectedCards([]);
    toast({
      title: "Visibility updated",
      description: `Updated ${selectedCards.length} cards to ${isPublic ? 'public' : 'private'}`,
    });
  };

  const handleCardClick = (cardId: string) => {
    navigate(`/cards/${cardId}`);
  };

  const toggleTag = (tag: string) => {
    setFilterTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterTags([]);
    setFilterVisibility('all');
    setFilterRarity('all');
    setFilterCreator('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || filterTags.length > 0 || filterVisibility !== 'all' || 
    filterRarity !== 'all' || filterCreator !== 'all' || sortBy !== 'newest';

  return (
    <PageLayout
      title="Cards"
      hideBreadcrumbs={false}
    >
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Header with Title and Description */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Cards</h1>
          <p className="text-gray-600 dark:text-gray-400">Browse and discover unique digital cards</p>
        </div>

        {/* Top Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          {/* Left side - Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Cards</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Right side - Controls */}
          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {[searchQuery, ...filterTags, filterVisibility !== 'all' ? 1 : 0, 
                    filterRarity !== 'all' ? 1 : 0, filterCreator !== 'all' ? 1 : 0].filter(Boolean).length}
                </Badge>
              )}
            </Button>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              />
            </div>

            {/* New Card Button */}
            <Button onClick={() => navigate('/cards/create')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Card
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title, description, player, team, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4 border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sort */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      <SelectItem value="rarity">By Rarity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Visibility */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Visibility</label>
                  <Select value={filterVisibility} onValueChange={(value: any) => setFilterVisibility(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cards</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rarity */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Rarity</label>
                  <Select value={filterRarity} onValueChange={setFilterRarity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rarities</SelectItem>
                      {allRarities.map(rarity => (
                        <SelectItem key={rarity} value={rarity}>
                          {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Creator */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Creator/Player</label>
                  <Select value={filterCreator} onValueChange={setFilterCreator}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Creators</SelectItem>
                      {allCreators.slice(0, 10).map(creator => (
                        <SelectItem key={creator} value={creator}>
                          {creator}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-1">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={filterTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selection Controls */}
        {selectedCards.length > 0 && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-sm font-medium">
              {selectedCards.length} card{selectedCards.length === 1 ? '' : 's'} selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkVisibilityChange(true)}
                className="flex items-center gap-1"
              >
                <Unlock className="h-3 w-3" />
                Make Public
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkVisibilityChange(false)}
                className="flex items-center gap-1"
              >
                <Lock className="h-3 w-3" />
                Make Private
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <FolderPlus className="h-3 w-3" />
                Add to Collection
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCards([])}
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Select All */}
        {filteredCards.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedCards.length === filteredCards.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Select all {filteredCards.length} cards
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Showing {filteredCards.length} of {allCards.length} cards
            </span>
          </div>
        )}

        {/* Basketball Collection Highlight */}
        {filteredCards.some(card => card.tags?.includes('basketball')) && (
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-lg border border-orange-500/20">
            <h2 className="text-lg font-semibold text-orange-400 mb-2">🏀 Basketball Legends Collection</h2>
            <p className="text-gray-300 text-sm">
              Featuring iconic NBA players with unique colored backgrounds and special effects
            </p>
          </div>
        )}

        {/* Cards Display */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="all" className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No cards found</h3>
                <p className="text-gray-500 mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your search or filters" 
                    : "Your collection is empty. Create your first card to get started."}
                </p>
                {hasActiveFilters ? (
                  <Button onClick={clearAllFilters} variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/cards/create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create a Card
                  </Button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" 
                : "space-y-3"
              }>
                {filteredCards.map(card => (
                  <div key={card.id} className="relative group">
                    {viewMode === 'grid' ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <div 
                            className="aspect-[2.5/3.5] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                            onClick={() => handleCardClick(card.id)}
                          >
                            <img 
                              src={card.imageUrl || '/placeholder-card.png'}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                            {card.rarity && card.rarity !== 'common' && (
                              <div className="absolute top-1 right-1">
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  {card.rarity}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <Checkbox
                            className="absolute top-2 left-2 bg-white/90 border-white"
                            checked={selectedCards.includes(card.id)}
                            onCheckedChange={() => handleSelectCard(card.id)}
                          />
                          {!card.isPublic && (
                            <Lock className="absolute bottom-2 right-2 h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                          )}
                        </div>
                        <div className="px-1">
                          <h3 className="font-medium text-sm truncate">{card.title}</h3>
                          {card.player && (
                            <p className="text-xs text-gray-500 truncate">{card.player}</p>
                          )}
                          {card.tags && card.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {card.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="text-xs text-gray-500">#{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border gap-4 hover:shadow-md transition-shadow">
                        <Checkbox
                          checked={selectedCards.includes(card.id)}
                          onCheckedChange={() => handleSelectCard(card.id)}
                        />
                        <div 
                          className="w-16 h-20 rounded overflow-hidden cursor-pointer flex-shrink-0"
                          onClick={() => handleCardClick(card.id)}
                        >
                          <img 
                            src={card.imageUrl || '/placeholder-card.png'}
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{card.title}</h3>
                              {card.player && (
                                <p className="text-sm text-gray-600 truncate">{card.player}</p>
                              )}
                              {card.description && (
                                <p className="text-sm text-gray-500 truncate mt-1">{card.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {!card.isPublic && (
                                  <Lock className="h-3 w-3 text-gray-400" />
                                )}
                                {card.rarity && card.rarity !== 'common' && (
                                  <Badge variant="outline" className="text-xs">
                                    {card.rarity}
                                  </Badge>
                                )}
                                {card.tags && card.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {card.tags.slice(0, 3).map((tag, index) => (
                                      <span key={index} className="text-xs text-gray-400">#{tag}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCardClick(card.id)}
                              className="flex items-center gap-1 flex-shrink-0"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="recent" className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No cards found</h3>
                <p className="text-gray-500 mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your search or filters" 
                    : "Your collection is empty. Create your first card to get started."}
                </p>
                {hasActiveFilters ? (
                  <Button onClick={clearAllFilters} variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/cards/create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create a Card
                  </Button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" 
                : "space-y-3"
              }>
                {filteredCards.map(card => (
                  <div key={card.id} className="relative group">
                    {viewMode === 'grid' ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <div 
                            className="aspect-[2.5/3.5] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                            onClick={() => handleCardClick(card.id)}
                          >
                            <img 
                              src={card.imageUrl || '/placeholder-card.png'}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                            {card.rarity && card.rarity !== 'common' && (
                              <div className="absolute top-1 right-1">
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  {card.rarity}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <Checkbox
                            className="absolute top-2 left-2 bg-white/90 border-white"
                            checked={selectedCards.includes(card.id)}
                            onCheckedChange={() => handleSelectCard(card.id)}
                          />
                          {!card.isPublic && (
                            <Lock className="absolute bottom-2 right-2 h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                          )}
                        </div>
                        <div className="px-1">
                          <h3 className="font-medium text-sm truncate">{card.title}</h3>
                          {card.player && (
                            <p className="text-xs text-gray-500 truncate">{card.player}</p>
                          )}
                          {card.tags && card.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {card.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="text-xs text-gray-500">#{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border gap-4 hover:shadow-md transition-shadow">
                        <Checkbox
                          checked={selectedCards.includes(card.id)}
                          onCheckedChange={() => handleSelectCard(card.id)}
                        />
                        <div 
                          className="w-16 h-20 rounded overflow-hidden cursor-pointer flex-shrink-0"
                          onClick={() => handleCardClick(card.id)}
                        >
                          <img 
                            src={card.imageUrl || '/placeholder-card.png'}
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{card.title}</h3>
                              {card.player && (
                                <p className="text-sm text-gray-600 truncate">{card.player}</p>
                              )}
                              {card.description && (
                                <p className="text-sm text-gray-500 truncate mt-1">{card.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {!card.isPublic && (
                                  <Lock className="h-3 w-3 text-gray-400" />
                                )}
                                {card.rarity && card.rarity !== 'common' && (
                                  <Badge variant="outline" className="text-xs">
                                    {card.rarity}
                                  </Badge>
                                )}
                                {card.tags && card.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {card.tags.slice(0, 3).map((tag, index) => (
                                      <span key={index} className="text-xs text-gray-400">#{tag}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCardClick(card.id)}
                              className="flex items-center gap-1 flex-shrink-0"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="favorites" className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No cards found</h3>
                <p className="text-gray-500 mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your search or filters" 
                    : "Your collection is empty. Create your first card to get started."}
                </p>
                {hasActiveFilters ? (
                  <Button onClick={clearAllFilters} variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/cards/create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create a Card
                  </Button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" 
                : "space-y-3"
              }>
                {filteredCards.map(card => (
                  <div key={card.id} className="relative group">
                    {viewMode === 'grid' ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <div 
                            className="aspect-[2.5/3.5] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                            onClick={() => handleCardClick(card.id)}
                          >
                            <img 
                              src={card.imageUrl || '/placeholder-card.png'}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                            {card.rarity && card.rarity !== 'common' && (
                              <div className="absolute top-1 right-1">
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  {card.rarity}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <Checkbox
                            className="absolute top-2 left-2 bg-white/90 border-white"
                            checked={selectedCards.includes(card.id)}
                            onCheckedChange={() => handleSelectCard(card.id)}
                          />
                          {!card.isPublic && (
                            <Lock className="absolute bottom-2 right-2 h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                          )}
                        </div>
                        <div className="px-1">
                          <h3 className="font-medium text-sm truncate">{card.title}</h3>
                          {card.player && (
                            <p className="text-xs text-gray-500 truncate">{card.player}</p>
                          )}
                          {card.tags && card.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {card.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="text-xs text-gray-500">#{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border gap-4 hover:shadow-md transition-shadow">
                        <Checkbox
                          checked={selectedCards.includes(card.id)}
                          onCheckedChange={() => handleSelectCard(card.id)}
                        />
                        <div 
                          className="w-16 h-20 rounded overflow-hidden cursor-pointer flex-shrink-0"
                          onClick={() => handleCardClick(card.id)}
                        >
                          <img 
                            src={card.imageUrl || '/placeholder-card.png'}
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{card.title}</h3>
                              {card.player && (
                                <p className="text-sm text-gray-600 truncate">{card.player}</p>
                              )}
                              {card.description && (
                                <p className="text-sm text-gray-500 truncate mt-1">{card.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {!card.isPublic && (
                                  <Lock className="h-3 w-3 text-gray-400" />
                                )}
                                {card.rarity && card.rarity !== 'common' && (
                                  <Badge variant="outline" className="text-xs">
                                    {card.rarity}
                                  </Badge>
                                )}
                                {card.tags && card.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {card.tags.slice(0, 3).map((tag, index) => (
                                      <span key={index} className="text-xs text-gray-400">#{tag}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCardClick(card.id)}
                              className="flex items-center gap-1 flex-shrink-0"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default UnifiedCardGallery;
