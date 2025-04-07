
import React from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useOaklandMemoryFilters } from './hooks/useOaklandMemoryFilters';
import OaklandMemorySearch from './gallery/OaklandMemorySearch';
import OaklandMemoryTypeFilter from './gallery/OaklandMemoryTypeFilter';
import OaklandAdvancedFilters from './gallery/OaklandAdvancedFilters';
import OaklandActiveFilters from './gallery/OaklandActiveFilters';
import OaklandMemoryGrid from './gallery/OaklandMemoryGrid';
import OaklandNoResults from './gallery/OaklandNoResults';

const OaklandMemoryGallery = () => {
  const { cards } = useCards();
  const {
    filterType,
    setFilterType,
    searchTerm,
    setSearchTerm,
    filterOpponent,
    setFilterOpponent,
    filterLocation,
    setFilterLocation,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    showHistoricalOnly,
    setShowHistoricalOnly,
    allOpponents,
    allLocations,
    filteredCards,
    clearFilters
  } = useOaklandMemoryFilters(cards);
  
  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <OaklandMemorySearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        <OaklandMemoryTypeFilter
          filterType={filterType}
          setFilterType={setFilterType}
        />
        
        <OaklandAdvancedFilters 
          filterOpponent={filterOpponent}
          setFilterOpponent={setFilterOpponent}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          filterDateFrom={filterDateFrom}
          setFilterDateFrom={setFilterDateFrom}
          filterDateTo={filterDateTo}
          setFilterDateTo={setFilterDateTo}
          showHistoricalOnly={showHistoricalOnly}
          setShowHistoricalOnly={setShowHistoricalOnly}
          clearFilters={clearFilters}
          allOpponents={allOpponents}
          allLocations={allLocations}
        />
        
        <Button asChild>
          <Link to="/oakland-memory-creator">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Memory
          </Link>
        </Button>
      </div>
      
      <OaklandActiveFilters
        filterType={filterType}
        filterOpponent={filterOpponent}
        filterLocation={filterLocation}
        filterDateFrom={filterDateFrom}
        filterDateTo={filterDateTo}
        showHistoricalOnly={showHistoricalOnly}
        setFilterType={setFilterType}
        setFilterOpponent={setFilterOpponent}
        setFilterLocation={setFilterLocation}
        setFilterDateFrom={setFilterDateFrom}
        setFilterDateTo={setFilterDateTo}
        setShowHistoricalOnly={setShowHistoricalOnly}
        clearFilters={clearFilters}
      />
      
      {filteredCards.length > 0 ? (
        <OaklandMemoryGrid cards={filteredCards} />
      ) : (
        <OaklandNoResults />
      )}
    </div>
  );
};

export default OaklandMemoryGallery;
