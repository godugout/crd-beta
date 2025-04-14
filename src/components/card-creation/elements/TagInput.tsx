
import React, { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ 
  tags, 
  setTags, 
  placeholder = "Add tags and press Enter" 
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag when backspace is pressed and input is empty
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="border rounded-md p-2 focus-within:ring-1 focus-within:ring-litmus-green focus-within:border-litmus-green">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary"
            className="flex items-center gap-1 bg-litmus-green/10 text-litmus-green"
          >
            {tag}
            <XCircle 
              className="h-3 w-3 cursor-pointer hover:text-red-500" 
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="border-none focus:ring-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default TagInput;
