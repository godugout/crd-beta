
import React, { useState } from 'react';
import { FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';

interface TagFieldProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagField: React.FC<TagFieldProps> = ({ tags, onTagsChange }) => {
  const [newTag, setNewTag] = useState<string>('');

  // Add tag to list
  const handleAddTag = () => {
    if (newTag.trim() === '') return;
    
    onTagsChange([...tags, newTag.toLowerCase()]);
    setNewTag('');
  };

  // Remove tag from list
  const handleRemoveTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <FormLabel className="block mb-2">Tags</FormLabel>
      <div className="flex gap-2 mb-2">
        <Input 
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          placeholder="Add tags (e.g. no-hitter, walkoff)"
          className="flex-grow"
          onKeyPress={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
        />
        <Button type="button" onClick={handleAddTag} size="sm">
          <PlusCircle className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <div 
              key={index}
              className="bg-[#003831] text-[#EFB21E] px-3 py-1 rounded-full flex items-center text-sm"
            >
              <span>#{tag}</span>
              <button 
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="ml-1 text-[#EFB21E]/70 hover:text-[#EFB21E]"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <FormMessage />
    </div>
  );
};

export default TagField;
