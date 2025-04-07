
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface OaklandMemorySearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const OaklandMemorySearch: React.FC<OaklandMemorySearchProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="relative flex-grow max-w-md">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search memories..."
        className="pl-8"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default OaklandMemorySearch;
