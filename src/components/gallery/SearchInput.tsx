
import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value,
  onChange,
  placeholder = "Search...",
  className = ""
}) => {
  return (
    <div className={`relative flex-1 max-w-md ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-litmus-gray-700 rounded-lg focus:ring-2 focus:ring-litmus-purple/50 dark:focus:ring-litmus-purple/70 focus:border-litmus-purple dark:focus:border-litmus-purple bg-white dark:bg-litmus-gray-800 text-gray-900 dark:text-white transition-all duration-200"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchInput;
