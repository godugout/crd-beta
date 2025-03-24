
import React from 'react';
import { Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onClearFilters?: () => void;
  className?: string;
}

const TagFilter: React.FC<TagFilterProps> = ({ 
  allTags,
  selectedTags,
  onTagSelect,
  onClearFilters,
  className
}) => {
  if (allTags.length === 0) return null;
  
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center gap-2 mb-2">
        <Tag className="h-4 w-4 text-cardshow-slate" />
        <span className="text-sm font-medium text-cardshow-dark">Filter by tags</span>
        
        {onClearFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="ml-auto text-xs h-7 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={cn(
              "text-xs px-3 py-1 rounded-full transition-colors",
              selectedTags.includes(tag)
                ? "bg-cardshow-blue text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
