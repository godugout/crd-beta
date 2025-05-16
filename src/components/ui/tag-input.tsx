
import React, { useState, KeyboardEvent } from 'react';
import { Input } from './input';
import { Badge } from './badge';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => boolean;
  onRemoveTag: (tag: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  placeholder = 'Add tags...',
  disabled = false,
  maxTags = 20,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      // Check if we've hit the max tags limit
      if (tags.length >= maxTags) {
        return;
      }
      
      // Call the onAddTag function and only clear input if it returns true
      const success = onAddTag(inputValue.trim());
      if (success) {
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove the last tag when backspace is pressed on empty input
      onRemoveTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className={`p-1 border rounded-md flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          {tag}
          <button
            type="button"
            onClick={() => onRemoveTag(tag)}
            disabled={disabled}
            className="ml-1 rounded-full hover:bg-gray-300/20 p-0.5"
          >
            <X size={12} />
            <span className="sr-only">Remove {tag}</span>
          </button>
        </Badge>
      ))}
      
      {tags.length < maxTags && (
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={tags.length ? '' : placeholder}
          disabled={disabled}
          className="flex-1 min-w-[120px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      )}
    </div>
  );
};

export default TagInput;
