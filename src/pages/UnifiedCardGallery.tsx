
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
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let filtered = allCards;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card => 
        card.title.toLowerCase().includes(query) ||
        (card.description && card.description.toLowerCase().includes(query)) ||
        (card.tags && card.tags.some(tag => tag.toLowerCase().includes(query)))
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

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [allCards, searchQuery, filterTags, filterVisibility, sortBy]);

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

  return (
    <PageLayout
      title="Card Gallery"
      hideBreadcrumbs={false}
      primaryAction={{
        label: "New Card",
        icon: <PlusCircle className="mr-2 h-4 w-4" />,
        href: "/cards/create"
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 py-4">
        {/* Search and Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
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

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
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
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Visibility</label>
                  <Select value={filterVisibility} onValueChange={(value: any) => setFilterVisibility(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cards</SelectItem>
                      <SelectItem value="public">Public Only</SelectItem>
                      <SelectItem value="private">Private Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
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
              </div>
            </div>
          )}

          {/* Selection Controls */}
          {selectedCards.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedCards.length} card{selectedCards.length === 1 ? '' : 's'} selected
              </span>
              <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedCards.length === filteredCards.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Select all {filteredCards.length} cards
              </span>
            </div>
          )}
        </div>

        {/* Cards Display */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No cards found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterTags.length > 0 
                ? "Try adjusting your search or filters" 
                : "Your collection is empty. Create your first card to get started."}
            </p>
            <Button onClick={() => navigate('/cards/create')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create a Card
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" 
            : "space-y-3"
          }>
            {filteredCards.map(card => (
              <div key={card.id} className="relative group">
                {viewMode === 'grid' ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <div 
                        className="aspect-[2.5/3.5] rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                        onClick={() => handleCardClick(card.id)}
                      >
                        <img 
                          src={card.imageUrl || '/placeholder-card.png'}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Checkbox
                        className="absolute top-2 left-2 bg-white/90"
                        checked={selectedCards.includes(card.id)}
                        onCheckedChange={() => handleSelectCard(card.id)}
                      />
                      {!card.isPublic && (
                        <Lock className="absolute top-2 right-2 h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm truncate">{card.title}</h3>
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
                  <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border gap-4">
                    <Checkbox
                      checked={selectedCards.includes(card.id)}
                      onCheckedChange={() => handleSelectCard(card.id)}
                    />
                    <div 
                      className="w-16 h-20 rounded overflow-hidden cursor-pointer"
                      onClick={() => handleCardClick(card.id)}
                    >
                      <img 
                        src={card.imageUrl || '/placeholder-card.png'}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{card.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{card.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {!card.isPublic && (
                          <Lock className="h-3 w-3 text-gray-400" />
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
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default UnifiedCardGallery;
