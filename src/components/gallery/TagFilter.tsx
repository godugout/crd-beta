
import React from 'react';
import { cn } from '@/lib/utils';
import { Tag, X } from 'lucide-react';

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
  className = ""
}) => {
  if (allTags.length === 0) return null;
  
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center mb-2">
        <Tag size={16} className="mr-2 text-cardshow-slate" />
        <h3 className="text-sm font-medium text-cardshow-dark">Filter by tags</h3>
        
        {(selectedTags.length > 0) && onClearFilters && (
          <button 
            onClick={onClearFilters}
            className="ml-auto text-xs text-cardshow-blue hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {allTags.map((tag, index) => (
          <button
            key={index}
            onClick={() => onTagSelect(tag)}
            className={cn(
              "flex items-center text-xs px-3 py-1.5 rounded-full transition-colors",
              selectedTags.includes(tag) 
                ? "bg-cardshow-blue text-white" 
                : "bg-cardshow-blue-light text-cardshow-blue hover:bg-cardshow-blue-light/70"
            )}
          >
            {tag}
            {selectedTags.includes(tag) && (
              <X size={12} className="ml-1" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
