
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
          {/* Opponent Filter */}
          <div className="space-y-2">
            <Label htmlFor="opponent-filter">Opponent</Label>
            <Select
              value={filterOpponent || "all"}
              onValueChange={(value) => setFilterOpponent(value === "all" ? null : value)}
            >
              <SelectTrigger id="opponent-filter">
                <SelectValue placeholder="All opponents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All opponents</SelectItem>
                {allOpponents.map(opponent => (
                  <SelectItem key={opponent} value={opponent}>
                    {opponent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <Label htmlFor="location-filter">Location</Label>
            <Select
              value={filterLocation || "all"}
              onValueChange={(value) => setFilterLocation(value === "all" ? null : value)}
            >
              <SelectTrigger id="location-filter">
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {allLocations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label htmlFor="date-from">Date From</Label>
            <Input
              id="date-from"
              type="date"
              value={filterDateFrom || ""}
              onChange={(e) => setFilterDateFrom(e.target.value || null)}
            />
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label htmlFor="date-to">Date To</Label>
            <Input
              id="date-to"
              type="date"
              value={filterDateTo || ""}
              onChange={(e) => setFilterDateTo(e.target.value || null)}
            />
          </div>

          {/* Historical Only Checkbox */}
          <div className="flex items-center space-x-2 md:col-span-2">
            <Checkbox
              id="historical-only"
              checked={showHistoricalOnly}
              onCheckedChange={(checked) => setShowHistoricalOnly(!!checked)}
            />
            <Label htmlFor="historical-only">
              Show only memories with historical context
            </Label>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end md:col-span-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default OaklandAdvancedFilters;
