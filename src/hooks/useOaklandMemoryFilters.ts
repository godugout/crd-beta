
import { useState, useMemo } from 'react';
import { OaklandMemory } from './useOaklandMemories';
import { isValid, parse } from 'date-fns';

export const useOaklandMemoryFilters = (memories: OaklandMemory[]) => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpponent, setFilterOpponent] = useState<string | null>(null);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [filterDateFrom, setFilterDateFrom] = useState<string | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<string | null>(null);
  const [showHistoricalOnly, setShowHistoricalOnly] = useState(false);
  
  const allOpponents = useMemo(() => Array.from(new Set(
    memories
      .map(memory => memory.opponent)
      .filter(Boolean) as string[]
  )).sort(), [memories]);
  
  const allLocations = useMemo(() => Array.from(new Set(
    memories
      .map(memory => memory.location)
      .filter(Boolean) as string[]
  )).sort(), [memories]);
  
  const filteredMemories = useMemo(() => memories.filter(memory => {
    if (filterType && memory.memory_type !== filterType) {
      return false;
    }
    
    if (filterOpponent && memory.opponent !== filterOpponent) {
      return false;
    }
    
    if (filterLocation && memory.location !== filterLocation) {
      return false;
    }
    
    if (filterDateFrom || filterDateTo) {
      const memoryDate = memory.game_date ? new Date(memory.game_date) : null;
      
      if (memoryDate) {
        if (filterDateFrom) {
          const fromDate = parse(filterDateFrom, 'yyyy-MM-dd', new Date());
          if (isValid(fromDate) && memoryDate < fromDate) {
            return false;
          }
        }
        
        if (filterDateTo) {
          const toDate = parse(filterDateTo, 'yyyy-MM-dd', new Date());
          if (isValid(toDate) && memoryDate > toDate) {
            return false;
          }
        }
      }
    }
    
    if (showHistoricalOnly && !memory.historical_context) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const inTitle = memory.title.toLowerCase().includes(searchLower);
      const inDescription = memory.description?.toLowerCase().includes(searchLower);
      const inTags = memory.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      const inHistorical = memory.historical_context?.toLowerCase().includes(searchLower);
      const inPersonal = memory.personal_significance?.toLowerCase().includes(searchLower);
      
      return inTitle || inDescription || inTags || inHistorical || inPersonal;
    }
    
    return true;
  }), [memories, filterType, searchTerm, filterOpponent, filterLocation, filterDateFrom, filterDateTo, showHistoricalOnly]);
  
  const clearFilters = () => {
    setFilterType(null);
    setSearchTerm('');
    setFilterOpponent(null);
    setFilterLocation(null);
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setShowHistoricalOnly(false);
  };
  
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
    clearFilters
  };
};
