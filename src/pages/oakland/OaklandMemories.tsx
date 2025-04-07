
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OaklandMemoryGrid, OaklandMemorySearch, OaklandActiveFilters, OaklandAdvancedFilters } from '@/components/oakland/gallery';
import { useOaklandMemoryFilters } from '@/components/oakland/hooks/useOaklandMemoryFilters';

const OaklandMemories = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedTypes,
    setSelectedTypes,
    activeFilters,
    resetFilters,
    filteredMemories,
    isLoading,
    showAdvancedFilters,
    setShowAdvancedFilters,
    handleMemoryTypeFilter,
    dateRange,
    setDateRange,
    sections,
    setSections
  } = useOaklandMemoryFilters();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#003831]">Oakland A's Memories</h1>
              <p className="text-gray-600 mt-2">
                Browse and explore fan memories from the Oakland Coliseum and beyond.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link to="/oakland/create">
                <Button className="bg-[#006341] hover:bg-[#006341]/90 flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Memory
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="h-1 bg-gradient-to-r from-[#003831] via-[#006341] to-[#EFB21E] mt-4"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar with filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <OaklandMemorySearch 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
              />
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  {showAdvancedFilters ? 'Basic' : 'Advanced'}
                </Button>
              </div>
              
              <OaklandMemoryTypeFilter 
                selectedTypes={selectedTypes}
                onTypeChange={handleMemoryTypeFilter}
              />
              
              {showAdvancedFilters && (
                <OaklandAdvancedFilters
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  sections={sections}
                  setSections={setSections}
                />
              )}
              
              {activeFilters > 0 && (
                <Button 
                  variant="link" 
                  onClick={resetFilters}
                  className="mt-2 h-8 pl-1 text-[#003831]"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-grow">
            <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">
                  {filteredMemories.length} {filteredMemories.length === 1 ? 'Memory' : 'Memories'}
                </h2>
                <div className="flex gap-2">
                  {/* Additional actions could go here */}
                </div>
              </div>
              
              {activeFilters > 0 && (
                <OaklandActiveFilters
                  searchQuery={searchQuery}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                  setSearchQuery={setSearchQuery}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  sections={sections} 
                  setSections={setSections}
                />
              )}
            </div>
            
            <OaklandMemoryGrid 
              memories={filteredMemories}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// Temporary internal component until we implement the real one
const OaklandMemoryTypeFilter: React.FC<{
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
}> = ({ selectedTypes, onTypeChange }) => {
  const types = [
    { id: 'game', label: 'Game Day' },
    { id: 'player', label: 'Player' },
    { id: 'memorabilia', label: 'Memorabilia' },
    { id: 'fan', label: 'Fan Experience' },
    { id: 'historic', label: 'Historic Moment' },
  ];
  
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium mb-2 text-gray-500">Memory Types</h4>
      {types.map(type => (
        <div key={type.id} className="flex items-center">
          <input
            type="checkbox"
            id={`type-${type.id}`}
            checked={selectedTypes.includes(type.id)}
            onChange={() => onTypeChange(type.id)}
            className="rounded border-gray-300 text-[#006341] focus:ring-[#006341]"
          />
          <label htmlFor={`type-${type.id}`} className="ml-2 text-sm text-gray-700">
            {type.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default OaklandMemories;
