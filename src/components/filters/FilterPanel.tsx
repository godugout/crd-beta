
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterPanelProps {
  filters: {
    searchQuery: string;
    tags: string[];
    sortBy: string;
  };
  onFilterChange: (filters: Partial<{ searchQuery: string; tags: string[]; sortBy: string }>) => void;
}

// Sample tags for filtering
const availableTags = [
  'basketball', 'prince', 'bulls', 'lakers', 'music', 'legends', 'current', 'art'
];

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ searchQuery: e.target.value });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({ sortBy: value });
  };

  const handleTagClick = (tag: string) => {
    const updatedTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    onFilterChange({ tags: updatedTags });
  };

  const clearFilters = () => {
    onFilterChange({
      searchQuery: '',
      tags: [],
      sortBy: 'newest'
    });
  };

  return (
    <div className="space-y-6 bg-card p-4 rounded-lg border">
      <h3 className="font-semibold text-lg mb-2">Filters</h3>
      
      {/* Search */}
      <div>
        <label className="text-sm font-medium mb-1 block">Search</label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
      </div>
      
      {/* Sort */}
      <div>
        <label className="text-sm font-medium mb-1 block">Sort By</label>
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Tags */}
      <div>
        <label className="text-sm font-medium mb-1 block">Popular Tags</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availableTags.map(tag => (
            <Badge
              key={tag}
              variant={filters.tags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer ${filters.tags.includes(tag) ? '' : 'bg-transparent hover:bg-secondary'}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Clear Filters button */}
      {(filters.searchQuery || filters.tags.length > 0 || filters.sortBy !== 'newest') && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterPanel;
