
import React from 'react';
import { Button } from '@/components/ui/button';

interface OaklandActiveFiltersProps {
  filterType: string | null;
  filterOpponent: string | null;
  filterLocation: string | null;
  filterDateFrom: string | null;
  filterDateTo: string | null;
  showHistoricalOnly: boolean;
  setFilterType: (value: string | null) => void;
  setFilterOpponent: (value: string | null) => void;
  setFilterLocation: (value: string | null) => void;
  setFilterDateFrom: (value: string | null) => void;
  setFilterDateTo: (value: string | null) => void;
  setShowHistoricalOnly: (value: boolean) => void;
  clearFilters: () => void;
}

const OaklandActiveFilters: React.FC<OaklandActiveFiltersProps> = ({
  filterType,
  filterOpponent,
  filterLocation,
  filterDateFrom,
  filterDateTo,
  showHistoricalOnly,
  setFilterType,
  setFilterOpponent,
  setFilterLocation,
  setFilterDateFrom,
  setFilterDateTo,
  setShowHistoricalOnly,
  clearFilters
}) => {
  const hasActiveFilters = filterType || filterOpponent || filterLocation || 
    filterDateFrom || filterDateTo || showHistoricalOnly;
    
  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2 items-center">
      <span className="text-sm text-gray-500">Active filters:</span>
      
      {filterType && (
        <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center">
          <span>Type: {filterType}</span>
          <button 
            onClick={() => setFilterType(null)} 
            className="ml-1 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
      
      {filterOpponent && (
        <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center">
          <span>Opponent: {filterOpponent}</span>
          <button 
            onClick={() => setFilterOpponent(null)} 
            className="ml-1 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
      
      {filterLocation && (
        <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center">
          <span>Location: {filterLocation}</span>
          <button 
            onClick={() => setFilterLocation(null)} 
            className="ml-1 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
      
      {(filterDateFrom || filterDateTo) && (
        <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center">
          <span>Date: {filterDateFrom || 'Any'} to {filterDateTo || 'Any'}</span>
          <button 
            onClick={() => {
              setFilterDateFrom(null);
              setFilterDateTo(null);
            }} 
            className="ml-1 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
      
      {showHistoricalOnly && (
        <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center">
          <span>Has historical context</span>
          <button 
            onClick={() => setShowHistoricalOnly(false)} 
            className="ml-1 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={clearFilters}
        className="text-xs h-6"
      >
        Clear all
      </Button>
    </div>
  );
};

export default OaklandActiveFilters;
