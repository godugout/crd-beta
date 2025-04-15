
import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const TagInput: React.FC<TagInputProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Add a tag...', 
  maxTags = 10
}) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // If Enter is pressed and we have text, add tag
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      
      // Check if we've reached max tags
      if (value.length >= maxTags) {
        return;
      }
      
      // Normalize tag: trim whitespace & convert to lowercase
      const normalizedTag = inputValue.trim().toLowerCase();
      
      // Only add if not already present
      if (!value.includes(normalizedTag)) {
        onChange([...value, normalizedTag]);
      }
      
      // Clear the input
      setInputValue('');
    }
    
    // If Backspace is pressed and input is empty, remove last tag
    if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
      {value.map(tag => (
        <Badge 
          key={tag} 
          variant="secondary"
          className="flex items-center gap-1"
        >
          {tag}
          <button 
            type="button" 
            onClick={() => removeTag(tag)}
            className="rounded-full hover:bg-gray-200 p-0.5"
          >
            <X size={12} />
            <span className="sr-only">Remove tag {tag}</span>
          </button>
        </Badge>
      ))}
      
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-grow w-auto min-w-[8rem] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7"
        disabled={value.length >= maxTags}
      />
    </div>
  );
};

export default TagInput;
