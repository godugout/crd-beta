import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import OaklandMemoryCard from './OaklandMemoryCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, SlidersHorizontal, Filter, Calendar, MapPin } from 'lucide-react';
import { OaklandTemplateType } from './OaklandCardTemplates';
import { OaklandMemoryData } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isValid, parse } from 'date-fns';

const OaklandMemoryGallery = () => {
  const { cards } = useCards();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpponent, setFilterOpponent] = useState<string | null>(null);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [filterDateFrom, setFilterDateFrom] = useState<string | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<string | null>(null);
  const [showHistoricalOnly, setShowHistoricalOnly] = useState(false);
  
  const oaklandCards = cards.filter(card => 
    card.designMetadata && 
    card.designMetadata.oaklandMemory
  );
  
  const allOpponents = Array.from(new Set(
    oaklandCards
      .map(card => card.designMetadata?.oaklandMemory?.opponent)
      .filter(Boolean) as string[]
  )).sort();
  
  const allLocations = Array.from(new Set(
    oaklandCards
      .map(card => card.designMetadata?.oaklandMemory?.location)
      .filter(Boolean) as string[]
  )).sort();
  
  const filteredCards = oaklandCards.filter(card => {
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
  });
  
  const clearFilters = () => {
    setFilterType(null);
    setSearchTerm('');
    setFilterOpponent(null);
    setFilterLocation(null);
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setShowHistoricalOnly(false);
  };
  
  const handleDialogClose = () => {
    const closeButton = document.querySelector('button[aria-label="Close"]');
    if (closeButton && 'click' in closeButton) {
      (closeButton as HTMLButtonElement).click();
    }
  };
  
  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search memories..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          <Select 
            value={filterType || "all"} 
            onValueChange={value => setFilterType(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All memory types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All memory types</SelectItem>
              <SelectItem value="game">Game Day</SelectItem>
              <SelectItem value="tailgate">Tailgate Party</SelectItem>
              <SelectItem value="memorabilia">Memorabilia</SelectItem>
              <SelectItem value="historical">Historical Moment</SelectItem>
              <SelectItem value="fan_experience">Fan Experience</SelectItem>
              <SelectItem value="stats">Stats & Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Advanced Filters</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Opponent:</label>
                <div className="col-span-3">
                  <Select 
                    value={filterOpponent || ""}
                    onValueChange={value => setFilterOpponent(value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any opponent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any opponent</SelectItem>
                      {allOpponents.map(opponent => (
                        <SelectItem key={opponent} value={opponent}>{opponent}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Location:</label>
                <div className="col-span-3">
                  <Select
                    value={filterLocation || ""}
                    onValueChange={value => setFilterLocation(value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any location</SelectItem>
                      {allLocations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Date from:</label>
                <div className="col-span-3">
                  <Input 
                    type="date" 
                    value={filterDateFrom || ''}
                    onChange={e => setFilterDateFrom(e.target.value || null)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Date to:</label>
                <div className="col-span-3">
                  <Input 
                    type="date" 
                    value={filterDateTo || ''}
                    onChange={e => setFilterDateTo(e.target.value || null)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Content:</label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox 
                    id="historical" 
                    checked={showHistoricalOnly}
                    onCheckedChange={(checked) => 
                      setShowHistoricalOnly(checked === true)
                    }
                  />
                  <label htmlFor="historical" className="text-sm font-medium leading-none">
                    Show only memories with historical context
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button type="button" onClick={handleDialogClose}>
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button asChild>
          <Link to="/oakland-memory-creator">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Memory
          </Link>
        </Button>
      </div>
      
      {(filterType || filterOpponent || filterLocation || filterDateFrom || filterDateTo || showHistoricalOnly) && (
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
      )}
      
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCards.map(card => {
            const oaklandMemory = card.designMetadata?.oaklandMemory;
            if (!oaklandMemory) return null;
            
            const memoryData: OaklandMemoryData = {
              title: card.title,
              description: card.description,
              date: oaklandMemory.date,
              opponent: oaklandMemory.opponent,
              score: oaklandMemory.score,
              location: oaklandMemory.location,
              section: oaklandMemory.section,
              memoryType: oaklandMemory.memoryType,
              attendees: oaklandMemory.attendees || [],
              tags: card.tags || [],
              imageUrl: oaklandMemory.imageUrl || card.imageUrl,
              historicalContext: oaklandMemory.historicalContext,
              personalSignificance: oaklandMemory.personalSignificance,
            };
            
            return (
              <Link key={card.id} to={`/oakland-memory/${card.id}`}>
                <OaklandMemoryCard 
                  memory={memoryData}
                  templateType={(oaklandMemory.template as OaklandTemplateType) || 'classic'}
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No memories match your filters</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search criteria or create a new memory</p>
          <Button asChild>
            <Link to="/oakland-memory-creator">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Memory
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default OaklandMemoryGallery;
