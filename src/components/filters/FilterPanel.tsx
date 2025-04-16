
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    searchQuery: string;
    tags: string[];
    sortBy: string;
  };
  onFilterChange: (filters: Partial<FilterPanelProps['filters']>) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange
}) => {
  // Common tags for the filter suggestions
  const commonTags = [
    'basketball', 'football', 'baseball', 'soccer', 
    'legends', 'current', 'vintage', 'holographic'
  ];

  // Filter suggestions based on what's not already selected
  const tagSuggestions = commonTags.filter(tag => !filters.tags.includes(tag));

  // Handle adding a tag
  const handleAddTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      onFilterChange({ tags: [...filters.tags, tag] });
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tag: string) => {
    onFilterChange({ tags: filters.tags.filter(t => t !== tag) });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      {/* Search input */}
      <div className="mb-4">
        <Label htmlFor="search" className="block mb-2 text-sm">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search cards..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          className="w-full"
        />
      </div>
      
      {/* Sort options */}
      <div className="mb-4">
        <Label htmlFor="sort" className="block mb-2 text-sm">Sort By</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFilterChange({ sortBy: value })}
        >
          <SelectTrigger id="sort" className="w-full">
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
      
      {/* Tags section */}
      <div className="mb-4">
        <Label className="block mb-2 text-sm">Tags</Label>
        
        {/* Selected tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {filters.tags.length > 0 ? (
            filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No tags selected</p>
          )}
        </div>
        
        {/* Tag suggestions */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Suggested tags:</p>
          <div className="flex flex-wrap gap-2">
            {tagSuggestions.slice(0, 8).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleAddTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
