
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface AssetFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFolder: string;
  onFolderChange: (folder: string) => void;
  selectedMimeType?: string;
  onMimeTypeChange: (mimeType?: string) => void;
  allowedTypes?: string[];
  className?: string;
}

const AssetFilterBar: React.FC<AssetFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedFolder,
  onFolderChange,
  selectedMimeType,
  onMimeTypeChange,
  allowedTypes,
  className = '',
}) => {
  const folderOptions = [
    { label: 'All Files', value: 'uploads' },
    { label: 'Cards', value: 'cards' },
    { label: 'Collections', value: 'collections' },
    { label: 'Avatars', value: 'avatars' },
  ];
  
  const getMimeTypeOptions = () => {
    if (allowedTypes && allowedTypes.length > 0) {
      return [
        { label: 'All Types', value: '' },
        ...allowedTypes.map(type => {
          // Handle wildcard mime types like "image/*"
          if (type.endsWith('*')) {
            const prefix = type.split('/')[0];
            return {
              label: prefix.charAt(0).toUpperCase() + prefix.slice(1),
              value: prefix + '/'
            };
          }
          // Handle specific mime types
          return {
            label: type.split('/').pop()!.charAt(0).toUpperCase() + type.split('/').pop()!.slice(1),
            value: type
          };
        })
      ];
    }
    
    // Default options
    return [
      { label: 'All Types', value: '' },
      { label: 'Images', value: 'image/' },
      { label: 'Documents', value: 'application/' },
      { label: 'Audio', value: 'audio/' },
      { label: 'Video', value: 'video/' },
    ];
  };
  
  const mimeTypeOptions = getMimeTypeOptions();
  
  return (
    <div className={`flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 ${className}`}>
      <div className="flex-1 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Select value={selectedFolder} onValueChange={onFolderChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select folder" />
        </SelectTrigger>
        <SelectContent>
          {folderOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={selectedMimeType || ''} 
        onValueChange={(value) => onMimeTypeChange(value || undefined)}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="File type" />
        </SelectTrigger>
        <SelectContent>
          {mimeTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AssetFilterBar;
