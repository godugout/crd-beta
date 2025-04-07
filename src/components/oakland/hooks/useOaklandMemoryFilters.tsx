
import { useState, useMemo } from 'react';
import { Card } from '@/lib/types';
import { format, isValid, parse } from 'date-fns';

export const useOaklandMemoryFilters = (cards: Card[]) => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpponent, setFilterOpponent] = useState<string | null>(null);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [filterDateFrom, setFilterDateFrom] = useState<string | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<string | null>(null);
  const [showHistoricalOnly, setShowHistoricalOnly] = useState(false);
  
  const oaklandCards = useMemo(() => 
    cards.filter(card => card.designMetadata && card.designMetadata.oaklandMemory),
  [cards]);
  
  const allOpponents = useMemo(() => Array.from(new Set(
    oaklandCards
      .map(card => card.designMetadata?.oaklandMemory?.opponent)
      .filter(Boolean) as string[]
  )).sort(), [oaklandCards]);
  
  const allLocations = useMemo(() => Array.from(new Set(
    oaklandCards
      .map(card => card.designMetadata?.oaklandMemory?.location)
      .filter(Boolean) as string[]
  )).sort(), [oaklandCards]);
  
  const filteredCards = useMemo(() => oaklandCards.filter(card => {
    const oaklandMemory = card.designMetadata?.oaklandMemory;
    if (!oaklandMemory) return false;
    
    if (filterType && oaklandMemory.memoryType !== filterType) {
      return false;
    }
    
    if (filterOpponent && oaklandMemory.opponent !== filterOpponent) {
      return false;
    }
    
    if (filterLocation && oaklandMemory.location !== filterLocation) {
      return false;
    }
    
    if (filterDateFrom || filterDateTo) {
      const memoryDate = oaklandMemory.date ? new Date(oaklandMemory.date) : null;
      
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
    
    if (showHistoricalOnly && !oaklandMemory.historicalContext) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const inTitle = card.title.toLowerCase().includes(searchLower);
      const inDescription = card.description.toLowerCase().includes(searchLower);
      const inTags = card.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      const inHistorical = oaklandMemory.historicalContext?.toLowerCase().includes(searchLower);
      const inPersonal = oaklandMemory.personalSignificance?.toLowerCase().includes(searchLower);
      
      return inTitle || inDescription || inTags || inHistorical || inPersonal;
    }
    
    return true;
  }), [oaklandCards, filterType, searchTerm, filterOpponent, filterLocation, filterDateFrom, filterDateTo, showHistoricalOnly]);
  
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
    filteredCards,
    clearFilters
  };
};
