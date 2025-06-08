
import { useState, useMemo } from 'react';
import { OaklandMemory } from '@/hooks/useOaklandMemories';

export const useOaklandMemoryFilters = (memories: OaklandMemory[]) => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpponent, setFilterOpponent] = useState<string | null>(null);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [filterDateFrom, setFilterDateFrom] = useState<string | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<string | null>(null);
  const [showHistoricalOnly, setShowHistoricalOnly] = useState(false);

  // Extract unique opponents and locations
  const allOpponents = useMemo(() => {
    const opponents = memories
      .map(memory => memory.opponent)
      .filter((opponent): opponent is string => Boolean(opponent))
      .filter((opponent, index, array) => array.indexOf(opponent) === index)
      .sort();
    return opponents;
  }, [memories]);

  const allLocations = useMemo(() => {
    const locations = memories
      .map(memory => memory.location)
      .filter((location): location is string => Boolean(location))
      .filter((location, index, array) => array.indexOf(location) === index)
      .sort();
    return locations;
  }, [memories]);

  // Filter memories based on current filters
  const filteredMemories = useMemo(() => {
    return memories.filter(memory => {
      // Filter by type
      if (filterType && memory.memory_type !== filterType) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = memory.title.toLowerCase().includes(searchLower);
        const descriptionMatch = memory.description?.toLowerCase().includes(searchLower);
        const opponentMatch = memory.opponent?.toLowerCase().includes(searchLower);
        const tagsMatch = memory.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!titleMatch && !descriptionMatch && !opponentMatch && !tagsMatch) {
          return false;
        }
      }

      // Filter by opponent
      if (filterOpponent && memory.opponent !== filterOpponent) {
        return false;
      }

      // Filter by location
      if (filterLocation && memory.location !== filterLocation) {
        return false;
      }

      // Filter by date range
      if (filterDateFrom && memory.game_date) {
        if (new Date(memory.game_date) < new Date(filterDateFrom)) {
          return false;
        }
      }

      if (filterDateTo && memory.game_date) {
        if (new Date(memory.game_date) > new Date(filterDateTo)) {
          return false;
        }
      }

      // Filter by historical context
      if (showHistoricalOnly && !memory.historical_context) {
        return false;
      }

      return true;
    });
  }, [
    memories,
    filterType,
    searchTerm,
    filterOpponent,
    filterLocation,
    filterDateFrom,
    filterDateTo,
    showHistoricalOnly
  ]);

  const clearFilters = () => {
    setFilterType(null);
    setSearchTerm('');
    setFilterOpponent(null);
    setFilterLocation(null);
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setShowHistoricalOnly(false);
  };

  const hasActiveFilters = !!(
    filterType ||
    searchTerm ||
    filterOpponent ||
    filterLocation ||
    filterDateFrom ||
    filterDateTo ||
    showHistoricalOnly
  );

  return {
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
    clearFilters,
    hasActiveFilters
  };
};
