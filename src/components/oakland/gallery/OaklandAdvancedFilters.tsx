
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface OaklandAdvancedFiltersProps {
  filterOpponent: string | null;
  setFilterOpponent: (value: string | null) => void;
  filterLocation: string | null;
  setFilterLocation: (value: string | null) => void;
  filterDateFrom: string | null;
  setFilterDateFrom: (value: string | null) => void;
  filterDateTo: string | null;
  setFilterDateTo: (value: string | null) => void;
  showHistoricalOnly: boolean;
  setShowHistoricalOnly: (value: boolean) => void;
  clearFilters: () => void;
  allOpponents: string[];
  allLocations: string[];
}

const OaklandAdvancedFilters: React.FC<OaklandAdvancedFiltersProps> = ({
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
  clearFilters,
  allOpponents,
  allLocations
}) => {
  const handleDialogClose = () => {
    const closeButton = document.querySelector('button[aria-label="Close"]');
    if (closeButton && closeButton instanceof HTMLButtonElement) {
      closeButton.click();
    }
  };

  return (
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
  );
};

export default OaklandAdvancedFilters;
