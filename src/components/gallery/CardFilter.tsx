
import React from 'react';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckIcon, FilterIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type FilterOptions = {
  categories?: string[];
  tags?: string[];
  years?: string[];
};

interface CardFilterProps {
  cards: Card[];
  onFilterChange: (filterOptions: FilterOptions) => void;
  activeFilters?: FilterOptions;
}

const CardFilter: React.FC<CardFilterProps> = ({
  cards,
  onFilterChange,
  activeFilters = {}
}) => {
  // Extract unique values for filter categories
  const allTags = [...new Set(cards.flatMap(card => card.tags || []))];
  const allYears = [...new Set(cards.map(card => card.year).filter(Boolean))];
  
  const handleTagClick = (tag: string) => {
    const currentTags = activeFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
      
    onFilterChange({
      ...activeFilters,
      tags: newTags
    });
  };
  
  const handleYearClick = (year: string) => {
    const currentYears = activeFilters.years || [];
    const newYears = currentYears.includes(year)
      ? currentYears.filter(y => y !== year)
      : [...currentYears, year];
      
    onFilterChange({
      ...activeFilters,
      years: newYears
    });
  };
  
  const clearFilters = () => {
    onFilterChange({});
  };
  
  const hasActiveFilters = (
    (activeFilters.tags && activeFilters.tags.length > 0) ||
    (activeFilters.years && activeFilters.years.length > 0)
  );

  return (
    <div className="flex items-center gap-2 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={hasActiveFilters ? "default" : "outline"}
            size="sm" 
            className={hasActiveFilters ? "bg-blue-600" : ""}
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
            {hasActiveFilters && (
              <span className="ml-2 bg-white text-blue-600 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                {(activeFilters.tags?.length || 0) + (activeFilters.years?.length || 0)}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter Cards</DropdownMenuLabel>
          
          {hasActiveFilters && (
            <>
              <DropdownMenuItem onClick={clearFilters} className="text-red-500 focus:text-red-500">
                Clear All Filters
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          {allTags.length > 0 && (
            <>
              <DropdownMenuLabel>Tags</DropdownMenuLabel>
              {allTags.map(tag => (
                <DropdownMenuItem 
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="flex justify-between items-center"
                >
                  {tag}
                  {activeFilters.tags?.includes(tag) && (
                    <CheckIcon className="h-4 w-4 text-blue-600" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          
          {allYears.length > 0 && (
            <>
              <DropdownMenuLabel>Years</DropdownMenuLabel>
              {allYears.map(year => (
                <DropdownMenuItem 
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className="flex justify-between items-center"
                >
                  {year}
                  {activeFilters.years?.includes(year) && (
                    <CheckIcon className="h-4 w-4 text-blue-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CardFilter;
