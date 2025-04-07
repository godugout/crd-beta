
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OaklandMemoryTypeFilterProps {
  filterType: string | null;
  setFilterType: (value: string | null) => void;
}

const OaklandMemoryTypeFilter: React.FC<OaklandMemoryTypeFilterProps> = ({
  filterType,
  setFilterType
}) => {
  return (
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
  );
};

export default OaklandMemoryTypeFilter;
