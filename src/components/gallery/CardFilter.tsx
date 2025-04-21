
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export interface CardFilterProps {
  tags: string[];
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

const CardFilter: React.FC<CardFilterProps> = ({ tags, selectedTag, onSelectTag }) => {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-medium">Filter by Tag</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-2">
          <Button
            key="all"
            variant={selectedTag === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectTag('all')}
            className="rounded-full"
          >
            All Cards
          </Button>
          {tags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelectTag(tag)}
              className="rounded-full"
            >
              {tag}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CardFilter;
