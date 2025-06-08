
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface OaklandMemoryTypeFilterProps {
  filterType: string | null;
  setFilterType: (type: string | null) => void;
}

const memoryTypes = [
  { value: 'game', label: 'Game Memories' },
  { value: 'tailgate', label: 'Tailgate' },
  { value: 'championship', label: 'Championships' },
  { value: 'protest', label: 'Protest' },
  { value: 'community', label: 'Community' },
  { value: 'farewell', label: 'Farewell' },
  { value: 'player_moment', label: 'Player Moments' },
  { value: 'season_highlight', label: 'Season Highlights' }
];

const OaklandMemoryTypeFilter: React.FC<OaklandMemoryTypeFilterProps> = ({
  filterType,
  setFilterType
}) => {
  return (
    <Select
      value={filterType || "all"}
      onValueChange={(value) => setFilterType(value === "all" ? null : value)}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="All memory types" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All memory types</SelectItem>
        {memoryTypes.map(type => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OaklandMemoryTypeFilter;
