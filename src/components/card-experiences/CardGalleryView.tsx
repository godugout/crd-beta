
import React, { useState, useMemo } from 'react';
import { useCards } from '@/context/CardContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, List, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardGalleryViewProps {
  onCardClick: (cardId: string) => void;
}

const CardGalleryView: React.FC<CardGalleryViewProps> = ({ onCardClick }) => {
  const { cards } = useCards();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Extract all unique tags from all cards
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    cards.forEach(card => {
      card.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [cards]);
  
  // Filter cards based on search query and selected tags
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by selected tags
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => card.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [cards, searchQuery, selectedTags]);
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 bg-gray-900 border-gray-700 text-white"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full text-gray-400 hover:text-white"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-gray-400 hover:text-white",
              viewMode === 'grid' && "bg-gray-800 text-white"
            )}
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-gray-400 hover:text-white",
              viewMode === 'list' && "bg-gray-800 text-white"
            )}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <Badge
            key={tag}
            variant="outline"
            className={cn(
              "cursor-pointer hover:bg-gray-700 transition-colors",
              selectedTags.includes(tag) && "bg-green-500 hover:bg-green-600 text-white border-green-500"
            )}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
        {(selectedTags.length > 0 || searchQuery) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-gray-400 hover:text-white"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        )}
      </div>
      
      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No cards found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" 
          : "space-y-4"
        }>
          {filteredCards.map(card => (
            viewMode === 'grid' ? (
              <div 
                key={card.id}
                className="cursor-pointer"
                onClick={() => onCardClick(card.id)}
              >
                <div 
                  className="aspect-[2.5/3.5] rounded-lg overflow-hidden"
                  style={{
                    borderRadius: card.designMetadata?.cardStyle?.borderRadius || '8px',
                    boxShadow: `0 0 20px ${card.designMetadata?.cardStyle?.shadowColor || 'rgba(0,0,0,0.2)'}`,
                    border: `${card.designMetadata?.cardStyle?.frameWidth || 2}px solid ${card.designMetadata?.cardStyle?.frameColor || '#000'}`,
                  }}
                >
                  <img 
                    src={card.imageUrl} 
                    alt={card.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-sm truncate">{card.title}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {card.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-xs text-gray-400">#{tag}</span>
                    ))}
                    {card.tags.length > 2 && (
                      <span className="text-xs text-gray-400">+{card.tags.length - 2} more</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div 
                key={card.id}
                className="flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onCardClick(card.id)}
              >
                <div 
                  className="w-20 h-20 flex-shrink-0"
                  style={{
                    boxShadow: `0 0 10px ${card.designMetadata?.cardStyle?.shadowColor || 'rgba(0,0,0,0.2)'}`,
                    border: `${card.designMetadata?.cardStyle?.frameWidth || 2}px solid ${card.designMetadata?.cardStyle?.frameColor || '#000'}`,
                  }}
                >
                  <img 
                    src={card.imageUrl} 
                    alt={card.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{card.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-1">{card.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {card.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs text-gray-400">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default CardGalleryView;
