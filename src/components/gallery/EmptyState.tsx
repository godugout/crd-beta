
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search, Plus } from 'lucide-react';

interface EmptyStateProps {
  isEmpty: boolean;
  isFiltered: boolean;
  onRefresh: () => Promise<void>;
  onClearFilters?: () => void;
  onCreateNew?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  isEmpty,
  isFiltered,
  onRefresh,
  onClearFilters,
  onCreateNew,
  title,
  description,
  className = ''
}) => {
  const defaultTitle = isFiltered 
    ? 'No matching cards found' 
    : 'No cards yet';
    
  const defaultDescription = isFiltered
    ? 'Try adjusting your search or filters to find what you\'re looking for.'
    : 'Add cards to your collection to see them here.';

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        {isFiltered ? (
          <Search className="h-8 w-8 text-gray-400" />
        ) : (
          <div className="rounded-full bg-gray-200 p-3">
            <Plus className="h-6 w-6 text-gray-500" />
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-medium mb-2">
        {title || defaultTitle}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md">
        {description || defaultDescription}
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {isFiltered && onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
        
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Create new
          </Button>
        )}
        
        <Button variant="ghost" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
