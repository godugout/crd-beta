
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid3X3, List } from 'lucide-react';

interface TeamsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  activeView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const TeamsSearch = ({ 
  searchTerm, 
  onSearchChange, 
  onSearch, 
  activeView, 
  onViewChange 
}: TeamsSearchProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 flex gap-2">
        <Input 
          value={searchTerm} 
          onChange={(e) => onSearchChange(e.target.value)} 
          placeholder="Search teams" 
          className="flex-1"
        />
        <Button onClick={onSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex border rounded-md p-1">
          <Button
            variant={activeView === 'grid' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => onViewChange('grid')}
            className="rounded-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button 
            variant={activeView === 'list' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => onViewChange('list')}
            className="rounded-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" /> Filters
        </Button>
      </div>
    </div>
  );
};

export default TeamsSearch;
