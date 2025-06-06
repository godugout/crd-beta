
import React from 'react';
import { Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface GalleryToolbarProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  filters: FilterOption[];
  selectedFilter: string;
  setSelectedFilter: (id: string) => void;
}

const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
  viewMode,
  setViewMode,
  filters,
  selectedFilter,
  setSelectedFilter,
}) => {
  return (
    <div className="flex items-center justify-between my-6">
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
            {filter.count !== undefined && (
              <Badge className="ml-2 bg-white/20 text-white/90">
                {filter.count}
              </Badge>
            )}
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
  );
};

export default GalleryToolbar;
