
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { useOaklandMemories } from '@/hooks/useOaklandMemories';
import { useOaklandMemoryFilters } from '@/hooks/useOaklandMemoryFilters';
import OaklandProfessionalMemoryGrid from '@/components/oakland/OaklandProfessionalMemoryGrid';
import OaklandMemorySearch from '@/components/oakland/gallery/OaklandMemorySearch';
import OaklandMemoryTypeFilter from '@/components/oakland/gallery/OaklandMemoryTypeFilter';
import OaklandAdvancedFilters from '@/components/oakland/gallery/OaklandAdvancedFilters';
import OaklandActiveFilters from '@/components/oakland/gallery/OaklandActiveFilters';

function OaklandMemories() {
  const { memories, loading, error } = useOaklandMemories();
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
    filteredMemories,
    clearFilters
  } = useOaklandMemoryFilters(memories);
  
  if (error) {
    return (
      <PageLayout 
        title="Oakland A's Memories"
        description="Browse fan memories from Oakland's baseball history"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Error Loading Memories</h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Oakland A's Memories"
      description="Browse fan memories from Oakland's baseball history"
      primaryAction={{
        label: 'Create Memory',
        icon: <PlusCircle className="h-4 w-4" />,
        href: '/teams/oakland-athletics/create'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oakland A's Fan Memories
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explore the rich history of Oakland baseball through the eyes of the fans who lived it. 
            From dynasty years to heartbreak moments, these are our stories.
          </p>
        </div>

        {/* Filters */}
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
            <Link to="/teams/oakland-athletics/create">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Memory
            </Link>
          </Button>
        </div>
        
        {/* Active Filters */}
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
        
        {/* Stats */}
        {!loading && memories.length > 0 && (
          <div className="mb-6 text-sm text-gray-600">
            Showing {filteredMemories.length} of {memories.length} memories
          </div>
        )}

        {/* Memory Grid */}
        <OaklandProfessionalMemoryGrid 
          memories={filteredMemories} 
          loading={loading}
        />
      </div>
    </PageLayout>
  );
}

export default OaklandMemories;
