
import React from 'react';
import { PlusCircle, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchInput from './SearchInput';

interface GalleryToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateCard: () => void;
}

export const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onCreateCard
}) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <SearchInput 
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search cards..."
      />
      
      <div className="flex gap-2">
        <div className="flex rounded-lg border overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none",
              viewMode === 'grid' && "bg-gray-100"
            )}
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none",
              viewMode === 'list' && "bg-gray-100"
            )}
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      
        <Button
          onClick={onCreateCard}
          className="flex items-center justify-center rounded-lg bg-cardshow-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Card
        </Button>
      </div>
    </div>
  );
};
