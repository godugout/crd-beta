
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, LayoutList, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ViewModeSelectorProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortOrder: string;
  onSortChange: (order: string) => void;
}

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ 
  viewMode, 
  setViewMode, 
  sortOrder, 
  onSortChange 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('grid')}
          className="flex items-center"
        >
          <Grid3X3 className="h-4 w-4 mr-2" />
          Grid
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="flex items-center"
        >
          <LayoutList className="h-4 w-4 mr-2" />
          List
        </Button>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            {sortOrder === 'newest' && 'Newest First'}
            {sortOrder === 'oldest' && 'Oldest First'}
            {sortOrder === 'az' && 'A-Z'}
            {sortOrder === 'za' && 'Z-A'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => onSortChange('newest')}
            >
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => onSortChange('oldest')}
            >
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => onSortChange('az')}
            >
              Alphabetical (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => onSortChange('za')}
            >
              Alphabetical (Z-A)
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ViewModeSelector;
